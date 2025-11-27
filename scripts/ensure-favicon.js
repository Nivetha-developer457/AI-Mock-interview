const fs = require("fs");
const path = require("path");

const projectRoot = path.join(__dirname, "..");
const srcAppDir = path.join(projectRoot, "src", "app");
const publicDir = path.join(projectRoot, "public");
const backupDir = path.join(projectRoot, ".local_backups", "favicons");
const nextCache = path.join(projectRoot, ".next");

const candidates = ["favicon.ico", "favicon.png", "favicon.svg", "favicon.jpg", "favicon.jpeg", "favicon.webp"];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

try {
  ensureDir(publicDir);
  ensureDir(backupDir);

  // Move/remove any favicon files from src/app into backups
  candidates.forEach((name) => {
    const srcPath = path.join(srcAppDir, name);
    if (fs.existsSync(srcPath)) {
      const destPath = path.join(backupDir, `${Date.now()}-${name}`);
      try {
        fs.renameSync(srcPath, destPath);
        console.log(`Moved ${srcPath} -> ${destPath}`);
      } catch (err) {
        try {
          fs.copyFileSync(srcPath, destPath);
          fs.unlinkSync(srcPath);
          console.log(`Copied+removed ${srcPath} -> ${destPath}`);
        } catch (err2) {
          console.warn(`Failed to move or copy ${srcPath}:`, err2);
        }
      }
    }
  });

  // Ensure a public SVG favicon exists
  const publicSvg = path.join(publicDir, "favicon.svg");
  if (!fs.existsSync(publicSvg)) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
  <rect width="100%" height="100%" fill="#007ACC"/>
  <text x="32" y="40" font-size="32" text-anchor="middle" fill="white" font-family="Arial">S</text>
</svg>`;
    fs.writeFileSync(publicSvg, svg, "utf8");
    console.log("Created public/favicon.svg");
  } else {
    console.log("public/favicon.svg already exists");
  }

  // Remove Next cache to avoid using a previously cached failed import
  if (fs.existsSync(nextCache)) {
    try {
      fs.rmSync(nextCache, { recursive: true, force: true });
      console.log("Removed .next cache directory to force fresh compile");
    } catch (err) {
      console.warn("Failed to remove .next:", err);
    }
  } else {
    console.log(".next cache not present");
  }
} catch (err) {
  // Don't abort the dev process; just log issues
  console.error("ensure-favicon script error:", err);
}

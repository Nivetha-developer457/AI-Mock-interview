const fs = require("fs");
const path = require("path");

const projectRoot = path.join(__dirname, "..");
const src = path.join(projectRoot, "src", "app", "favicon.ico");
const publicDir = path.join(projectRoot, "public");
const dest = path.join(publicDir, "favicon.ico");

try {
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);
  if (fs.existsSync(src)) {
    try {
      fs.renameSync(src, dest);
      console.log("Moved src/app/favicon.ico -> public/favicon.ico");
    } catch (e) {
      fs.copyFileSync(src, dest);
      fs.unlinkSync(src);
      console.log("Copied src/app/favicon.ico -> public/favicon.ico (fallback)");
    }
  }
} catch (err) {
  // don't block dev on script errors; just log
  console.error("move-favicon script error:", err);
}

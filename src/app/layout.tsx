import React from "react";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger"; // mount client helper

export const metadata = {
  title: "smartINTERVIEW",
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg"
  }
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "20px 36px",
  borderBottom: "1px solid rgba(0,0,0,0.06)",
  background: "#ffffff"
};

const logoStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  fontWeight: 700,
  color: "#0B5FFF"
};

const containerStyle: React.CSSProperties = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "48px 20px"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Inter, Arial, sans-serif", background: "#fafbfd", color: "#0b1226", minHeight: "100vh" }}>
        <header style={headerStyle}>
          <div style={logoStyle}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "#007ACC", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800 }}>
              AI
            </div>
            <div>AI Interview Coach</div>
          </div>
          <nav style={{ display: "flex", gap: 18, alignItems: "center", color: "#58607a" }}>
            <a href="#features" style={{ textDecoration: "none", color: "inherit" }}>Features</a>
            <a href="#how" style={{ textDecoration: "none", color: "inherit" }}>How It Works</a>
            <a href="/dashboard" style={{ textDecoration: "none", color: "inherit" }}>Dashboard</a>
            <a href="/admin" style={{ textDecoration: "none", color: "inherit" }}>Admin</a>
          </nav>
        </header>

        <main>{children}</main>

        <footer style={{ marginTop: 48, padding: "28px 0", textAlign: "center", color: "#95a0b6" }}>
          © {new Date().getFullYear()} AI Interview Coach
        </footer>

        {/* Client helper mounted here so it runs in the browser */}
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
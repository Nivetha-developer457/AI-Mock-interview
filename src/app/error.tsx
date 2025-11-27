"use client";
import React, { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("App error caught by app/error.tsx:", error);
  }, [error]);

  return (
    <html>
      <body style={{ fontFamily: "Inter, Arial, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#111827", color: "#fff" }}>
        <div style={{ maxWidth: 760, padding: 28, borderRadius: 12, background: "rgba(17,24,39,0.92)", boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}>
          <h2 style={{ margin: 0, marginBottom: 8, color: "#ff7b72" }}>Something went wrong</h2>
          <p style={{ color: "#cbd5e1", marginBottom: 12 }}>An unexpected error occurred. If this keeps happening, check your API endpoints or server logs.</p>
          <details style={{ color: "#94a3b8", marginBottom: 16 }}>
            <summary style={{ cursor: "pointer" }}>Show error details</summary>
            <pre style={{ whiteSpace: "pre-wrap", marginTop: 8, color: "#e2e8f0" }}>{String(error?.message || error)}</pre>
            <pre style={{ whiteSpace: "pre-wrap", marginTop: 8, color: "#94a3b8" }}>{String(error?.stack || "")}</pre>
          </details>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={() => reset()} style={{ padding: "10px 14px", borderRadius: 8, background: "#6b5ce6", color: "white", border: "none", fontWeight: 700 }}>
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

"use client";
import * as React from "react";

/**
 * Safe-fetch injector:
 * - Replaces window.fetch with a wrapper that detects non-JSON responses (HTML error pages)
 *   and returns a JSON payload { __metadata_error: true, status, text } so callers won't
 *   throw on res.json() when the server returned HTML.
 * - This is a transitional safety net; ideally fix the server/API to always return JSON on API routes.
 */
export default function VisualEditsMessenger(): React.JSX.Element | null {
	React.useEffect(() => {
		if (typeof window === "undefined") return;
		const w = window as any;
		if (w.__safeFetchPatched) return;
		w.__safeFetchPatched = true;

		const originalFetch = window.fetch.bind(window);

		window.fetch = async (...args: Parameters<typeof fetch>) => {
			const res = await originalFetch(...args);
			try {
				const ct = res.headers.get?.("content-type") || "";
				// If it's JSON, return original response so callers behave normally
				if (ct.toLowerCase().includes("application/json")) {
					return res;
				}

				// Read text (likely HTML error page) and convert into a safe JSON response
				const text = await res.text();
				const snippet = text.slice(0, 2000); // limit size

				const safeBody = JSON.stringify({
					__metadata_error: true,
					status: res.status,
					statusText: res.statusText,
					textSnippet: snippet
				});

				const safeHeaders = new Headers(res.headers);
				safeHeaders.set("content-type", "application/json; charset=utf-8");

				// Return a new Response so code that calls res.json() receives the safe JSON
				return new Response(safeBody, {
					status: res.status,
					statusText: res.statusText,
					headers: safeHeaders
				});
			} catch (err) {
				// Fallback: rethrow so callers still observe the original error
				console.error("safeFetch wrapper error:", err);
				throw err;
			}
		};
	}, []);

	// No UI — purely a client-side safety helper
	return null;
}

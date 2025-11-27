// Safe DB client initializer to avoid throwing on module import when env is missing or a placeholder.
type AnyObj = Record<string, any>;

const rawUrl = process.env.TURSO_CONNECTION_URL ?? "";
const authToken = process.env.TURSO_AUTH_TOKEN ?? "";

function isLikelyPlaceholder(u: string) {
  if (!u) return true;
  const lower = u.toLowerCase();
  return (
    lower.includes("<your") ||
    lower.includes("%3c") ||
    lower.includes("your_db") ||
    lower.includes("your-db") ||
    lower.includes("placeholder")
  );
}

let _client: AnyObj | null = null;
export let dbAvailable = false;

if (!isLikelyPlaceholder(rawUrl)) {
  try {
    // require at runtime so invalid env doesn't throw during module evaluation
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { createClient } = require("@libsql/client");
    _client = createClient({
      url: rawUrl,
      authToken: authToken,
    });
    dbAvailable = true;
    // eslint-disable-next-line no-console
    console.log("DB client initialized.");
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("Failed to initialize DB client:", err);
    _client = null;
    dbAvailable = false;
  }
} else {
  // eslint-disable-next-line no-console
  console.warn(
    "DB client disabled: TURSO_CONNECTION_URL appears missing or placeholder. " +
      "Create d:\\smartINTERVIEW\\.env.local with real TURSO_CONNECTION_URL and TURSO_AUTH_TOKEN."
  );
  _client = null;
  dbAvailable = false;
}

// Safe wrapper exported for use by API routes.
// If DB not configured, calling code gets a clear error instead of import-time crash.
const safeClient = {
  async query(...args: unknown[]) {
    if (!dbAvailable) {
      throw new Error(
        "Database is not configured. Set TURSO_CONNECTION_URL and TURSO_AUTH_TOKEN in .env.local."
      );
    }
    // forward to real client's query if present
    // @ts-ignore
    return _client.query?.(...args);
  },
  // expose underlying client for advanced use if available
  _raw: _client,
};

export default safeClient;
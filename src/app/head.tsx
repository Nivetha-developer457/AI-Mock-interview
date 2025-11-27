export default function Head() {
  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>smartINTERVIEW</title>
      {/* Inline SVG favicon as data URL to avoid importing a corrupted/unsupported file */}
      <link
        rel="icon"
        href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect width='100%25' height='100%25' fill='%23007ACC'/%3E%3Ctext x='32' y='40' font-size='32' text-anchor='middle' fill='white' font-family='Arial'%3ES%3C/text%3E%3C/svg%3E"
      />
    </>
  );
}

"use client";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  // The root layout failed, so we need our own <html> and <body>.
  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "ui-monospace, monospace",
          background: "#0a0a0a",
          color: "#fafafa",
          margin: 0,
          padding: "1.5rem",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "28rem" }}>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            RentNest is temporarily unavailable
          </h1>

          <p style={{ marginTop: "0.75rem", fontSize: "0.75rem", opacity: 0.7 }}>
            A critical error stopped the app from loading. Please try again in a
            moment.
          </p>

          {error.digest && (
            <p
              style={{
                marginTop: "1rem",
                fontSize: "0.65rem",
                opacity: 0.5,
              }}
            >
              Error ID: {error.digest}
            </p>
          )}

          <button
            onClick={() => unstable_retry()}
            style={{
              marginTop: "1.5rem",
              padding: "0.6rem 1.25rem",
              fontSize: "0.75rem",
              background: "#10b981",
              color: "#052e21",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

export default function ThemePreviewPage() {
  return (
    <div style={{ 
      position: "fixed", 
      inset: 0, 
      zIndex: 999999, 
      backgroundColor: "#f8f5f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{ textAlign: "center", color: "#1a1a18" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: 300, marginBottom: "1rem" }}>
          Theme Preview
        </h1>
        <p style={{ color: "#6b6b68" }}>
          If you can see this, the page is working!
        </p>
        <div style={{ marginTop: "2rem" }}>
          <a 
            href="/roadmap" 
            style={{ 
              padding: "12px 24px", 
              backgroundColor: "#c9a96e", 
              color: "#1a1a18",
              textDecoration: "none",
              borderRadius: "4px"
            }}
          >
            Back to Roadmap
          </a>
        </div>
      </div>
    </div>
  );
}

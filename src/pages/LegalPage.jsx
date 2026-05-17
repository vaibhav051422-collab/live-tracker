import { Link } from "react-router-dom";

export default function LegalPage({ title, content }) {
  return (
    <div style={styles.page}>
      <style>{`
        :root {
          --bg-primary: #f5efe4;
          --text-primary: #14212b;
          --text-muted: #64748b;
          --accent: #c2410c;
          --border: rgba(20, 33, 43, 0.08);
        }

        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
      `}</style>

      <div style={styles.container}>
        <div style={styles.header}>
          <Link to="/" style={styles.backLink}>← Back to Arena</Link>
          <h1 style={styles.title}>{title}</h1>
        </div>

        <div style={styles.content}>
          {content}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "var(--bg-primary)",
    padding: "2rem",
  },
  container: {
    maxWidth: "640px",
    margin: "0 auto",
    background: "white",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "3rem 2rem",
  },
  header: {
    marginBottom: "2rem",
  },
  backLink: {
    fontSize: "0.9rem",
    color: "var(--accent)",
    textDecoration: "none",
    transition: "color 0.2s",
    display: "inline-block",
    marginBottom: "1.5rem",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: 600,
    margin: "0",
    color: "var(--text-primary)",
  },
  content: {
    fontSize: "0.95rem",
    lineHeight: 1.6,
    color: "var(--text-primary)",
  },
};

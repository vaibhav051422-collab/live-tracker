import { Link } from "react-router-dom";

export default function Privacy() {
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
          <h1 style={styles.title}>Privacy Policy</h1>
        </div>

        <div style={styles.content}>
          <p>Arena is designed with privacy in mind. We don't collect personal data beyond what's necessary to keep rooms running.</p>
          
          <h2 style={styles.subtitle}>What we collect</h2>
          <p>When you create or join a room, we collect your location data to display your position on the map. This data is only stored for the duration of your session.</p>
          
          <h2 style={styles.subtitle}>What we don't do</h2>
          <p>We don't store your location history, sell your data, or use tracking beyond the active room session. Room codes are temporary and automatically expire.</p>
          
          <h2 style={styles.subtitle}>Questions?</h2>
          <p>For privacy concerns, contact us at privacy@arena.local</p>
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
  subtitle: {
    fontSize: "1.1rem",
    fontWeight: 600,
    marginTop: "1.5rem",
    marginBottom: "0.5rem",
    color: "var(--text-primary)",
  },
  content: {
    fontSize: "0.95rem",
    lineHeight: 1.6,
    color: "var(--text-primary)",
  },
};

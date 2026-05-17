import { Link } from "react-router-dom";

export default function Terms() {
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
          <h1 style={styles.title}>Terms of Service</h1>
        </div>

        <div style={styles.content}>
          <p>Welcome to Arena. By using our service, you agree to these terms.</p>
          
          <h2 style={styles.subtitle}>Use of Service</h2>
          <p>Arena is provided as-is for meeting up with others using shared room codes. You agree to use Arena only for lawful purposes and not to interfere with others' use of the service.</p>
          
          <h2 style={styles.subtitle}>Room Codes</h2>
          <p>Room codes are temporary and unique to each session. You're responsible for who you share your room code with. Rooms automatically expire after inactivity.</p>
          
          <h2 style={styles.subtitle}>Liability</h2>
          <p>Arena is provided without warranty. We're not liable for any damages, lost connections, or inaccurate location data. Use Arena at your own discretion.</p>
          
          <h2 style={styles.subtitle}>Changes to Terms</h2>
          <p>We may update these terms. Continued use of Arena means you accept the updated terms.</p>
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

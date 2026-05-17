import { Link } from "react-router-dom";

export default function Contact() {
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
          <h1 style={styles.title}>Contact Us</h1>
        </div>

        <div style={styles.content}>
          <p>Have a question or feedback? We'd love to hear from you.</p>
          
          <h2 style={styles.subtitle}>Get in touch</h2>
          <p>
            <strong>Email:</strong> hello@arena.local<br />
            <strong>Issues:</strong> support@arena.local<br />
            <strong>Business:</strong> business@arena.local
          </p>
          
          <h2 style={styles.subtitle}>What we're looking for</h2>
          <p>Bug reports, feature requests, and user feedback all help us make Arena better. If something isn't working right or you have an idea, let us know.</p>
          
          <h2 style={styles.subtitle}>Response time</h2>
          <p>We try to respond to all inquiries within 48 hours. For urgent issues, please mark your email as such.</p>
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

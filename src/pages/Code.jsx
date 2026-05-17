import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Code() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCodeChange = (value) => {
    const alphanumericOnly = value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase();
    setCode(alphanumericOnly);
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedCode = code.trim();

    if (!trimmedName) {
      setError("Please enter your name");
      return;
    }

    if (!trimmedCode) {
      setError("Please enter a room code");
      return;
    }

    if (trimmedCode.length < 4) {
      setError("Room code must be at least 4 characters");
      return;
    }

    const session = {
      name: trimmedName,
      code: trimmedCode,
    };

    localStorage.setItem("arena-room-session", JSON.stringify(session));
    setError("");
    navigate("/map", { state: session });
  };

  return (
    <div style={styles.page}>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--bg-primary); color: var(--text-primary); }
        
        :root {
          --bg-primary: #f5efe4;
          --bg-secondary: #ede3d2;
          --text-primary: #14212b;
          --text-muted: #64748b;
          --accent: #c2410c;
          --accent-light: #ea580c;
          --navy: #1e293b;
          --border: rgba(20, 33, 43, 0.08);
        }

        .code-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          background: var(--bg-primary);
        }

        .code-card {
          width: 100%;
          max-width: 420px;
          background: white;
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 3rem 2rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .code-header {
          margin-bottom: 2.5rem;
          text-align: center;
        }

        .code-header h1 {
          font-family: 'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 1.8rem;
          font-weight: 600;
          margin: 0 0 0.75rem 0;
          color: var(--text-primary);
        }

        .code-header p {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin: 0;
          line-height: 1.5;
        }

        .code-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .field-grid {
          display: grid;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .form-group input {
          padding: 0.85rem 1rem;
          font-size: 1rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: white;
          color: var(--text-primary);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(194, 65, 12, 0.1);
        }

        .form-group input::placeholder {
          color: var(--text-muted);
          opacity: 0.7;
        }

        .error-message {
          font-size: 0.85rem;
          color: #dc2626;
          margin-top: 0.25rem;
          display: none;
        }

        .error-message.show {
          display: block;
        }

        .btn {
          padding: 0.9rem 1.5rem;
          font-size: 0.95rem;
          font-weight: 500;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn-primary {
          background: var(--accent);
          color: white;
        }

        .btn-primary:hover {
          background: var(--accent-light);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(194, 65, 12, 0.2);
        }

        .btn-primary:active {
          transform: translateY(0);
        }

        .btn-secondary {
          background: transparent;
          color: var(--text-primary);
          border: 1px solid var(--border);
        }

        .btn-secondary:hover {
          background: var(--bg-secondary);
          border-color: var(--text-primary);
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          flex-direction: column;
        }

        .back-link {
          text-align: center;
          margin-top: 1.5rem;
        }

        .back-link a {
          font-size: 0.9rem;
          color: var(--accent);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .back-link a:hover {
          color: var(--accent-light);
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .code-card {
            padding: 2rem 1.5rem;
          }

          .code-header h1 {
            font-size: 1.5rem;
          }

          .code-header p {
            font-size: 0.9rem;
          }
        }
      `}</style>

      <div className="code-container">
        <div className="code-card">
          <div className="code-header">
            <h1>Join a room</h1>
            <p>Enter the code your friend shared to see each other on the map.</p>
          </div>

          <form className="code-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="room-code">Room code</label>
              <input
                id="room-code"
                type="text"
                placeholder="Enter a 4-char code"
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="room-name">Your name</label>
              <input
                id="room-name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError("");
                }}
                autoFocus
              />
            </div>

            <div className={`error-message ${error ? "show" : ""}`}>
              {error}
              </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Enter map
              </button>
            </div>
          </form>

          <div className="back-link">
            <Link to="/">← Back home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "var(--bg-primary)",
  },
};

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pw }),
        
      });
      const data = await res.json();
      if (data.success) {
        // Beispiel: Token speichern, Userdaten ggf. im Context/State ablegen
        localStorage.setItem("token", data.token);
        // Weiterleitung ins Portal
        navigate("/portal/dashboard");
      } else {
        setError(data.error || "Login fehlgeschlagen");
      }
    } catch (err) {
      setError("Server nicht erreichbar");
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-title">Athletenportal</div>
      <div className="login-box">
        <h2>Anmeldung</h2>
        <form onSubmit={handleSubmit}>
          <div className="login-fields">
            <input
              type="email"
              placeholder="E-Mail"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
            />
            <input
              type="password"
              placeholder="Passwort"
              required
              value={pw}
              onChange={e => setPw(e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Einloggen..." : "Einloggen"}
          </button>
          {error && <div className="login-error">{error}</div>}
        </form>
        <div className="register-link">
          Noch kein Konto? <a href="#" onClick={e => { e.preventDefault(); alert("Registrierung folgt bald!"); }}>Jetzt registrieren</a>
        </div>
      </div>
    </div>
  );
}

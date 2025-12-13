import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Optional: Admin-Button nur für Admins anzeigen (hier immer sichtbar, kann später erweitert werden)
  return (
    <nav className="portal-nav">
      <div className="nav-left">
        <Link to="/portal/dashboard">
          <button className={location.pathname === "/portal/dashboard" ? "active" : ""}>Dashboard</button>
        </Link>
        <Link to="/portal/ergebnisse">
          <button className={location.pathname === "/portal/ergebnisse" ? "active" : ""}>Ergebnisse</button>
        </Link>
        <Link to="/portal/statistik">
          <button className={location.pathname === "/portal/statistik" ? "active" : ""}>Statistik</button>
        </Link>
        <Link to="/portal/profil">
          <button className={location.pathname === "/portal/profil" ? "active" : ""}>Profil</button>
        </Link>
        <Link to="/portal/admin">
          <button className={location.pathname === "/portal/admin" ? "active" : ""}>Admin</button>
        </Link>
      </div>
      <div className="nav-right">
        <button
          className="logout-btn-small"
          onClick={() => {
            localStorage.removeItem("token");
            // Optional: Auch Userdaten im Context/State löschen!
            navigate("/portal");
          }}
        >
          Abmelden
        </button>
      </div>
    </nav>
  );
}

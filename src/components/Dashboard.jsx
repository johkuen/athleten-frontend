import { useEffect, useState } from "react";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

function DashboardProfile({ user }) {
  if (!user) return null;
   // Beispiel: Nachname-Vorname_2026.jpg (alles klein und ohne Umlaute/Leerzeichen)
  const formatName = (str) => 
    str.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const bildName = `${formatName(user.nachname)}-${formatName(user.vorname)}_2026.jpg`;
  const bildUrl = `/images/${bildName}`;

  return (
    <div className="dashboard-card dashboard-profile">
      <img
        src={bildUrl}
        alt="Profilbild"
        onError={(e) => { e.target.onerror = null; e.target.src = "/images/default-profile.jpg"; }}
      />
      <div className="profile-name">{user.vorname} {user.nachname}</div>
    </div>
  );
}

export default function Dashboard({user}) {
   const [results, setResults] = useState([]);

   useEffect(() => {
    // Passe die URL ggf. an (z.B. mit User-ID, wenn nötig)
    fetch("https://athletenwebsite.onrender.com/api/ergebnisse")
      .then(res => res.json())
      .then(data => setResults(data))
      .catch(() => setResults([]));
  }, []);

  useEffect(() => {
    if (user) {
      fetch(`${import.meta.env.VITE_API_BASE}/api/results/${user.id}`)
        .then(res => res.json())
        .then(data => {
          setResults(
            data
              .filter(r => r.art === "Wettkampf")
              .sort((a, b) => new Date(b.datum) - new Date(a.datum))
          );
        });
    }
  }, [user]);

  // Für Tabelle: neueste oben, max 5
  const tableResults = results.slice(0, 5);

  // Für Chart: chronologisch (alt -> neu), max 5
  const lastFive = [...results]
    .sort((a, b) => new Date(a.datum) - new Date(b.datum))
    .slice(-5);

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <h2 className="dashboard-title">
          Willkommen, {user?.vorname} {user?.nachname}
          {user?.rolle === "admin" ? " (Admin-Ansicht)" : "!"}
        </h2>
        <div className="dashboard-grid">
          {/* Ergebnisse */}
          <div className="dashboard-card">
            <div className="dashboard-card-title">Letzte Ergebnisse</div>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Wettkampf</th>
                  <th>Wert</th>
                </tr>
              </thead>
              <tbody>
                {tableResults.length === 0 ? (
                  <tr>
                    <td colSpan={3}>Noch keine Ergebnisse vorhanden.</td>
                  </tr>
                ) : (
                  tableResults.map((r, i) => (
                    <tr key={i}>
                      <td>{r.datum?.substring(0, 10) || "-"}</td>
                      <td>{r.wettkampf || r.kommentar || "-"}</td>
                      <td>{r.wert || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <a className="dashboard-link" href="/portal/ergebnisse">Mehr anzeigen →</a>
          </div>

          {/* Chart */}
          <div className="dashboard-card">
            <div className="dashboard-card-title">Leistungskurve</div>
            {lastFive.length > 0 ? (
              <Line
                data={{
                  labels: lastFive.map(r => r.datum?.substring(5, 10) || "-"),
                  datasets: [{
                    label: "Ergebnis",
                    data: lastFive.map(r => parseFloat(r.wert)),
                    borderColor: "#1976d2",
                    backgroundColor: "#90caf9",
                    tension: 0.2,
                    pointRadius: 4,
                    fill: false,
                  }],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: false } },
                }}
                height={160}
              />
            ) : (
              <div style={{ padding: 32, color: "#888" }}>Keine Daten</div>
            )}
            <a className="dashboard-link" href="/portal/statistik">Statistik öffnen →</a>
          </div>
        </div>

        {/* Profil unten */}
        <div className="dashboard-profile-row">
          <DashboardProfile user={user} />
        </div>
      </div>
    </div>
  );
}

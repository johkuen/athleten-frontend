import { useEffect, useState } from "react";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

// Chart.js Komponenten registrieren (nur einmal im Projekt nötig)
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function Dashboard() {
  // Userdaten aus localStorage holen
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      setUser(JSON.parse(userString));
    }
  }, []);

  const [results, setResults] = useState([]);

useEffect(() => {
  if (user) {
    fetch(`${import.meta.env.VITE_API_BASE}/api/results/${user.id}`)
      .then(res => res.json())
      .then(data => {
        // Nur die letzten 3 Wettkampf-Ergebnisse, sortiert nach Datum absteigend
        const wettkampfErgebnisse = data
          .filter(r => r.art === "Wettkampf")
          .sort((a, b) => new Date(b.datum) - new Date(a.datum))
          .slice(0, 3);
        setResults(wettkampfErgebnisse);
      });
  }
}, [user]);

return (
  <div className="dashboard-root">
    <div className="dashboard-header">
      <h2 style={{ textAlign: "center", marginTop: 0 }}>
        {user
          ? `Willkommen, ${user.vorname || user.email || "Athlet"}!`
          : "Willkommen im Portal!"}
      </h2>
    </div>
    <div className="dashboard-card">
      <h3>Letzte Wettkampfergebnisse</h3>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Datum</th>
            <th>Wettkampf</th>
            <th>Ergebnis</th>
          </tr>
        </thead>
        <tbody>
          {results.length === 0 ? (
            <tr>
              <td colSpan={3}>Noch keine Ergebnisse vorhanden.</td>
            </tr>
          ) : (
            results.map((r, i) => (
              <tr key={i}>
                <td>{r.datum?.substring(0, 10) || "-"}</td>
                <td>{r.wettkampf || r.kommentar || "-"}</td>
                <td>{r.wert || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
    {results.length > 0 && (
      <>
        <div className="dashboard-card" style={{ marginTop: 24 }}>
          <h3>Leistungskurve (letzte 5 Ergebnisse)</h3>
          <Line
            data={{
              labels: results.slice(-5).map(r => r.datum?.substring(5, 10) || "-"),
              datasets: [
                {
                  label: "Ergebnis",
                  data: results.slice(-5).map(r => parseFloat(r.wert)),
                  borderColor: "#1976d2",
                  backgroundColor: "#90caf9",
                  tension: 0.2,
                  pointRadius: 4,
                  fill: false,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                y: { beginAtZero: false },
              },
            }}
            height={180}
          />
        </div>

        <div className="dashboard-average">
          Aktueller Durchschnitt: {(
            results.slice(-5).reduce((sum, r) => sum + parseFloat(r.wert), 0) /
            results.slice(-5).length
          ).toFixed(2)}
        </div>
      </>
    )}
  </div>
);
}

import { useEffect, useState } from "react";

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
  <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", marginTop: "48px" }}>
    <div className="dashboard-header" style={{ marginBottom: "24px" }}>
      <h2 style={{ textAlign: "center", marginTop: 0 }}>
        {user
          ? `Willkommen, ${user.vorname || user.email || "Athlet"}!`
          : "Willkommen im Portal!"}
      </h2>
    </div>
    <div className="dashboard-card" style={{ margin: "0 auto" }}>
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
  </div>
);
}

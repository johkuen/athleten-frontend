import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import Papa from "papaparse";
import logo from '../assets/logo.jpg';

const csvLinks = {
  luftgewehr: {
    quali:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vTlvJcMPTiffrTZOCGhuK_e-3vSLOtIy5rNWYejry5Eg_vIYJw99Fs2rjGZCe9cQw/pub?gid=1121230767&single=true&output=csv",
    rangliste: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTlvJcMPTiffrTZOCGhuK_e-3vSLOtIy5rNWYejry5Eg_vIYJw99Fs2rjGZCe9cQw/pub?gid=1621705108&single=true&output=csv",
    junioren:  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTlvJcMPTiffrTZOCGhuK_e-3vSLOtIy5rNWYejry5Eg_vIYJw99Fs2rjGZCe9cQw/pub?gid=336990874&single=true&output=csv"
  },
  kleinkaliber: {
    quali:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vTlvJcMPTiffrTZOCGhuK_e-3vSLOtIy5rNWYejry5Eg_vIYJw99Fs2rjGZCe9cQw/pub?gid=1350177456&single=true&output=csv",
    rangliste: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTlvJcMPTiffrTZOCGhuK_e-3vSLOtIy5rNWYejry5Eg_vIYJw99Fs2rjGZCe9cQw/pub?gid=1709551018&single=true&output=csv",
    junioren:  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTlvJcMPTiffrTZOCGhuK_e-3vSLOtIy5rNWYejry5Eg_vIYJw99Fs2rjGZCe9cQw/pub?gid=651732067&single=true&output=csv"
  },
  pistole: {
    quali:     "",
    rangliste: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTlvJcMPTiffrTZOCGhuK_e-3vSLOtIy5rNWYejry5Eg_vIYJw99Fs2rjGZCe9cQw/pub?gid=712400822&single=true&output=csv",
    junioren:  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTlvJcMPTiffrTZOCGhuK_e-3vSLOtIy5rNWYejry5Eg_vIYJw99Fs2rjGZCe9cQw/pub?gid=1047213867&single=true&output=csv"
  }
};

const limits = {
  // Luftgewehr (Standard)
  frauen:      { a: 629.1, b: 627.8 },
  herren:      { a: 628.9, b: 628.0 },
  juniorinnen: { a: 626.6, b: 624.9 },
  junioren:    { a: 624.1, b: 621.4 },
  // Pistole
  frauen_pistole:      { a: 571, b: 569 },
  herren_pistole:      { a: 577, b: 574 },
  juniorinnen_pistole: { a: 563, b: 559 },
  junioren_pistole:    { a: 567, b: 563 },
  // Kleinkaliber
  frauen_kleinkaliber:      { a: 586, b: 584 },
  herren_kleinkaliber:      { a: 586, b: 584 },
  juniorinnen_kleinkaliber: { a: 581, b: 578 },
  junioren_kleinkaliber:    { a: 579, b: 577 }
};

function toNumberDE(val) {
  if (!val) return NaN;
  return parseFloat(val.replace(/\./g, '').replace(',', '.'));
}

function getField(row, key) {
  let found = Object.keys(row).find(
    k => k.trim().toLowerCase() === key.trim().toLowerCase()
  );
  return found ? row[found] : "";
}

export default function Ranglisten() {
  const [discipline, setDiscipline] = useState('luftgewehr');
  const [wertung, setWertung] = useState('quali');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const disciplines = [
    { key: 'luftgewehr', label: 'Luftgewehr' },
    { key: 'kleinkaliber', label: 'Kleinkaliber' },
    { key: 'pistole', label: 'Luftpistole' }
  ];
  const wertungen = [
    { key: 'quali', label: 'EM Qualifikation' },
    { key: 'rangliste', label: 'Rangliste' },
    { key: 'junioren', label: 'Junioren & Juniorinnen' }
  ];

  useEffect(() => {
    const url = csvLinks[discipline][wertung];
    if (!url) {
      setData([]);
      return;
    }
    setLoading(true);
    Papa.parse(url, {
      download: true,
      header: true,
      complete: (results) => {
        setData(results.data);
        setLoading(false);
      }
    });
  }, [discipline, wertung]);

  function getSortedRows(catKey) {
    let rows = data.filter(row => (getField(row, "Geschlecht")+"").toLowerCase().includes(catKey));
    rows.sort((a, b) => toNumberDE(getField(b, "Durchschnitt")) - toNumberDE(getField(a, "Durchschnitt")));
    return rows;
  }

  function renderTable(catKey, label) {
    let limitKey = catKey;
    if (discipline === "pistole") {
      limitKey = catKey + "_pistole";
    } else if (discipline === "kleinkaliber") {
      limitKey = catKey + "_kleinkaliber";
    }

    const rows = getSortedRows(catKey);
    if (!rows.length) return null;
    const firstRow = rows[0];
    const allKeys = Object.keys(firstRow);
    const portraitKey = allKeys.find(k => k.toLowerCase().includes("portrait"));
    const idxName = allKeys.findIndex(k => k.trim().toLowerCase() === "name");
    const idxDurchschnitt = allKeys.findIndex(k => k.trim().toLowerCase() === "durchschnitt");
    const wettkampfKeys = allKeys.slice(idxName + 1, idxDurchschnitt)
      .filter(k =>
        !k.toLowerCase().includes("gesamtergebnis") &&
        !k.toLowerCase().includes("geschlecht")
      );

    if (wettkampfKeys.length === 0) {
      return (
        <div key={catKey} style={{marginBottom:32}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <h2>{label}</h2>
            <div>
              <span className="limit-label a-limit">A-Limit: {limits[limitKey]?.a}</span>
              <span className="limit-label b-limit" style={{marginLeft:12}}>B-Limit: {limits[limitKey]?.b}</span>
            </div>
          </div>
          <div className="coming-soon-hint" style={{marginTop: 20}}>
            Ergebnisse folgen in Kürze …
          </div>
        </div>
      );
    }

    const keys = [
      portraitKey,
      ...allKeys.filter(k => k !== portraitKey && k.toLowerCase() !== "profillink")
    ];

    return (
      <div key={catKey} style={{marginBottom:32}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <h2>{label}</h2>
          <div>
            <span className="limit-label a-limit">A-Limit: {limits[limitKey]?.a}</span>
            <span className="limit-label b-limit" style={{marginLeft:12}}>B-Limit: {limits[limitKey]?.b}</span>
          </div>
        </div>
        <table className="rangliste">
          <thead>
            <tr>
              {keys.map(col =>
                <th key={col}>{col === portraitKey ? "Portrait" : col}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                {keys.map((col, i) => {
                  if (col === portraitKey) {
                    return (
                      <td key={i}>
                        {row[col] && <img src={row[col]} alt="Portrait" style={{width:40,height:40,borderRadius:"50%",objectFit:"cover"}} />}
                      </td>
                    );
                  }
                  let cellClass = "";
                  if (wettkampfKeys.includes(col)) {
                    const num = toNumberDE(row[col]);
                    if (num >= limits[limitKey]?.a) cellClass = "limit-cell-a";
                    else if (num >= limits[limitKey]?.b) cellClass = "limit-cell-b";
                  }
                  return <td key={i} className={cellClass}>{row[col]}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div>
      {/* --- NEU: Zum Athletenportal-Button oben rechts --- */}
      <nav style={{
        width: "100%",
        background: "#1866a5",
        padding: "0.7em 0 0.5em 0",
        boxShadow: "0 2px 12px rgba(40,116,166,0.07)",
        marginBottom: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end"
      }}>
        <Link
          to="/portal"
          style={{
            background: "#fff",
            color: "#1866a5",
            padding: "8px 22px",
            borderRadius: "22px",
            fontWeight: 600,
            textDecoration: "none",
            boxShadow: "0 2px 8px rgba(40,116,166,0.07)",
            transition: "background 0.15s",
            marginRight: "2vw"
          }}>
          Zum Athletenportal
        </Link>
      </nav>

      <header>
        <img src={logo} alt="Logo" id="logo" />
      </header>
      <h1>RANGLISTE</h1>

      <div id="discipline-buttons">
        {disciplines.map(d => (
          <button
            key={d.key}
            className={discipline === d.key ? "active" : ""}
            onClick={() => setDiscipline(d.key)}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div id="buttons">
        {wertungen.map(w => (
          <button
            key={w.key}
            className={wertung === w.key ? "active" : ""}
            data-wertung={w.key}
            onClick={() => setWertung(w.key)}
            disabled={!csvLinks[discipline][w.key]}
          >
            {w.label}
          </button>
        ))}
      </div>

      <div id="content" style={{maxWidth:1100, margin:"0 auto"}}>
        {loading ? (
          <div>Lade Daten...</div>
        ) : (
          <>
            {renderTable("frauen", "Frauen")}
            {renderTable("herren", "Herren")}
            {renderTable("juniorinnen", "Juniorinnen")}
            {renderTable("junioren", "Junioren")}
            {(!data.length) && (
              <div className="coming-soon-hint" style={{marginTop:40}}>
                Für diese Auswahl sind noch keine Daten hinterlegt.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

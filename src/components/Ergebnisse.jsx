import { useState, useEffect } from "react";

export default function Ergebnisse() {
  const [results, setResults] = useState([]);
  const [wettkaempfe, setWettkaempfe] = useState([]);

  const [form, setForm] = useState({
    id: null,
    datum: "",
    art: "Training",
    wettkampf: "",
    wert: "",
    kommentar: "",
  });

  // Wettkämpfe laden
  useEffect(() => {
    fetch("/api/wettkaempfe")
      .then(res => res.json())
      .then(data => setWettkaempfe(data))
      .catch(() => setWettkaempfe([]));
  }, []);

  // Ergebnisse laden
  useEffect(() => {
    fetch("/api/ergebnisse")
      .then(res => res.json())
      .then(data => setResults(data))
      .catch(() => setResults([]));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (form.id) {
      setResults(prev => prev.map(r => r.id === form.id ? { ...form, wert: parseFloat(form.wert) } : r));
    } else {
      const newResult = { ...form, id: Date.now(), wert: parseFloat(form.wert) };
      setResults(prev => [newResult, ...prev]);
    }
    setForm({ id: null, datum: "", art: "Training", wettkampf: "", wert: "", kommentar: "" });
  };

  const handleEdit = (id) => {
    const r = results.find(r => r.id === id);
    setForm({ ...r, wert: r.wert.toString() });
  };

  return (
    <div className="ergebnisse-container">
      <h2>Ergebnisse</h2>
      <div className="form-row">
        <input type="date" name="datum" value={form.datum} onChange={handleChange} />
        <select name="art" value={form.art} onChange={handleChange}>
          <option value="Training">Training</option>
          <option value="Wettkampf">Wettkampf</option>
        </select>
        {form.art === "Wettkampf" && (
          <select name="wettkampf" value={form.wettkampf} onChange={handleChange}>
            <option value="">-- Wettkampf auswählen --</option>
            {wettkaempfe.map(w => (
              <option key={w.id} value={w.name}>{w.name}</option>
            ))}
          </select>
        )}
        <input
          type="number"
          step="0.01"
          name="wert"
          placeholder="Ergebnis (z.B. 595.3)"
          value={form.wert}
          onChange={handleChange}
        />
      </div>
      <div className="form-row">
        <input
          type="text"
          name="kommentar"
          placeholder="Kommentar"
          value={form.kommentar}
          onChange={handleChange}
          style={{ width: "100%" }}
        />
        <button onClick={handleSave} disabled={!form.datum || !form.wert || (form.art === "Wettkampf" && !form.wettkampf)}>
          Speichern
        </button>
      </div>
      <table className="ergebnisse-table">
        <thead>
          <tr>
            <th>Datum</th>
            <th>Art</th>
            <th>Wettkampf</th>
            <th>Wert</th>
            <th>Kommentar</th>
            <th>Aktion</th>
          </tr>
        </thead>
        <tbody>
          {results.map(r => (
            <tr key={r.id}>
              <td>{r.datum}</td>
              <td>{r.art}</td>
              <td>{r.art === "Wettkampf" ? r.wettkampf : "-"}</td>
              <td>{r.wert.toFixed(2)}</td>
              <td>{r.kommentar}</td>
              <td>
                <button onClick={() => handleEdit(r.id)}>Bearbeiten</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

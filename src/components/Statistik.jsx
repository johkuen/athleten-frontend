import { Line } from 'react-chartjs-2';

export default function Statistik() {
  const data = {
    labels: ['2025-11-28', '2025-11-29'],
    datasets: [
      {
        label: 'Ergebnis',
        data: [625.2, 625.3],
        borderColor: 'blue',
        fill: false,
      },
    ],
  };

  return (
    <div>
      <h2>Statistik & Leistungskurve</h2>
      <Line data={data} />
      <div style={{marginTop: '10px', fontWeight: 600, color: '#c0392b'}}>
        Aktueller Durchschnitt: 625.25
      </div>
    </div>
  );
}

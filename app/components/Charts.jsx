'use client';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Charts() {
  const data = {
    labels: ['Student A', 'Student B', 'Student C', 'Student D'],
    datasets: [
      {
        label: 'Marks',
        data: [85, 90, 78, 92],
        backgroundColor: 'rgba(37, 99, 235, 0.7)',  // primary blue
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-5 rounded shadow my-8">
      <h2 className="text-2xl font-semibold mb-4 text-primary">Marks Analysis</h2>
      <Bar data={data} options={options} />
    </div>
  );
}

// components/Charts.jsx
'use client';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function PerformanceChart({ data }) {
  // Guard against null or incomplete data
  if (!data || !data.labels || !data.teacherAverage || !data.classAverage) {
    return <p className="text-gray-400">Loading chart data...</p>;
  }

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Your Avg. Grade Given',
        data: data.teacherAverage,
        borderColor: '#818cf8',
        backgroundColor: 'rgba(129, 140, 248, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Overall Class Average',
        data: data.classAverage,
        borderColor: '#a3e635',
        backgroundColor: 'rgba(163, 230, 53, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    // ... your options remain the same
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: '#d1d5db' },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#d1d5db' },
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#d1d5db', font: { size: 14 } }
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#ffffff',
        bodyColor: '#e5e7eb',
        borderColor: '#4f46e5',
        borderWidth: 1,
      }
    },
  };

  return (
    <div className="relative h-72 md:h-96">
      <Line data={chartData} options={options} />
    </div>
  );
}

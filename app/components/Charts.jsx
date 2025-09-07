// components/Charts.jsx
'use client';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Default data can be provided, but the component now accepts props
const defaultData = {
  labels: ['Assignment 1', 'Quiz 1', 'Midterm', 'Assignment 2'],
  datasets: [
    {
      label: 'Your Score',
      data: [85, 90, 78, 92],
      backgroundColor: '#818cf8', // Indigo-400
      borderColor: '#6366f1', // Indigo-500
      borderWidth: 1,
    },
    {
        label: 'Class Average',
        data: [75, 82, 71, 79],
        backgroundColor: '#a3e63580', // Lime-400 with opacity
        borderColor: '#84cc16', // Lime-500
        borderWidth: 1,
      },
  ],
};

export default function PerformanceChart({ data = defaultData }) {
  // Options are now configured for a dark theme
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Important for fitting in the card
    scales: {
        y: {
            beginAtZero: true,
            grid: {
                color: 'rgba(255, 255, 255, 0.1)', // Lighter grid lines
            },
            ticks: {
                color: '#d1d5db', // Gray-300 for tick labels
            },
        },
        x: {
            grid: {
                color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
                color: '#d1d5db',
            },
        }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
            color: '#d1d5db', // Legend text color
            font: {
                size: 14,
            }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 16 },
        bodyFont: { size: 14 },
      }
    },
  };

  return (
    // The chart itself doesn't need a background; it will inherit from the Card
    // We add a height constraint to the container
    <div className="relative h-96">
      <Bar data={data} options={options} />
    </div>
  );
}
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const App = () => {
  const [principal, setPrincipal] = useState(10000);
  const [months, setMonths] = useState(12);
  const [projections, setProjections] = useState([]);

  const fetchProjections = () => {
    fetch(`http://127.0.0.1:5000/api/projected_growth?principal=${principal}&months=${months}`)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched projections:', data);
        setProjections(data);
      })
      .catch(error => console.error('Error fetching projections:', error));
  };

  const chartData = {
    labels: projections.map(item => item.month),
    datasets: [
      {
        label: 'Portfolio Value',
        data: projections.map(item => item.projected_value),
        borderColor: 'rgb(94, 50, 198)',
        backgroundColor: 'rgba(167, 139, 236, 0.2)',
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        padding: 20,
      },
      title: {
        display: true,
        text: 'Portfolio Growth Projection',
        padding: {
          top: 10,
          bottom: 30
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          padding: 10,
          callback: (value) => {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value);
          }
        },
        grid: {
          drawBorder: false,
        },
      },
      x: {
        ticks: {
          padding: 10,
        },
        grid: {
          drawBorder: false,
        },
      },
    },
    layout: {
      padding: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20
      }
    }
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      margin: '20px',
    }}>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '20px' }}>
          Principal Investment: $
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            style={{ marginLeft: '5px', padding: '5px' }}
          />
        </label>
        <label style={{ marginRight: '20px' }}>
          Timeframe (months):
          <input
            type="number"
            value={months}
            onChange={(e) => setMonths(e.target.value)}
            style={{ marginLeft: '5px', padding: '5px' }}
          />
        </label>
        <button 
          onClick={fetchProjections}
          style={{
            padding: '6px 12px',
            backgroundColor: '#4783eb',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Generate Projection
        </button>
      </div>
      <div style={{ height: '500px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default App;
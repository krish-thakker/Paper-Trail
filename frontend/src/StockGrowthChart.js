import React, { useState, useEffect } from 'react';
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
  const [financeData, setFinanceData] = useState([]);
  
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/finances')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched data:', data);
        setFinanceData(data);
      })
      .catch(error => console.error('Error fetching finance data:', error));
  }, []);

  const formatMonth = (dateString) => {
    const date = new Date(dateString); // Create date from the input string
    const formatter = new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'short',
      timeZone: 'UTC', // Ensure it's in UTC
    });
    return formatter.format(date);
  };

  const chartData = {
    labels: financeData.map(item => formatMonth(item.month)),
    datasets: [
      {
        label: 'Stock Growth',
        data: financeData.map(item => item.stock_growth),
        borderColor: 'rgb(71, 131, 235)',
        backgroundColor: 'rgba(93, 158, 250, 0.2)',
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,  // Allows for custom height
    plugins: {
      legend: {
        position: 'top',
        padding: 20,
      },
      title: {
        display: true,
        text: 'Finance Overview',
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
      {/* <h1 style={{ marginBottom: '20px' }}>Stock Growth Over Time</h1> */}
      <div style={{ height: '500px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default App;
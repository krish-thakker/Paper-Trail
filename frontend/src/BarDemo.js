import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registering chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const App = () => {
  const [financeData, setFinanceData] = useState([]);
  
  useEffect(() => {
    // Fetch the finance data from your Flask API
    fetch('http://127.0.0.1:5000/api/finances')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched data:', data); // Log the fetched data
        setFinanceData(data);
       })
      .catch(error => console.error('Error fetching finance data:', error));
  }, []);

  // Prepare chart data
  const chartData = {
    labels: financeData.map(item => item.month), // Use months as the X-axis labels
    datasets: [
      {
        label: 'Checking Balance',
        data: financeData.map(item => item.checking_balance), // Data for Checking Balance
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Color for the bars
        borderColor: 'rgba(75, 192, 192, 1)', // Border color for the bars
        borderWidth: 1,
      },
      {
        label: 'Stock Balance',
        data: financeData.map(item => item.stock_balance), // Data for Stock Balance
        backgroundColor: 'rgba(153, 102, 255, 0.2)', // Color for the bars
        borderColor: 'rgba(153, 102, 255, 1)', // Border color for the bars
        borderWidth: 1,
      },
      {
        label: 'Income',
        data: financeData.map(item => item.income), // Data for Income
        backgroundColor: 'rgba(255, 159, 64, 0.2)', // Color for the bars
        borderColor: 'rgba(255, 159, 64, 1)', // Border color for the bars
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h1>Finance Bar Chart</h1>
      <Bar data={chartData} />
    </div>
  );
};

export default App;

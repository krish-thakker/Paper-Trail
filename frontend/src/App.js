import React, { useState, useEffect } from 'react';
import FinanceChart from './FinanceChart';
import StockGrowthChart from './StockGrowthChart';
import ProjectionsChart from "./ProjectionsChart";
import Analysis from "./Analysis";

function App() {
  const [finances, setFinances] = useState([]);
  const [month, setMonth] = useState('');
  const [checkingBalance, setCheckingBalance] = useState('');
  const [stockBalance, setStockBalance] = useState('');
  const [income, setIncome] = useState('');
  const [creditBill, setCreditBill] = useState('');
  const [otherExpenses, setOtherExpenses] = useState('');
  const [moneyAdded, setMoneyAdded] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/finances')
      .then(response => response.json())
      .then(data => setFinances(data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newFinance = {
      month: month,
      checking_balance: checkingBalance,
      stock_balance: stockBalance,
      income: income,
      credit_bill: creditBill,
      other_expenses: otherExpenses,
      money_added: moneyAdded
    };

    fetch('http://127.0.0.1:5000/api/finances', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newFinance),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        fetch('http://127.0.0.1:5000/api/finances')
          .then(response => response.json())
          .then(updatedData => {
            setFinances(updatedData);
          });
        setMonth('');
        setCheckingBalance('');
        setStockBalance('');
        setIncome('');
        setCreditBill('');
        setOtherExpenses('');
        setMoneyAdded('');
      });
  };

  const containerStyle = {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const formStyle = {
    backgroundColor: '#f5f5f5',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  const formGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
  };

  const formGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
  };

  const labelStyle = {
    marginBottom: '4px',
    fontWeight: 'bold',
    fontSize: '14px',
  };

  const inputStyle = {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px',
  };

  const buttonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '20px',
  };

  const tableContainerStyle = {
    marginTop: '30px',
    marginBottom: '30px',
    overflowX: 'auto',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  const thStyle = {
    backgroundColor: '#f8f9fa',
    border: '1px solid #dee2e6',
    padding: '10px',
    textAlign: 'left',
    fontSize: '14px',
  };

  const tdStyle = {
    border: '1px solid #dee2e6',
    padding: '10px',
    fontSize: '14px',
  };

  const headingStyle = {
    marginBottom: '20px',
    color: '#333',
    fontSize: '20px',
  };

  const formatMonth = (dateString) => {
    const date = new Date(dateString); // Create date from the input string
    const formatter = new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'short',
      timeZone: 'UTC', // Ensure it's in UTC
    });
    return formatter.format(date);
  };

// In your React component, update the handleDelete function:

const handleDelete = async (id) => {
  if (window.confirm('Are you sure you want to delete this record?')) {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/finances/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete record');
      }

      setFinances(prevFinances => 
        prevFinances.filter(finance => finance.id !== id)
      );
    } catch (error) {
      console.error('Error deleting record:', error);
      alert(error.message);
    }
  }
};

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Add a New Finance Record</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={formGridStyle}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Month:</label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Checking Balance:</label>
            <input
              type="number"
              value={checkingBalance}
              onChange={(e) => setCheckingBalance(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Stock Balance:</label>
            <input
              type="number"
              value={stockBalance}
              onChange={(e) => setStockBalance(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Money Added To Stock:</label>
            <input
              type="number"
              value={moneyAdded}
              onChange={(e) => setMoneyAdded(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Income:</label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Credit Bill:</label>
            <input
              type="number"
              value={creditBill}
              onChange={(e) => setCreditBill(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Other Expenses:</label>
            <input
              type="number"
              value={otherExpenses}
              onChange={(e) => setOtherExpenses(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
        </div>

        <button type="submit" style={buttonStyle}>Add Record</button>
      </form>

      <h1 style={headingStyle}>Finance Records</h1>
      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Month</th>
              <th style={thStyle}>Checking Balance</th>
              <th style={thStyle}>Stock Balance</th>
              <th style={thStyle}>Money Added</th>
              <th style={thStyle}>Income</th>
              <th style={thStyle}>Credit Bill</th>
              <th style={thStyle}>Other Expenses</th>
              <th style={thStyle}>Net Worth</th>
              <th style={thStyle}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {finances.map((finance, index) => (
              <tr key={index}>
                <td style={tdStyle}>{formatMonth(finance.month)}</td>
                <td style={tdStyle}>{finance.checking_balance}</td>
                <td style={tdStyle}>{finance.stock_balance}</td>
                <td style={tdStyle}>{finance.money_added}</td>
                <td style={tdStyle}>{finance.income}</td>
                <td style={tdStyle}>{finance.credit_bill}</td>
                <td style={tdStyle}>{finance.other_expenses}</td>
                <td style={tdStyle}>{finance.net_worth}</td>
                <td style={tdStyle}>
                <button
                  onClick={() => handleDelete(finance.id)}
                  style={{
                    backgroundColor: 'transparent',
                    padding: '0', // Remove padding to make it compact around the icon
                    border: 'none', // Remove the border for a cleaner look
                    cursor: 'pointer', // Standard clickable cursor
                    display: 'flex', // Use flexbox to center the icon
                    justifyContent: 'center', // Center the icon horizontally
                    alignItems: 'center', // Center the icon vertically
                  }}
                >
                  <img src="/trash.png" alt="Delete" style={{ width: '24px', height: '24px' }} />
                </button>
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h1 style={headingStyle}>Net Worth Chart</h1>
        <FinanceChart />
      </div>

      <div style={{ marginTop: '30px' }}>
        <h1 style={headingStyle}>Stock Growth Chart</h1>
        <StockGrowthChart />
      </div>

      <div>
        <h1 style={headingStyle}>Projections Chart</h1>
        <ProjectionsChart />
      </div>

      <div>
        <Analysis />
      </div>

    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';

function App() {
  const [finances, setFinances] = useState([]);
  const [month, setMonth] = useState('');
  const [checkingBalance, setCheckingBalance] = useState('');
  const [stockBalance, setStockBalance] = useState('');
  const [income, setIncome] = useState('');
  const [creditBill, setCreditBill] = useState('');
  const [otherExpenses, setOtherExpenses] = useState('');

  // Fetch finances from Flask API when the component mounts
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/finances')
      .then(response => response.json())
      .then(data => setFinances(data));
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const newFinance = {
      month: month,
      checking_balance: checkingBalance,
      stock_balance: stockBalance,
      income: income,
      credit_bill: creditBill,
      other_expenses: otherExpenses
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
        // Fetch the updated finance records and update state
        fetch('http://127.0.0.1:5000/api/finances')
        .then(response => response.json())
        .then(updatedData => {
          setFinances(updatedData);  // Update state with the latest finance records
        });
        setMonth('');
        setCheckingBalance('');
        setStockBalance('');
        setIncome('');
        setCreditBill('');
        setOtherExpenses('');
      });
  };

  return (
    <div className="App">
      <h2>Add a New Finance Record</h2>
      <form onSubmit={handleSubmit}>
        <label>Month:</label>
        <input
          type="text"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          required
        />
        <br />
        <label>Checking Balance:</label>
        <input
          type="number"
          value={checkingBalance}
          onChange={(e) => setCheckingBalance(e.target.value)}
          required
        />
        <br />
        <label>Stock Balance:</label>
        <input
          type="number"
          value={stockBalance}
          onChange={(e) => setStockBalance(e.target.value)}
          required
        />
        <br />
        <label>Income:</label>
        <input
          type="number"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          required
        />
        <br />
        <label>Credit Bill:</label>
        <input
          type="number"
          value={creditBill}
          onChange={(e) => setCreditBill(e.target.value)}
          required
        />
        <br />
        <label>Other Expenses:</label>
        <input
          type="number"
          value={otherExpenses}
          onChange={(e) => setOtherExpenses(e.target.value)}
          required
        />
        <br />
        <button type="submit">Add Finance</button>
      </form>

      <h1>Finance Records</h1>
      <table style={{ border: '1px solid black', borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>Month</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Checking Balance</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Stock Balance</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Income</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Credit Bill</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Other Expenses</th>
          </tr>
        </thead>
        <tbody>
          {finances.map((finance, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{finance.month}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{finance.checking_balance}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{finance.stock_balance}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{finance.income}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{finance.credit_bill}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{finance.other_expenses}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

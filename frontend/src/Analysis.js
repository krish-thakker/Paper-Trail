import React, { useState, useEffect } from 'react';

const FinancialAnalysis = () => {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch financial analysis from backend
        fetch('http://localhost:5000/api/analyze_finances')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setInsights(data);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching financial analysis:", error);
                setError('An error occurred while fetching data.');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div style={styles.center}>
                <div className="loader"></div> {/* You can replace this with your own loader */}
                <p>Loading your financial insights...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.errorContainer}>
                <p style={styles.errorText}>Error: {error}</p>
            </div>
        );
    }

    const toPercent = (value) => {
        return (value * 100).toFixed(2) + '%';
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Financial Insights</h1>

            {/* <div style={styles.section}>
                <h2 style={styles.subheading}>Trends</h2>
                <div style={styles.card}>
                    <ul>
                        {Object.keys(insights.trends).map((key, idx) => (
                            <li key={idx} style={styles.listItem}>
                                <strong>{key.replace('_', ' ')}:</strong> {toPercent(insights.trends[key])}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div style={styles.section}>
                <h2 style={styles.subheading}>Correlations</h2>
                <div style={styles.card}>
                    <ul>
                        {Object.keys(insights.correlations).map((key, idx) => (
                            <li key={idx} style={styles.listItem}>
                                <strong>{key.replace('_', ' ')}:</strong> {toPercent(insights.correlations[key])}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div style={styles.section}>
                <h2 style={styles.subheading}>Financial Health</h2>
                <div style={styles.card}>
                    <ul>
                        {Object.keys(insights.financial_health).map((key, idx) => (
                            <li key={idx} style={styles.listItem}>
                                <strong>{key.replace('_', ' ')}:</strong> {toPercent(insights.financial_health[key])}
                            </li>
                        ))}
                    </ul>
                </div>
            </div> */}

            <div style={styles.section}>
                <h2 style={styles.subheading}>Recommendations</h2>
                <div style={styles.card}>
                    <ul>
                        {insights.recommendations.length ? 
                            insights.recommendations.map((rec, idx) => <li key={idx} style={styles.listItem}>{rec}</li>) : 
                            <li style={styles.listItem}>No recommendations available.</li>}
                    </ul>
                </div>
            </div>

            <div style={styles.section}>
                <h2 style={styles.subheading}>Key Patterns</h2>
                <div style={styles.card}>
                    <ul>
                        {insights.key_concerns.length ? 
                            insights.key_concerns.map((concern, idx) => <li key={idx} style={styles.listItem}>{concern}</li>) : 
                            <li style={styles.listItem}>No key concerns detected.</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        margin: '0 auto',
        maxWidth: '800px',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    heading: {
        textAlign: 'center',
        fontSize: '2rem',
        marginBottom: '20px',
        color: '#333',
    },
    subheading: {
        fontSize: '1.5rem',
        color: '#444',
        marginBottom: '10px',
    },
    section: {
        marginBottom: '20px',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '15px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
    listItem: {
        fontSize: '1rem',
        marginBottom: '8px',
        color: '#555',
    },
    loader: {
        margin: '20px auto',
        border: '6px solid #f3f3f3',
        borderTop: '6px solid #3498db',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        animation: 'spin 1s linear infinite',
    },
    errorContainer: {
        padding: '20px',
        backgroundColor: '#f8d7da',
        color: '#721c24',
        border: '1px solid #f5c6cb',
        borderRadius: '5px',
        textAlign: 'center',
        marginBottom: '20px',
    },
    errorText: {
        fontSize: '1rem',
    },
    center: {
        textAlign: 'center',
        marginTop: '20px',
    },
};

export default FinancialAnalysis;

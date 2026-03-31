import { useState } from 'react';
import './App.css';

function App() {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      setError('Please enter symptoms');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze symptoms');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Error analyzing symptoms');
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'emergency':
        return '#ff4444';
      case 'moderate':
        return '#ff9800';
      case 'low':
        return '#4caf50';
      default:
        return '#999';
    }
  };

  return (
    <div className="container">
      <h1>AI Health Checker</h1>
      <div className="form-group">
        <textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="Describe your symptoms..." disabled={loading} />
        <button onClick={handleAnalyze} disabled={loading}> {loading ? 'Analyzing...' : 'Analyze'} </button>
      </div>
      {error && <div className="error">{error}</div>}
      {result && (
        <div className="results">
          <div className="section">
            <h2>Conditions</h2>
            <ul>
              {result.conditions?.map((condition, idx) => (
                <li key={idx}>{condition}</li>
              ))}
            </ul>
          </div>
          <div className="section">
            <h2>Urgency Level</h2>
            <p style={{ color: getUrgencyColor(result.urgency), fontWeight: 'bold' }}> {result.urgency?.toUpperCase()} </p>
          </div>
          <div className="section">
            <h2>Advice</h2>
            <p>{result.advice}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
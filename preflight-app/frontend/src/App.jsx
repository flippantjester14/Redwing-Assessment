import { useState, useEffect } from 'react'
import './App.css'
import Checklist from './components/Checklist'
import AddCheckForm from './components/AddCheckForm'

const API_URL = 'http://localhost:5000/api/checks';

function App() {
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChecks();
  }, []);

  const fetchChecks = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch checks');
      const data = await response.json();
      setChecks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addCheck = async (description) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });
      if (!response.ok) throw new Error('Failed to add check');
      const newCheck = await response.json();
      setChecks([...checks, newCheck]);
    } catch (err) {
      alert(err.message);
    }
  };

  const updateCheck = async (id, updates) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update check');
      const updatedCheck = await response.json();
      setChecks(checks.map(c => c.id === id ? updatedCheck : c));
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteCheck = async (id) => {
    if (!confirm('Are you sure you want to delete this check?')) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete check');
      setChecks(checks.filter(c => c.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-top">
          <h1>PRE-FLIGHT CHECKLIST</h1>
          <div className="flight-date">
            <label>FLIGHT NUMBER: <input type="text" defaultValue="Outbound F______ L 01" /></label>
            <label>DATE: <input type="text" defaultValue={new Date().toLocaleDateString()} /></label>
          </div>
        </div>

        <div className="flight-details-grid">
          <div className="detail-group">
            <label>Filed By</label>
            <input type="text" placeholder="Name" />
          </div>
          <div className="detail-group">
            <label>Filing Time</label>
            <input type="time" />
          </div>
          <div className="detail-group">
            <label>Departure Location</label>
            <input type="text" placeholder="Location" />
          </div>
          <div className="detail-group">
            <label>Departure Time</label>
            <input type="time" />
          </div>
          <div className="detail-group">
            <label>Arrival Location</label>
            <input type="text" placeholder="Location" />
          </div>
          <div className="detail-group">
            <label>Est. Arrival Time</label>
            <input type="time" />
          </div>
        </div>
      </header>

      <main>
        <AddCheckForm onAdd={addCheck} />
        {loading ? (
          <p>Loading checks...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <Checklist
            checks={checks}
            onUpdate={updateCheck}
            onDelete={deleteCheck}
          />
        )}
      </main>
    </div>
  )
}

export default App

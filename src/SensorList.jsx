import React, { useState, useEffect } from 'react';
import './App.css';
import AddSensorForm from './AddSensorForm';

function SensorList() {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchSensors = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError(new Error('Brak tokena autoryzacji. Zaloguj się, aby zobaczyć listę czujników.'));
        setLoading(false);
        return;
      }

      const response = await fetch('/api/sensor', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Błąd HTTP! status: ${response.status}, message: ${errorData}`);
      }

      const data = await response.json();
      setSensors(data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensors();
  }, []);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };


  const deleteSensor = async (sensorName) => {
    try {
      const token = localStorage.getItem('authToken');
      const username = localStorage.getItem('loggedInUsername');
  
      if (!token || !username) {
        alert("Brak autoryzacji lub użytkownika. Zaloguj się ponownie.");
        return;
      }
  
      const confirmed = window.confirm(`Czy na pewno chcesz usunąć czujnik "${sensorName}"?`);
      if (!confirmed) return;
  
      const response = await fetch(`/api/sensor/delete/${encodeURIComponent(sensorName)}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
      if (response.ok) {
        alert("Czujnik usunięty.");
        fetchSensors();
      } else {
        const error = await response.text();
        alert(`Błąd usuwania czujnika: ${response.status} - ${error}`);
      }
    } catch (err) {
      alert("Wystąpił błąd: " + err.message);
    }
  };

  return (
    <div>
      <div className="expandable-section">
        <div className="section-header" onClick={toggleExpand}>
          <h2 className="section-header-title">Lista Czujników</h2>
          <span className="section-header-icon">{isExpanded ? '-' : '+'}</span>
        </div>
        {isExpanded && (
          <div className="section-content">
            {loading && <div>Ładowanie czujników...</div>}
            {error && <div style={{ color: 'red' }}>Wystąpił błąd: {error.message}</div>}
            {!loading && !error && (
              <table>
                <thead>
                  <tr>
                    <th>Akcje</th>
                    <th>Nazwa</th>
                    <th>Adres IP</th>
                    <th>Lokalizacja</th>
                    <th>Aktywny</th>
                  </tr>
                </thead>
                <tbody>
                  {sensors.length > 0 ? (
                    sensors.map((sensor) => (
                      <tr key={sensor.name}>
                        <td>
                          <button onClick={() => deleteSensor(sensor.name)}>
                            🗑️ Usuń
                          </button>
                        </td>
                        <td>{sensor.name}</td>
                        <td>{sensor.ipAddress}</td>
                        <td>{sensor.locationName || 'Brak danych'}</td>
                        <td>{sensor.active ? 'Tak' : 'Nie'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="5">Brak czujników do wyświetlenia.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      <AddSensorForm onSensorAdded={fetchSensors} />
    </div>
  );
}

export default SensorList;


import React, { useState, useEffect } from 'react';
import './App.css'; 


function SensorList() {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sensors');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSensors(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Pusta tablica zależności - uruchamiamy tylko raz po zamontowaniu komponentu

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="expandable-section">
      <div className="section-header" onClick={toggleExpand}>
        <h2 className="section-header-title">Lista Czujników</h2>
        <span className="section-header-icon">{isExpanded ? '-' : '+'}</span>
      </div>
      {isExpanded && (
        <div className="section-content">
          {loading && <div>Ładowanie czujników...</div>}
          {error && <div>Wystąpił błąd: {error.message}</div>}
          {!loading && !error && (
            <ul>
              {sensors.map(sensor => (
                <li key={sensor.name}>
                  Nazwa: {sensor.name}, IP Adres: {sensor.ipAddress}, Aktywny: {sensor.active ? 'Tak' : 'Nie'}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default SensorList;
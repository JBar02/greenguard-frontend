// src/SensorList.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

function SensorList() {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true); // Ustaw na true, bo będziemy ładować dane
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); 
      setError(null);   

      try {
        const token = localStorage.getItem('authToken');

        if (!token) {
          setError(new Error('Brak tokena autoryzacji. Zaloguj się, aby zobaczyć listę czujników.'));
          setLoading(false);
          return; 
        }

        // Endpoint /api/sensors jest teraz dostępny w backendzie!
        const response = await fetch('/api/sensors', { 
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Błąd HTTP! status: ${response.status}, message: ${errorData}`);
        }
        const data = await response.json();
        setSensors(data); // Zapisz pobrane czujniki do stanu
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
          {error && <div style={{ color: 'red' }}>Wystąpił błąd: {error.message}</div>}
          {!loading && !error && (
            // Wyświetl listę czujników, jeśli nie ma błędów i dane są załadowane
            <ul>
              {sensors.length > 0 ? (
                sensors.map(sensor => (
                  <li key={sensor.name}> {/* Załóżmy, że 'name' jest unikalne dla klucza */}
                    **Nazwa**: {sensor.name}, **Adres IP**: {sensor.ipAddress}, **Aktywny**: {sensor.active ? 'Tak' : 'Nie'}
                  </li>
                ))
              ) : (
                <p>Brak czujników do wyświetlenia.</p>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default SensorList;
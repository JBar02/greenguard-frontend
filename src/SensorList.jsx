import React, { useState, useEffect } from 'react';

function SensorList() {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <div>Ładowanie czujników...</div>;
  }

  if (error) {
    return <div>Wystąpił błąd: {error.message}</div>;
  }

  return (
    <div>
      <h2>Lista Czujników</h2>
      {sensors.length > 0 ? (
        <ul>
          {sensors.map(sensor => (
            <li key={sensor.name}> {/* Pamiętaj, że key powinien być unikalnym ID, jeśli dostępne */}
              Nazwa: {sensor.name}, IP Adres: {sensor.ipAddress}, Aktywny: {sensor.active ? 'Tak' : 'Nie'}
            </li>
          ))}
        </ul>
      ) : (
        <div>Brak dostępnych czujników.</div>
      )}
    </div>
  );
}

export default SensorList;
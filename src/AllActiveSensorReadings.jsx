// src/AllActiveSensorReadings.jsx
import React, { useState, useEffect } from 'react';
import './App.css'; // Upewnij się, że masz tu style dla .sensor-readings-grid i .sensor-reading-card

const AllActiveSensorReadings = () => {
  // Stan do przechowywania danych o wszystkich czujnikach wraz z ich ostatnimi odczytami
  // Kluczem będzie unikalne ID czujnika (jeśli dostępne) lub jego nazwa.
  // Wartością będzie obiekt łączący dane czujnika i jego odczytu.
  const [activeSensorData, setActiveSensorData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchSensorAndReadingData = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('authToken');

    if (!token) {
      setError(new Error('Brak tokena autoryzacji. Zaloguj się, aby zobaczyć odczyty czujników.'));
      setLoading(false);
      return;
    }

    try {
      // 1. Pobierz listę wszystkich czujników
      const sensorsResponse = await fetch('/api/sensor', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!sensorsResponse.ok) {
        throw new Error(`Błąd HTTP podczas pobierania listy czujników: ${sensorsResponse.status} - ${await sensorsResponse.text()}`);
      }
      const allSensors = await sensorsResponse.json();
      console.log('Backend /api/sensor zwrócił:', allSensors); // DIAGNOSTYKA

      // Filtruj tylko aktywne czujniki
      const activeSensors = allSensors.filter(sensor => sensor.active);
      console.log('Aktywne czujniki (po filtracji):', activeSensors); // DIAGNOSTYKA

      const currentReadingsMap = {}; // Mapa do przechowywania zagregowanych danych

      // 2. Dla każdego AKTYWNEGO czujnika, wykonaj zapytanie o jego ostatni odczyt
      // Używamy Promise.allSettled, aby błędy w pojedynczych zapytaniach nie zatrzymywały całości
      const readingPromises = activeSensors.map(async (sensor) => {
        // Sprawdź, czy sensor.name jest dostępny, zanim użyjesz go w URL
        if (!sensor.name) {
          console.warn(`Czujnik o ID ${sensor.id || 'nieznanym'} nie ma nazwy. Pomijam pobieranie odczytu.`);
          // Dodaj wpis o błędzie dla tego czujnika
          currentReadingsMap[sensor.id || sensor.ipAddress || `no-name-${Math.random()}`] = {
            sensorId: sensor.id,
            sensorName: sensor.name || 'Brak nazwy',
            ipAddress: sensor.ipAddress,
            locationName: sensor.locationName,
            valid: false,
            message: 'Czujnik bez nazwy lub brak odczytu.'
          };
          return;
        }

        try {
          // UWAGA: Zakładamy, że /api/reading?sensorName=XYZ zwraca OSTATNI ODCZYT dla danego czujnika
          // LUB, że zwraca listę, z której pierwszy element jest najnowszy.
          const readingResponse = await fetch(`/api/reading?sensorName=${encodeURIComponent(sensor.name)}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
          });

          let readingData = null;
          if (readingResponse.ok) {
            const responseJson = await readingResponse.json();
            // Jeśli backend zwraca listę, weź pierwszy element (najnowszy, jeśli sortowany)
            if (Array.isArray(responseJson) && responseJson.length > 0) {
              readingData = responseJson[0]; // Bierzemy pierwszy element z listy
            } else if (responseJson && !Array.isArray(responseJson)) {
              readingData = responseJson; // Jeśli backend zwraca pojedynczy obiekt
            }
          }

          if (readingData) {
            // Agreguj dane czujnika z danymi odczytu
            currentReadingsMap[sensor.id || sensor.name] = {
              sensorId: sensor.id, // Użyj ID z listy czujników
              sensorName: sensor.name,
              ipAddress: sensor.ipAddress,
              locationName: sensor.locationName,
              temperature: readingData.temperature,
              humidity: readingData.humidity,
              timestamp: readingData.timestamp,
              valid: true
            };
          } else {
            // Jeśli nie ma odczytu, oznacz jako nieważne
            currentReadingsMap[sensor.id || sensor.name] = {
              sensorId: sensor.id,
              sensorName: sensor.name,
              ipAddress: sensor.ipAddress,
              locationName: sensor.locationName,
              valid: false,
              message: 'Brak odczytów dla tego czujnika.'
            };
          }
        } catch (individualError) {
          console.error(`Błąd podczas pobierania odczytu dla czujnika ${sensor.name}:`, individualError);
          currentReadingsMap[sensor.id || sensor.name] = {
            sensorId: sensor.id,
            sensorName: sensor.name,
            ipAddress: sensor.ipAddress,
            locationName: sensor.locationName,
            valid: false,
            message: `Błąd sieci/serwera dla czujnika: ${individualError.message}`
          };
        }
      });

      // Czekaj na zakończenie wszystkich zapytań o odczyty
      await Promise.allSettled(readingPromises);

      // Aktualizuj stan komponentu z zagregowanymi danymi
      setActiveSensorData(currentReadingsMap);
      setLoading(false);

    } catch (overallError) {
      setError(overallError);
      setLoading(false);
      console.error('Ogólny błąd podczas pobierania danych o czujnikach i odczytach:', overallError);
    }
  };

  useEffect(() => {
    fetchSensorAndReadingData(); // Pobierz dane przy pierwszym renderowaniu

    // Ustaw interwał odświeżania co 5 sekund
    const intervalId = setInterval(fetchSensorAndReadingData, 5000);

    // Funkcja czyszcząca interwał po odmontowaniu komponentu
    return () => clearInterval(intervalId);
  }, []); // Pusta tablica zależności oznacza, że useEffect uruchomi się tylko raz na początku

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="expandable-section">
      <div className="section-header" onClick={toggleExpand}>
        <h2 className="section-header-title">Aktualne Odczyty Czujników (Aktywne)</h2>
        <span className="section-header-icon">{isExpanded ? '-' : '+'}</span>
      </div>
      {isExpanded && (
        <div className="section-content">
          {loading && <div>Ładowanie odczytów czujników...</div>}
          {error && <div style={{ color: 'red' }}>Wystąpił błąd: {error.message}</div>}
          {!loading && !error && Object.keys(activeSensorData).length > 0 ? (
            <div className="sensor-readings-grid">
              {Object.values(activeSensorData).map(data => (
                // Używamy sensorId lub sensorName jako klucza, ważne żeby było unikalne
                <div key={data.sensorId || data.sensorName || data.ipAddress} className="sensor-reading-card">
                  <h3>{data.sensorName || 'Brak nazwy'}</h3>
                  <p>Lokalizacja: {data.locationName || 'N/A'}</p>
                  <p>Adres IP: {data.ipAddress || 'N/A'}</p>
                  {data.valid ? (
                    <>
                      <p>Temperatura: {data.temperature != null ? `${data.temperature}°C` : 'N/A'}</p>
                      <p>Wilgotność: {data.humidity != null ? `${data.humidity}%` : 'N/A'}</p>
                      <p>Czas odczytu: {data.timestamp ? new Date(data.timestamp).toLocaleString() : 'N/A'}</p>
                    </>
                  ) : (
                    <p style={{ color: 'orange', fontWeight: 'bold' }}>{data.message || 'Brak ważnych danych z czujnika.'}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            !loading && !error && <p>Brak aktywnych czujników lub odczytów do wyświetlenia.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AllActiveSensorReadings;

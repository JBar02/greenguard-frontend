// src/WeatherDisplay.jsx
import React, { useState, useEffect } from 'react';
import './App.css'; // Zaimportuj plik CSS

function WeatherDisplay() {
  // Twój klucz API z OpenWeatherMap
  const API_KEY = '05455dfa38b456f8b26c55a43dd4bfd8'; // <--- Użyj swojego klucza!
  // Miasto, dla którego chcesz wyświetlić pogodę (możesz zmienić)
  const CITY_NAME = 'Wroclaw'; // Przykładowo Wrocław

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null); // Resetuj błąd przy nowym fetchu

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME}&appid=${API_KEY}&units=metric`;

        const response = await fetch(url);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Błąd HTTP! Status: ${response.status}, Wiadomość: ${errorText}`);
        }

        const data = await response.json();
        setWeatherData(data);
        console.log('Dane pogodowe pobrane:', data);
      } catch (err) {
        setError(err);
        console.error("Wystąpił błąd podczas pobierania pogody:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [CITY_NAME, API_KEY]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const { main, weather, name: cityName } = weatherData || {};
  const weatherDescription = weather?.[0]?.description || 'brak opisu';
  const weatherIconCode = weather?.[0]?.icon;
  const iconUrl = weatherIconCode ? `https://openweathermap.org/img/wn/${weatherIconCode}.png` : null;

  return (
    <div className="expandable-section">
      <div className="section-header" onClick={toggleExpand}>
        <h2 className="section-header-title">Pogoda dla {cityName || 'Ładowanie...'}</h2>
        <span className="section-header-icon">{isExpanded ? '-' : '+'}</span>
      </div>
      {isExpanded && (
        <div className="section-content">
          {loading && <div>Ładowanie danych pogodowych...</div>}
          {error && <div style={{ color: 'red' }}>Błąd podczas ładowania pogody: {error.message}</div>}
          {!loading && !error && weatherData && (
            <>
              {iconUrl && <img src={iconUrl} alt={weatherDescription} />}
              <p>Temperatura: {main?.temp}°C</p>
              <p>Opis: {weatherDescription}</p>
              {/* Możesz dodać więcej danych */}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default WeatherDisplay;
// src/WeatherDisplay.jsx
import React, { useState, useEffect } from 'react';

function WeatherDisplay() {
  // Twój klucz API z OpenWeatherMap
  const API_KEY = '05455dfa38b456f8b26c55a43dd4bfd8'; // <--- Użyj swojego klucza!
  // Miasto, dla którego chcesz wyświetlić pogodę (możesz zmienić)
  const CITY_NAME = 'Wroclaw'; // Przykładowo Wrocław

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null); // Resetuj błąd przy nowym fetchu

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME}&appid=${API_KEY}&units=metric`;

        const response = await fetch(url);

        if (!response.ok) {
          // Obsługa błędów HTTP (np. 404, 401)
          const errorText = await response.text();
          throw new Error(`Błąd HTTP! Status: ${response.status}, Wiadomość: ${errorText}`);
        }

        const data = await response.json();
        setWeatherData(data);
        console.log('Dane pogodowe pobrane:', data); // Zobacz, co API zwróciło w konsoli

      } catch (err) {
        setError(err);
        console.error("Wystąpił błąd podczas pobierania pogody:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [CITY_NAME, API_KEY]); // Zależności: ponów fetch, jeśli miasto lub klucz się zmieni (choć tu stałe)

  // Warunki renderowania: ładowanie, błąd, dane
  if (loading) {
    return <div>Ładowanie danych pogodowych...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Błąd podczas ładowania pogody: {error.message}</div>;
  }

  // Gdy dane są dostępne
  if (!weatherData) {
      return <div>Brak danych pogodowych.</div>; // Powinno być rzadko osiągane, ale dla pewności
  }

  // Wyświetlanie danych pogodowych
  // Struktura danych zależy od API OpenWeatherMap, często wygląda tak:
  // data.main.temp - temperatura
  // data.weather[0].description - opis pogody (np. "clear sky")
  // data.weather[0].icon - kod ikony pogody
  // data.name - nazwa miasta (potwierdzenie)

  const { main, weather, name: cityName } = weatherData;
  const weatherDescription = weather[0]?.description || 'brak opisu';
  const weatherIconCode = weather[0]?.icon;
  const iconUrl = weatherIconCode ? `https://openweathermap.org/img/wn/${weatherIconCode}.png` : null;


  return (
    <div>
      <h2>Pogoda dla {cityName}</h2>
      {iconUrl && <img src={iconUrl} alt={weatherDescription} />}
      <p>Temperatura: {main?.temp}°C</p>
      <p>Opis: {weatherDescription}</p>
      {/* Możesz dodać więcej danych, np. main.humidity, main.pressure, wind.speed */}
      {/* <p>Wilgotność: {main?.humidity}%</p> */}
      {/* <p>Prędkość wiatru: {weatherData.wind?.speed} m/s</p> */}
    </div>
  );
}

export default WeatherDisplay;
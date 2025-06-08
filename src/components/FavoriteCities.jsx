// src/components/FavoriteCities.jsx
import React, { useState, useEffect } from 'react';
import './FavoriteCities.css';
import { fetchWeatherData } from '../WeatherDisplay';
import {
  getFavoriteCities,
  addFavoriteCity,
  removeFavoriteCity,
  getAvailableLocations,
} from '../api/favorites';

const FavoriteCities = () => {
  const [availableCities, setAvailableCities] = useState([]);
  const [favoriteCities, setFavoriteCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [weatherData, setWeatherData] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const userId = localStorage.getItem('loggedInUsername');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchData = async () => {
      if (!userId || !token) return;

      try {
        const cities = await getFavoriteCities(token);
        setFavoriteCities(cities.map((c) => c.name));

        const available = await getAvailableLocations(token);
        setAvailableCities(available.map((c) => c.name));
      } catch (err) {
        console.error('Błąd pobierania danych:', err);
        setErrorMessage('Nie udało się pobrać danych z serwera.');
      }
    };
    fetchData();
  }, [userId, token]);

  useEffect(() => {
    favoriteCities.forEach((city) => {
      if (!weatherData[city]) {
        fetchWeatherData(city).then((data) => {
          if (data) {
            setWeatherData((prev) => ({ ...prev, [city]: data }));
          }
        });
      }
    });
  }, [favoriteCities, weatherData]);

  const handleAddCity = async () => {
    if (!selectedCity || favoriteCities.includes(selectedCity)) return;

    try {
      const success = await addFavoriteCity(selectedCity);
      if (success) {
        setFavoriteCities((prev) => [...prev, selectedCity]);
        setSelectedCity('');
        setSuccessMessage('Miasto dodane!');
        setErrorMessage('');
      } else {
        throw new Error();
      }
    } catch (err) {
      setErrorMessage('Nie udało się dodać miasta. Upewnij się, że nazwa jest poprawna.');
      setSuccessMessage('');
    }
  };

  const handleRemoveCity = async (city) => {
    try {
      const success = await removeFavoriteCity(token, city);
      if (success) {
        setFavoriteCities((prev) => prev.filter((c) => c !== city));
      } else {
        throw new Error();
      }
    } catch (err) {
      setErrorMessage('Nie udało się usunąć miasta.');
    }
  };

  return (
    <div className="favorite-cities">
      <h2>Ulubione miasta</h2>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <div className="input-group">
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="">-- Wybierz miasto --</option>
          {availableCities
            .filter((city) => !favoriteCities.includes(city))
            .map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
        </select>
        <button onClick={handleAddCity} disabled={!selectedCity}>
          Dodaj
        </button>
      </div>

      <ul className="cities-list">
        {favoriteCities.map((city) => {
          const weather = weatherData[city];
          return (
            <li key={city} className="city-item">
              <strong>{city}</strong>
              <button onClick={() => handleRemoveCity(city)}>Usuń</button>
              {weather ? (
                <div className="weather-info">
                  <p>🌡 Temperatura: {weather.main.temp}°C</p>
                  <p>📝 Opis: {weather.weather[0].description}</p>
                </div>
              ) : (
                <p>⏳ Ładowanie danych pogodowych...</p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FavoriteCities;


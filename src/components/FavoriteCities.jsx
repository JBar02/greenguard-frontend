// src/FavoriteCities.jsx
import React, { useState, useEffect } from 'react';
import './FavoriteCities.css';
import { fetchWeatherData } from '../WeatherDisplay';

const availableCities = [
  'Warszawa',
  'Kraków',
  'Gdańsk',
  'Wrocław',
  'Poznań',
  'Łódź',
  'Szczecin',
  'Lublin',
  'Katowice',
];

const FavoriteCities = () => {
  const [favoriteCities, setFavoriteCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [weatherData, setWeatherData] = useState({}); // { cityName: weatherData }

  const addCity = () => {
    if (selectedCity && !favoriteCities.includes(selectedCity)) {
      setFavoriteCities(prev => [...prev, selectedCity]);
      setSelectedCity('');
    }
  };

  useEffect(() => {
    favoriteCities.forEach(city => {
      if (!weatherData[city]) {
        fetchWeatherData(city).then(data => {
          if (data) {
            setWeatherData(prev => ({ ...prev, [city]: data }));
          }
        });
      }
    });
  }, [favoriteCities, weatherData]);

  return (
    <div className="favorite-cities">
      <h2>Ulubione miasta</h2>

      <div className="input-group">
        <select
          value={selectedCity}
          onChange={e => setSelectedCity(e.target.value)}
        >
          <option value="">-- Wybierz miasto --</option>
          {availableCities
            .filter(city => !favoriteCities.includes(city))
            .map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
        </select>
        <button onClick={addCity} disabled={!selectedCity}>
          Dodaj
        </button>
      </div>

      <ul className="cities-list">
        {favoriteCities.map(city => {
          const weather = weatherData[city];
          return (
            <li key={city} className="city-item">
              <strong>{city}</strong>
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


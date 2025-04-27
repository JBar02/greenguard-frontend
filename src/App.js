// src/App.js
import React from 'react';
import SensorList from './SensorList';
import AddSensorForm from './AddSensorForm';
import WeatherDisplay from './WeatherDisplay';
import './App.css'; // Zaimportuj plik CSS

function App() {
  return (
    <div className="App">
      <h1 className="main-title">Aplikacja GreenGuard</h1>
      <WeatherDisplay />
      <SensorList />
      <AddSensorForm />
    </div>
  );
}

export default App;
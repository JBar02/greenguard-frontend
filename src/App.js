// src/App.js
import React from 'react';
import SensorList from './SensorList';
import AddSensorForm from './AddSensorForm';
import WeatherDisplay from './WeatherDisplay'; // <--- Importuj nowy komponent

function App() {
  return (
    <div>
      <h1>Aplikacja GreenGuard</h1>

      <WeatherDisplay /> {/* <--- Dodaj komponent wyświetlający pogodę */}

      <SensorList />
      <AddSensorForm />
    </div>
  );
}

export default App;
// src/App.js
import React, { useState, useEffect } from 'react';
import SensorList from './SensorList';
import AddSensorForm from './AddSensorForm';
import WeatherDisplay from './WeatherDisplay';
import Login from './Login';
import Signup from './Signup';
import './App.css'; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedInUsername'); 
    setIsLoggedIn(false);
    setShowRegister(false);
  };

  const toggleForm = () => {
    setShowRegister(!showRegister);
  };

  return (
    <div className="App">
      <h1 className="main-title">Aplikacja GreenGuard</h1>

      {isLoggedIn ? (
        <>
          {/* Nowy kontener dla przycisku wylogowania */}
          <div className="logout-button-container">
            <button className="logout-button" onClick={handleLogout}>Wyloguj</button>
          </div>
          <WeatherDisplay />
          <SensorList />
          <AddSensorForm />
        </>
      ) : (
        <div className="auth-section"> 
          {showRegister ? (
            <>
              <Signup onSignupSuccess={() => setShowRegister(false)} />
              <p>
                Masz już konto?{' '}
                <button className="toggle-button" onClick={toggleForm}>Zaloguj się</button>
              </p>
            </>
          ) : (
            <>
              <Login onLoginSuccess={handleLoginSuccess} />
              <p>
                Nie masz konta?{' '}
                <button className="toggle-button" onClick={toggleForm}>Zarejestruj się</button>
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
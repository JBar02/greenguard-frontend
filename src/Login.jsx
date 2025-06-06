// src/Login.jsx
import React, { useState } from 'react';
import './App.css';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const token = await response.text();
        console.log('Zalogowano pomyślnie! Token:', token);
        setSuccessMessage('Zalogowano pomyślnie!');
        localStorage.setItem('authToken', token);
        localStorage.setItem('loggedInUsername', username); // <-- Zapisz username do localStorage
        onLoginSuccess();
      } else {
        const errorText = await response.text();
        setErrorMessage(`Błąd logowania: ${errorText || response.statusText}`);
        console.error('Błąd logowania:', response.status, errorText);
      }
    } catch (error) {
      setErrorMessage(`Wystąpił błąd sieci: ${error.message}`);
      console.error('Błąd sieci:', error);
    }
  };

  return (
    <div className="auth-container">
      <h2>Logowanie</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Nazwa użytkownika:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Hasło:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Zaloguj się</button>
      </form>
    </div>
  );
};

export default Login;
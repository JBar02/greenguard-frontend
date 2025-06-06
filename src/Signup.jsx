// src/Signup.jsx
import React, { useState } from 'react';
import './App.css'; // Użyj istniejącego pliku CSS, jeśli ma odpowiednie style

const Signup = ({ onSignupSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const message = await response.text(); // Zakładamy, że backend zwraca wiadomość tekstową
        console.log('Rejestracja pomyślna!', message);
        setSuccessMessage('Rejestracja pomyślna! Możesz się teraz zalogować.');
        setUsername('');
        setPassword('');
        if (onSignupSuccess) {
          onSignupSuccess(); // Wywołaj funkcję callback, jeśli istnieje
        }
      } else {
        const errorText = await response.text();
        setErrorMessage(`Błąd rejestracji: ${errorText || response.statusText}`);
        console.error('Błąd rejestracji:', response.status, errorText);
      }
    } catch (error) {
      setErrorMessage(`Wystąpił błąd sieci: ${error.message}`);
      console.error('Błąd sieci:', error);
    }
  };

  return (
    <div className="auth-container">
      <h2>Rejestracja</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="signup-username">Nazwa użytkownika:</label>
          <input
            type="text"
            id="signup-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="signup-password">Hasło:</label>
          <input
            type="password"
            id="signup-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Zarejestruj się</button>
      </form>
    </div>
  );
};

export default Signup;
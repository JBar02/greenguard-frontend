import React, { useState } from 'react';

function AddSensorForm() {
  const [name, setName] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [active, setActive] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newSensor = { name, ipAddress, active };

    try {
      const response = await fetch('/api/sensor', { // Zmienione na ścieżkę względną        
      method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSensor),
      });

      if (response.status === 201) {
        console.log('Czujnik dodany pomyślnie!');
        setSuccessMessage('Czujnik dodany pomyślnie!');
        setErrorMessage('');
        // Możesz zresetować formularz
        setName('');
        setIpAddress('');
        setActive(false);
        // Możesz również odświeżyć listę czujników po dodaniu
        // (np. wywołując funkcję z komponentu nadrzędnego)
      } else {
        const errorData = await response.text();
        console.error('Błąd podczas dodawania czujnika:', response.status, errorData);
        setErrorMessage(`Błąd podczas dodawania czujnika: ${response.status} - ${errorData}`);
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Wystąpił błąd:', error);
      setErrorMessage(`Wystąpił błąd: ${error.message}`);
      setSuccessMessage('');
    }
  };

  return (
    <div>
      <h3>Dodaj Nowy Czujnik</h3>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nazwa:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="ipAddress">Adres IP:</label>
          <input
            type="text"
            id="ipAddress"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="active">Aktywny:</label>
          <input
            type="checkbox"
            id="active"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
        </div>
        <button type="submit">Dodaj Czujnik</button>
      </form>
    </div>
  );
}

export default AddSensorForm;
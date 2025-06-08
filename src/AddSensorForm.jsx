import React, { useState } from 'react';
import './App.css';

const AddSensorForm = ({ onSensorAdded }) => {
  const [name, setName] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [active, setActive] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const token = localStorage.getItem('authToken');
      const username = localStorage.getItem('loggedInUsername');

      if (!token) {
        setErrorMessage('Brak tokena autoryzacji. Zaloguj się, aby dodać czujnik.');
        return;
      }
      if (!username) {
        setErrorMessage('Nazwa użytkownika nie jest dostępna. Spróbuj zalogować się ponownie.');
        return;
      }

      const newSensor = { name, ipAddress, active, username, locationName };

      const response = await fetch('/api/sensor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newSensor),
      });

      if (response.status === 201) {
        setSuccessMessage('Czujnik dodany pomyślnie!');
        setErrorMessage('');
        setName('');
        setIpAddress('');
        setActive(false);
        setLocationName('');

        if (onSensorAdded) {
          onSensorAdded();  // odśwież listę po sukcesie
        }
      } else {
        const errorData = await response.text();
        setErrorMessage(`Błąd podczas dodawania czujnika: ${response.status} - ${errorData}`);
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage(`Wystąpił błąd: ${error.message}`);
      setSuccessMessage('');
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="expandable-section">
      <div className="section-header" onClick={toggleExpand} style={{ cursor: 'pointer' }}>
        <h3 className="section-header-title">Dodaj Nowy Czujnik</h3>
        <span className="section-header-icon">{isExpanded ? '-' : '+'}</span>
      </div>
      {isExpanded && (
        <div className="section-content">
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
              <label htmlFor="locationName">Lokalizacja:</label>
              <input
                type="text"
                id="locationName"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
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
      )}
    </div>
  );
};

export default AddSensorForm;


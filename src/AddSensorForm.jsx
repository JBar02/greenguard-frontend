// src/AddSensorForm.jsx
import React, { useState } from 'react';
import './App.css'; 

const AddSensorForm = () => {
  const [name, setName] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [active, setActive] = useState(false);
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

      const newSensor = { name, ipAddress, active, username }; 

      const response = await fetch('/api/sensor', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(newSensor),
      });

      if (response.status === 201) {
        console.log('Czujnik dodany pomyślnie!');
        setSuccessMessage('Czujnik dodany pomyślnie!');
        setErrorMessage('');
        setName('');
        setIpAddress('');
        setActive(false);
      } else {
        const errorData = await response.text();
        console.error('Błąd podczas dodawania czujnika:', response.status, errorData);
        setErrorMessage(`Błąd podczas dodawania czujnika: ${response.status} - ${errorData}. Upewnij się, że jesteś zalogowany.`);
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Wystąpił błąd:', error);
      setErrorMessage(`Wystąpił błąd: ${error.message}`);
      setSuccessMessage('');
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="expandable-section"> {/* Używa klasy .expandable-section */}
      <div className="section-header" onClick={toggleExpand}> {/* Używa klasy .section-header */}
        <h3 className="section-header-title">Dodaj Nowy Czujnik</h3> {/* Używa klasy .section-header-title */}
        <span className="section-header-icon">{isExpanded ? '-' : '+'}</span> {/* Używa klasy .section-header-icon */}
      </div>
      {isExpanded && (
        <div className="section-content"> {/* Używa klasy .section-content */}
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
      )}
    </div>
  );
};

export default AddSensorForm;
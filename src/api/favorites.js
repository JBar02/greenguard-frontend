const API_BASE_URL = '/api';

export async function getFavoriteCities() {
  const token = localStorage.getItem('authToken');

  if (!token) {
    throw new Error('Brak tokena. Zaloguj się ponownie.');
  }

  try {
    const res = await fetch(`${API_BASE_URL}/user/favorite-locations`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Błąd pobierania ulubionych miast: ${res.status} - ${errText}`);
    }

    const data = await res.json();
    return data; // <-- Zwraca tablicę obiektów Location
  } catch (err) {
    console.error('[API] getFavoriteCities:', err);
    throw err;
  }
}

export async function addFavoriteCity(cityName) {
  const token = localStorage.getItem('authToken');

  if (!token) {
    throw new Error('Brak tokena. Zaloguj się ponownie.');
  }

  try {
    const res = await fetch(`${API_BASE_URL}/user/favorite-locations/${encodeURIComponent(cityName)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Błąd dodawania miasta: ${res.status} - ${errText}`);
    }

    const data = await res.json();
    return data; // aktualna lista po dodaniu
  } catch (err) {
    console.error('[API] addFavoriteCity:', err);
    throw err;
  }
}

export async function removeFavoriteCity(cityName) {
  const token = localStorage.getItem('authToken');

  if (!token) {
    throw new Error('Brak tokena. Zaloguj się ponownie.');
  }

  try {
    const res = await fetch(`${API_BASE_URL}/user/favorite-locations/${encodeURIComponent(cityName)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Błąd usuwania miasta: ${res.status} - ${errText}`);
    }

    const data = await res.json();
    return data; // aktualna lista po usunięciu
  } catch (err) {
    console.error('[API] removeFavoriteCity:', err);
    throw err;
  }
}

export async function getAvailableLocations() {
  const token = localStorage.getItem('authToken');

  if (!token) {
    throw new Error('Brak tokena. Zaloguj się ponownie.');
  }

  try {
    const res = await fetch(`${API_BASE_URL}/locations`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Błąd pobierania lokalizacji: ${res.status} - ${errText}`);
    }

    const data = await res.json();
    return data; // Zwraca tablicę Location
  } catch (err) {
    console.error('[API] getAvailableLocations:', err);
    throw err;
  }
}


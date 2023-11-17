import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [postalCode, setPostalCode] = useState('');
  const [locationInfo, setLocationInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (event) => {
    setPostalCode(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if postalCode is empty
    if (!postalCode) {
      setError('Please enter a postal code.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`https://api.zippopotam.us/in/${postalCode}`);

      if (!response.ok) {
        throw new Error('Invalid postal code. Please enter a valid one.');
      }

      const data = await response.json();
      setLocationInfo(data);
      setError('');
    } catch (err) {
      setLocationInfo(null);
      setError(err.message || 'Error fetching location information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPostalCode('');
    setLocationInfo(null);
    setError('');
  };

  return (
    <div className="App">
      <h1>Postal Code App</h1>

      <form onSubmit={handleSubmit} className="form-container">
        <label>
          Enter Postal Code:
          <input
            type="text"
            maxLength="10"
            minLength="6"
            placeholder="Postal code"
            value={postalCode}
            onChange={handleInputChange}
          />
        </label>

         <button type="submit" class="btn btn-primary" disabled={loading}>{loading ? 'Fetching Information' : 'Search'}</button>
        {locationInfo && (
          <button onClick={handleClear} className="clear-button">
            Clear
          </button>



        )}
      </form>

      {error && <p className="error">{error}</p>}

      {locationInfo && (
        <div className="location-info-container">
          <h2>Location Information:</h2>
          <p>Country: {locationInfo.country}</p>
          {locationInfo.places && locationInfo.places.length > 0 && (
            <div>
              <p>State: {locationInfo.places[0].state}</p>
              <p>Place Name: {locationInfo.places[0]['place name']}</p>
              <div className="mapbox">
                <div className="map-container">
                  <iframe title="Google Map" src={`https://maps.google.com/maps?q=${encodeURIComponent (locationInfo.places[0]['place name'])}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                    width="300" 
                    height="150" 
                    allowFullScreen 
                  ></iframe>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;

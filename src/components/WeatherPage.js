// src/components/WeatherPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import L from 'leaflet';
import '../styles/WeatherPage.css';
import 'leaflet/dist/leaflet.css';

const WeatherPage = () => {
  const { cityName } = useParams();
  const [weather, setWeather] = useState(null);
  const [unit, setUnit] = useState('metric'); // 'metric' for Celsius, 'imperial' for Fahrenheit
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkIfFavorite(cityName);
    fetchWeather(cityName);
  }, [cityName, unit]);

  const fetchWeather = (city) => {
    setLoading(true);
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=07f71ecfc37d2c9c571a59cfeccaa75f&units=${unit}`)
      .then(response => response.json())
      .then(data => {
        setWeather(data);
        setLoading(false);
        if (data.coord) {
          initMap(data.coord.lat, data.coord.lon);
        }
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  };

  const toggleUnit = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
  };

  const checkIfFavorite = (city) => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setIsFavorite(favorites.includes(city));
  };

  const saveFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(cityName)) {
      favorites.push(cityName);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  const initMap = (lat, lon) => {
    const map = L.map('map').setView([lat, lon], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    L.marker([lat, lon]).addTo(map).bindPopup('City Location').openPopup();
  };

  const getBackgroundClass = () => {
    if (!weather) return '';
    const condition = weather.weather[0].main.toLowerCase();
    if (condition.includes('rain')) return 'rainy';
    if (condition.includes('cloud')) return 'cloudy';
    if (condition.includes('sun')) return 'sunny';
    return 'default-weather';
  };

  if (loading) return <p>Loading weather data...</p>;
  if (error) return <p>Error loading weather data</p>;

  return (
    <div className={`weather-page ${getBackgroundClass()}`}>
      {weather && (
        <>
          <h1>Weather in {weather.name}</h1>
          <p>Temperature: {weather.main.temp} {unit === 'metric' ? '°C' : '°F'}</p>
          <p>Humidity: {weather.main.humidity} %</p>
          <p>Wind Speed: {weather.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</p>
          <p>Pressure: {weather.main.pressure} hPa</p>

          <button onClick={toggleUnit}>
            Switch to {unit === 'metric' ? 'Fahrenheit' : 'Celsius'}
          </button>

          <button onClick={saveFavorite} disabled={isFavorite}>
            {isFavorite ? 'Saved as Favorite' : 'Save as Favorite'}
          </button>

          <div id="map" style={{ height: '400px', width: '100%', marginTop: '20px' }}></div>
        </>
      )}
    </div>
  );
};

export default WeatherPage;





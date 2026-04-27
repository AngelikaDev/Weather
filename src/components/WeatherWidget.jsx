import { useState, useEffect, useRef, useCallback } from 'react';
import { getCoordinates, getWeather } from '../services/weatherService';
import './WeatherWidget.css';

const DEFAULT_CITY = 'Тюмень';

function WeatherWidget({ onClose }) {
  const [isLoading, setIsLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState(DEFAULT_CITY);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(null);
  const [cityError, setCityError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const failedCities = useRef(new Set());
  const abortControllerRef = useRef(null);

  const fetchWeatherForCity = useCallback(async (cityName) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    setIsFetching(true);
    setCityError(null);
    setError(null);
    
    try {
      const coords = await getCoordinates(cityName, signal);
      
      const weatherData = await getWeather(coords.lat, coords.lon, signal);
      
      setWeather(weatherData);
      setCity(weatherData.city);
      setInputValue(weatherData.city);
      setCityError(null);
      setError(null);
      
      failedCities.current.delete(cityName);
      
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Request aborted');
        return;
      }
      
      if (err.message === 'City not found') {
        setCityError(`Не удалось получить данные для города ${cityName}`);
        setInputValue('');
        failedCities.current.add(cityName);
      } else {
        setError('Не удалось получить данные');
        setWeather(null);
        setInputValue(cityName);
      }
    } finally {
      setIsFetching(false);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeatherForCity(DEFAULT_CITY);
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchWeatherForCity]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (cityError) {
      setCityError(null);
    }
  };

  const handleFetchWeather = async () => {
    if (!inputValue.trim()) return;
    
    if (failedCities.current.has(inputValue)) {
      setCityError(`Не удалось получить данные для города ${inputValue}`);
      return;
    }
    
    await fetchWeatherForCity(inputValue);
  };

  return (
    <div className="weather-widget">
      <button className="close-btn" onClick={onClose}>✕</button>
      
      <h3>🌤️ Погода</h3>
      
      {isLoading ? (
        <div className="skeleton-loader">
          <div className="skeleton-image"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text short"></div>
        </div>
      ) : (
        <>
          <div className="weather-search">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Введите город"
              disabled={isFetching}
            />
            <button 
              onClick={handleFetchWeather}
              disabled={isFetching || !inputValue.trim()}
            >
              {isFetching ? 'Загрузка...' : 'Получить погоду'}
            </button>
          </div>
          
          {cityError && (
            <div className="error-message city-error">
              {cityError}
            </div>
          )}
          
          {weather && !error ? (
            <div className="weather-info">
              <div className="weather-main">
                <img src={weather.icon} alt={weather.description} />
                <div className="weather-temp">{weather.temp}°C</div>
              </div>
              <div className="weather-details">
                <p className="weather-city">{weather.city}</p>
                <p className="weather-description">{weather.description}</p>
                <div className="weather-stats">
                  <span>💧 Влажность: {weather.humidity}%</span>
                  <span>💨 Ветер: {weather.wind} м/с</span>
                </div>
              </div>
            </div>
          ) : error && (
            <div className="error-message weather-error">
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default WeatherWidget;
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const GEOCODING_URL = 'https://api.openweathermap.org/geo/1.0/direct';
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const getCoordinates = async (cityName, signal) => {
  const url = `${GEOCODING_URL}?q=${encodeURIComponent(cityName)}&limit=1&appid=${API_KEY}`;
  const response = await fetch(url, { signal });
  
  if (!response.ok) {
    throw new Error('Geocoding API error');
  }
  
  const data = await response.json();
  
  if (!data || data.length === 0) {
    throw new Error('City not found');
  }
  
  return {
    lat: data[0].lat,
    lon: data[0].lon,
    name: data[0].name
  };
};

export const getWeather = async (lat, lon, signal) => {
  const url = `${WEATHER_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url, { signal });
  
  if (!response.ok) {
    throw new Error('Weather API error');
  }
  
  const data = await response.json();
  
  return {
    city: data.name,
    temp: Math.round(data.main.temp),
    description: data.weather[0].description,
    icon: `https://openweathermap.org/img/w/${data.weather[0].icon}.png`,
    humidity: data.main.humidity,
    wind: data.wind.speed
  };
};
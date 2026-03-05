import axios from 'axios';

export interface WeatherData {
  temp: number;
  conditionCode: number;
}

export const getWeather = async (city: string): Promise<WeatherData | null> => {
  try {
    // 1. Geocoding
    const geoRes = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
    
    if (!geoRes.data.results || geoRes.data.results.length === 0) return null;
    
    const { latitude, longitude } = geoRes.data.results[0];
    
    // 2. Weather
    const weatherRes = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
    
    return {
      temp: Math.round(weatherRes.data.current_weather.temperature),
      conditionCode: weatherRes.data.current_weather.weathercode
    };
  } catch (error) {
    console.error('Weather fetch error:', error);
    return null;
  }
};

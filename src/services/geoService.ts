import axios from 'axios';

export interface CityResult {
  name: string;
  country: string;
  countryCode: string;
  timezone: string;
  latitude: number;
  longitude: number;
  admin1?: string; // State/Province
}

export const searchCities = async (query: string): Promise<CityResult[]> => {
  if (!query || query.length < 2) return [];
  
  try {
    const res = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`);
    
    if (!res.data.results) return [];
    
    return res.data.results.map((r: any) => ({
      name: r.name,
      country: r.country,
      countryCode: r.country_code,
      timezone: r.timezone,
      latitude: r.latitude,
      longitude: r.longitude,
      admin1: r.admin1
    }));
  } catch (error) {
    console.error('City search error:', error);
    return [];
  }
};

export const getFlagUrl = (countryCode: string) => {
  if (!countryCode) return '';
  return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
};

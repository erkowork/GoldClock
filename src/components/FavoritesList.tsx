import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { DateTime } from 'luxon';
import { formatTime, tzMapping, parseTimezoneInput } from '../utils/timezone';
import { Trash2, Plus, MapPin, X, Sun, Cloud, CloudRain, Snowflake, CloudLightning, CloudSun, CloudDrizzle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { translations } from '../utils/translations';
import { getWeather, WeatherData } from '../services/weatherService';
import { searchCities, CityResult, getFlagUrl } from '../services/geoService';
import Fuse from 'fuse.js';

const WeatherIcon = ({ code, className }: { code: number, className?: string }) => {
  if (code === 0) return <Sun className={className} />;
  if (code >= 1 && code <= 3) return <CloudSun className={className} />;
  if (code === 45 || code === 48) return <Cloud className={className} />;
  if (code >= 51 && code <= 55) return <CloudDrizzle className={className} />;
  if (code >= 61 && code <= 65) return <CloudRain className={className} />;
  if (code >= 71 && code <= 75) return <Snowflake className={className} />;
  if (code >= 80 && code <= 82) return <CloudRain className={className} />;
  if (code >= 95) return <CloudLightning className={className} />;
  return <Cloud className={className} />;
};

// Local fuzzy search for common mappings
const fuse = new Fuse(Object.keys(tzMapping).map(key => ({ name: key, tz: tzMapping[key] })), {
  keys: ['name'],
  threshold: 0.3
});

const FavoriteCard = ({ tz, currentTime, removeFavorite, use24HourFormat, language }: any) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [countryCode, setCountryCode] = useState<string>('');
  const timeInZone = currentTime.setZone(tz);
  const isDay = timeInZone.hour >= 6 && timeInZone.hour < 18;

  useEffect(() => {
    const city = tz.split('/').pop()?.replace('_', ' ');
    if (city) {
      getWeather(city).then(setWeather);
      // Try to get country code from search
      searchCities(city).then(results => {
        if (results.length > 0) {
          setCountryCode(results[0].countryCode);
        }
      });
    }
  }, [tz]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      className="glass-panel p-6 rounded-[2rem] relative group overflow-hidden border-2 border-transparent hover:border-accent-color/30 transition-all duration-500"
    >
      <div className={`absolute top-0 left-0 w-full h-1.5 ${isDay ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-indigo-900 to-purple-900'}`} />
      
      <button
        onClick={() => removeFavorite(tz)}
        className="absolute top-4 right-4 p-2 text-text-secondary opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all rounded-full hover:bg-red-500/10"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-accent-color uppercase tracking-widest">
          {countryCode ? (
            <img 
              src={getFlagUrl(countryCode)} 
              alt="Flag" 
              className="w-4 h-3 object-cover rounded-sm shadow-sm"
              referrerPolicy="no-referrer"
            />
          ) : (
            <MapPin className="w-3 h-3" />
          )}
          <span className="truncate max-w-[120px]">{tz.split('/').pop()?.replace('_', ' ')}</span>
        </div>
        {weather && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-accent-color/10 border border-accent-color/20">
            <WeatherIcon code={weather.conditionCode} className="w-3 h-3 text-accent-color" />
            <span className="text-[10px] font-bold text-accent-color">{weather.temp}°C</span>
          </div>
        )}
      </div>
      
      <div className="text-5xl font-light tracking-tighter mb-4">
        {formatTime(timeInZone, use24HourFormat)}
      </div>
      
      <div className="flex items-center justify-between text-xs font-medium text-text-secondary">
        <span>{timeInZone.setLocale(language).toFormat('ccc, d. MMM')}</span>
        <span className="bg-bg-primary px-2 py-1 rounded-lg border border-border-color font-mono">
          UTC{timeInZone.toFormat('ZZ')}
        </span>
      </div>
    </motion.div>
  );
};

export default function FavoritesList() {
  const { favorites, removeFavorite, addFavorite, use24HourFormat, language } = useAppStore();
  const t = translations[language];
  const [currentTime, setCurrentTime] = useState(DateTime.local());
  const [newFav, setNewFav] = useState('');
  const [suggestions, setSuggestions] = useState<CityResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(DateTime.local());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!newFav.trim() || newFav.length < 2) {
        setSuggestions([]);
        return;
      }

      // 1. Local Fuzzy Search
      const localResults = fuse.search(newFav).slice(0, 3).map(r => ({
        name: r.item.name,
        country: '',
        countryCode: '',
        timezone: r.item.tz,
        latitude: 0,
        longitude: 0
      }));

      // 2. API Search
      const apiResults = await searchCities(newFav);
      
      const combined = [...localResults, ...apiResults];
      const unique = combined.filter((v, i, a) => a.findIndex(t => t.name.toLowerCase() === v.name.toLowerCase()) === i).slice(0, 8);

      setSuggestions(unique);
      setShowSuggestions(unique.length > 0);
    }, 300);

    return () => clearTimeout(timer);
  }, [newFav]);

  const handleAdd = (city: CityResult) => {
    if (DateTime.local().setZone(city.timezone).isValid) {
      addFavorite(city.timezone);
      setNewFav('');
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleAdd(suggestions[0]);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-bold tracking-tighter mb-2">{t.savedLocations}</h2>
          <p className="text-text-secondary font-medium">Your personal world clock collection</p>
        </div>
        <div className="relative w-full sm:w-auto" ref={suggestionRef}>
          <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-color" />
              <input
                type="text"
                value={newFav}
                onChange={(e) => setNewFav(e.target.value)}
                onFocus={() => newFav.length > 1 && suggestions.length > 0 && setShowSuggestions(true)}
                placeholder={t.addTimezone}
                className="w-full pl-11 pr-4 py-3 rounded-full bg-bg-secondary border-2 border-border-color focus:border-accent-color outline-none text-sm font-medium transition-all"
              />
            </div>
            <button type="submit" className="p-3 rounded-full bg-accent-color text-[var(--accent-text)] hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-accent-color/20">
              <Plus className="w-5 h-5" />
            </button>
          </form>

          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-bg-secondary border border-border-color rounded-2xl shadow-2xl z-50 overflow-hidden"
              >
                {suggestions.map((s, idx) => (
                  <button
                    key={`${s.name}-${idx}`}
                    onClick={() => handleAdd(s)}
                    className="w-full px-4 py-3 text-left text-sm font-medium hover:bg-accent-color/10 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      {s.countryCode ? (
                        <img 
                          src={getFlagUrl(s.countryCode)} 
                          alt={s.country} 
                          className="w-4 h-3 object-cover rounded-sm shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <MapPin className="w-3 h-3 text-accent-color opacity-50" />
                      )}
                      <div className="flex flex-col">
                        <span className="capitalize">{s.name}</span>
                        {s.country && <span className="text-[10px] text-text-secondary opacity-70">{s.country}</span>}
                      </div>
                    </div>
                    <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 text-accent-color" />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {favorites.map((tz) => (
            <FavoriteCard
              key={tz}
              tz={tz}
              currentTime={currentTime}
              removeFavorite={removeFavorite}
              use24HourFormat={use24HourFormat}
              language={language}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, ArrowRight, Clock, Plus, X, Sun, Cloud, CloudRain, Snowflake, CloudLightning, CloudSun, CloudDrizzle } from 'lucide-react';
import { extractTimeAndZone, parseDateTimeWithZone, getGermanTime, formatTime, parseTimezoneInput, tzMapping } from '../utils/timezone';
import { useAppStore } from '../store/useAppStore';
import { DateTime } from 'luxon';
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

export default function Converter() {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<CityResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { use24HourFormat, language, addFavorite, favorites } = useAppStore();
  const t = translations[language];
  const suggestionRef = useRef<HTMLDivElement>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [selectedCity, setSelectedCity] = useState<CityResult | null>(null);

  const [result, setResult] = useState<{
    sourceTime: DateTime;
    sourceZone: string;
    germanTime: DateTime;
    isJustZone?: boolean;
  } | null>(null);

  useEffect(() => {
    if (selectedCity) {
      getWeather(selectedCity.name).then(setWeather);
    } else {
      setWeather(null);
    }
  }, [selectedCity]);

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
    const timer = setTimeout(async () => {
      if (!input.trim() || input.length < 2) {
        setSuggestions([]);
        return;
      }

      // 1. Local Fuzzy Search
      const localResults = fuse.search(input).slice(0, 3).map(r => ({
        name: r.item.name,
        country: '',
        countryCode: '',
        timezone: r.item.tz,
        latitude: 0,
        longitude: 0
      }));

      // 2. API Search (GeoNames based)
      const apiResults = await searchCities(input);
      
      // Combine and deduplicate
      const combined = [...localResults, ...apiResults];
      const unique = combined.filter((v, i, a) => a.findIndex(t => t.name.toLowerCase() === v.name.toLowerCase()) === i).slice(0, 8);
      
      setSuggestions(unique);
      setShowSuggestions(unique.length > 0);
    }, 300);

    return () => clearTimeout(timer);
  }, [input]);

  const handleSelectCity = (city: CityResult) => {
    setSelectedCity(city);
    const nowInZone = DateTime.local().setZone(city.timezone);
    
    setResult({
      sourceTime: nowInZone,
      sourceZone: city.timezone,
      germanTime: getGermanTime(nowInZone),
      isJustZone: true
    });
    
    setInput(city.name);
    setShowSuggestions(false);
  };

  const handleAddFavorite = () => {
    if (result) {
      addFavorite(result.sourceZone);
      setInput('');
      setResult(null);
      setSelectedCity(null);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative group" ref={suggestionRef}>
        <div className="absolute -inset-1 bg-gradient-to-r from-accent-color/20 to-accent-color/10 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative glass-panel rounded-[2rem] p-2 flex items-center gap-2 border-2 border-accent-color/20 focus-within:border-accent-color transition-all shadow-2xl">
          <div className="pl-4">
            <Search className="w-6 h-6 text-accent-color" />
          </div>
          <input
            type="text"
            value={input}
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.placeholder}
            className="flex-1 bg-transparent border-none outline-none py-4 px-2 text-lg font-medium placeholder:text-text-secondary/50"
          />
          {input && (
            <button 
              onClick={() => setInput('')}
              className="p-2 hover:bg-accent-color/10 rounded-full transition-colors mr-2"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-bg-secondary border border-border-color rounded-2xl shadow-2xl overflow-hidden z-[60]"
            >
              <div className="p-2 flex flex-col gap-1">
                {suggestions.map((s, idx) => (
                  <button
                    key={`${s.name}-${idx}`}
                    onClick={() => handleSelectCity(s)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-accent-color/10 rounded-xl transition-colors text-left group"
                  >
                    {s.countryCode ? (
                      <img 
                        src={getFlagUrl(s.countryCode)} 
                        alt={s.country} 
                        className="w-5 h-3.5 object-cover rounded-sm shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <MapPin className="w-4 h-4 text-accent-color opacity-50 group-hover:opacity-100" />
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-bold capitalize text-text-primary">{s.name}</span>
                      {s.country && <span className="text-[10px] text-text-secondary opacity-70">{s.country}{s.admin1 ? `, ${s.admin1}` : ''}</span>}
                    </div>
                    <span className="ml-auto text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-50">
                      {s.timezone.split('/').pop()?.replace('_', ' ')}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-8 flex flex-col gap-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-6">
              {/* Source Time */}
              <div className="glass-panel p-8 rounded-[2rem] text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-text-secondary/20" />
                <div className="flex items-center justify-center gap-2 text-text-secondary mb-3">
                  {selectedCity?.countryCode ? (
                    <img 
                      src={getFlagUrl(selectedCity.countryCode)} 
                      alt={selectedCity.country} 
                      className="w-4 h-3 object-cover rounded-sm shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <MapPin className="w-4 h-4" />
                  )}
                  <span className="text-xs font-bold uppercase tracking-widest">
                    {selectedCity?.name || result.sourceZone.split('/').pop()?.replace('_', ' ')}
                  </span>
                  {weather && (
                    <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-text-secondary/20">
                      <WeatherIcon code={weather.conditionCode} className="w-3.5 h-3.5 text-accent-color" />
                      <span className="text-[10px] font-bold text-accent-color">{weather.temp}°C</span>
                    </div>
                  )}
                </div>
                <div className="text-4xl font-light tracking-tighter mb-2">
                  {formatTime(result.sourceTime, use24HourFormat)}
                </div>
                <div className="text-xs text-text-secondary font-medium">
                  {result.sourceTime.setLocale(language).toFormat('cccc, d. MMMM')}
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-accent-color flex items-center justify-center text-[var(--accent-text)] shadow-lg shadow-accent-color/30 rotate-90 md:rotate-0">
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>

              {/* German Time */}
              <div className="glass-panel p-8 rounded-[2rem] text-center border-2 border-accent-color relative overflow-hidden shadow-xl shadow-accent-color/5">
                <div className="absolute top-0 left-0 w-full h-1 bg-accent-color" />
                <div className="flex items-center justify-center gap-2 text-accent-color mb-3">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">{t.germany}</span>
                </div>
                <div className="text-5xl font-bold tracking-tighter mb-2 text-accent-color">
                  {formatTime(result.germanTime, use24HourFormat)}
                </div>
                <div className="text-xs text-text-secondary font-medium">
                  {result.germanTime.setLocale(language).toFormat('cccc, d. MMMM')}
                </div>
              </div>
            </div>

            {/* Add to Favorites Button */}
            {!favorites.includes(result.sourceZone) && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleAddFavorite}
                className="mx-auto flex items-center gap-3 px-8 py-4 rounded-full bg-accent-color text-[var(--accent-text)] font-black tracking-widest uppercase text-[10px] hover:brightness-110 transition-all active:scale-95 shadow-xl shadow-accent-color/30"
              >
                <Plus className="w-4 h-4" />
                {language === 'de' ? 'Zu Favoriten hinzufügen' : 'Add to Favorites'}
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

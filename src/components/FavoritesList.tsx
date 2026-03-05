import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { DateTime } from 'luxon';
import { formatTime, tzMapping } from '../utils/timezone';
import { Trash2, Plus, MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { translations } from '../utils/translations';

export default function FavoritesList() {
  const { favorites, removeFavorite, addFavorite, use24HourFormat, language } = useAppStore();
  const t = translations[language];
  const [currentTime, setCurrentTime] = useState(DateTime.local());
  const [newFav, setNewFav] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Get all supported IANA timezones
  const allTimezones = Intl.supportedValuesOf('timeZone');

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
    if (newFav.trim().length > 1) {
      const query = newFav.toLowerCase();
      
      // Check expanded mapping first
      const matchedFromMapping = Object.keys(tzMapping)
        .filter(key => key.includes(query))
        .map(key => ({ name: key, tz: tzMapping[key] }));

      const matchedFromIANA = allTimezones
        .filter(tz => tz.toLowerCase().includes(query))
        .map(tz => ({ name: tz, tz }));

      const combined = [...matchedFromMapping, ...matchedFromIANA];
      
      // Remove duplicates by timezone
      const unique = combined.filter((v, i, a) => a.findIndex(t => t.tz === v.tz) === i).slice(0, 6);

      setSuggestions(unique.map(u => u.name));
      setShowSuggestions(unique.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [newFav]);

  const handleAdd = (input: string) => {
    const query = input.toLowerCase().trim();
    let tz = tzMapping[query] || input;

    if (DateTime.local().setZone(tz).isValid) {
      addFavorite(tz);
      setNewFav('');
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFav.trim()) {
      handleAdd(newFav);
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
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleAdd(s)}
                    className="w-full px-4 py-3 text-left text-sm font-medium hover:bg-accent-color/10 transition-colors flex items-center justify-between group"
                  >
                    <span className="capitalize">{s.replace(/_/g, ' ')}</span>
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
          {favorites.map((tz) => {
            const timeInZone = currentTime.setZone(tz);
            const isDay = timeInZone.hour >= 6 && timeInZone.hour < 18;
            
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                key={tz}
                className="glass-panel p-6 rounded-[2rem] relative group overflow-hidden border-2 border-transparent hover:border-accent-color/30 transition-all duration-500"
              >
                <div className={`absolute top-0 left-0 w-full h-1.5 ${isDay ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-indigo-900 to-purple-900'}`} />
                
                <button
                  onClick={() => removeFavorite(tz)}
                  className="absolute top-4 right-4 p-2 text-text-secondary opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all rounded-full hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2 text-xs font-bold text-accent-color uppercase tracking-widest mb-4">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate pr-4">{tz.split('/').pop()?.replace('_', ' ')}</span>
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
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

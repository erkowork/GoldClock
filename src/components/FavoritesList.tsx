import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { DateTime } from 'luxon';
import { formatTime } from '../utils/timezone';
import { Trash2, Plus, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { translations } from '../utils/translations';

export default function FavoritesList() {
  const { favorites, removeFavorite, addFavorite, use24HourFormat, language } = useAppStore();
  const t = translations[language];
  const [currentTime, setCurrentTime] = useState(DateTime.local());
  const [newFav, setNewFav] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(DateTime.local());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFav.trim()) {
      if (DateTime.local().setZone(newFav).isValid) {
        addFavorite(newFav);
        setNewFav('');
      } else {
        alert(language === 'de' ? 'Ungültige Zeitzone. Bitte IANA-Format verwenden (z.B. "America/New_York")' : 'Invalid Timezone. Please use IANA format like "America/New_York"');
      }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-bold tracking-tighter mb-2">{t.savedLocations}</h2>
          <p className="text-text-secondary font-medium">Your personal world clock collection</p>
        </div>
        <form onSubmit={handleAdd} className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-color" />
            <input
              type="text"
              value={newFav}
              onChange={(e) => setNewFav(e.target.value)}
              placeholder={t.addTimezone}
              className="w-full pl-11 pr-4 py-3 rounded-full bg-bg-secondary border-2 border-border-color focus:border-accent-color outline-none text-sm font-medium transition-all"
            />
          </div>
          <button type="submit" className="p-3 rounded-full bg-accent-color text-white hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-accent-color/20">
            <Plus className="w-5 h-5" />
          </button>
        </form>
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

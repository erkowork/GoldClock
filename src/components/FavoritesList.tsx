import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { DateTime } from 'luxon';
import { formatTime } from '../utils/timezone';
import { Trash2, Plus, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export default function FavoritesList() {
  const { favorites, removeFavorite, addFavorite, use24HourFormat } = useAppStore();
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
      // Basic validation if it's a valid IANA zone
      if (DateTime.local().setZone(newFav).isValid) {
        addFavorite(newFav);
        setNewFav('');
      } else {
        alert('Invalid Timezone. Please use IANA format like "America/New_York"');
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-16 px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Saved Locations</h2>
        <form onSubmit={handleAdd} className="flex items-center gap-2">
          <input
            type="text"
            value={newFav}
            onChange={(e) => setNewFav(e.target.value)}
            placeholder="Add timezone (e.g. Asia/Tokyo)"
            className="px-4 py-2 rounded-full bg-bg-secondary border border-border-color focus:border-accent-color outline-none text-sm w-64"
          />
          <button type="submit" className="p-2 rounded-full bg-accent-color text-white hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((tz) => {
          const timeInZone = currentTime.setZone(tz);
          const isDay = timeInZone.hour >= 6 && timeInZone.hour < 18;
          
          return (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={tz}
              className="glass-panel p-5 rounded-2xl relative group overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-full h-1 ${isDay ? 'bg-yellow-400' : 'bg-indigo-900'}`} />
              
              <button
                onClick={() => removeFavorite(tz)}
                className="absolute top-3 right-3 p-1.5 text-text-secondary opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all rounded-full hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="text-sm font-medium text-text-secondary mb-1 truncate pr-8">
                {tz.split('/').pop()?.replace('_', ' ')}
              </div>
              
              <div className="text-3xl font-light tracking-tight mb-1">
                {formatTime(timeInZone, use24HourFormat)}
              </div>
              
              <div className="flex items-center justify-between text-xs text-text-secondary">
                <span>{timeInZone.toFormat('ccc, d MMM')}</span>
                <span className="font-mono bg-bg-primary px-2 py-0.5 rounded border border-border-color">
                  UTC{timeInZone.toFormat('ZZ')}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

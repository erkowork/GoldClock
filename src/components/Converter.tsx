import React, { useState, useEffect } from 'react';
import { Search, MapPin, ArrowRight, Clock } from 'lucide-react';
import { extractTimeAndZone, parseDateTimeWithZone, getGermanTime, formatTime } from '../utils/timezone';
import { useAppStore } from '../store/useAppStore';
import { DateTime } from 'luxon';
import { motion, AnimatePresence } from 'motion/react';
import { translations } from '../utils/translations';

export default function Converter() {
  const [input, setInput] = useState('');
  const { use24HourFormat, language } = useAppStore();
  const t = translations[language];
  const [result, setResult] = useState<{
    sourceTime: DateTime;
    sourceZone: string;
    germanTime: DateTime;
  } | null>(null);

  useEffect(() => {
    if (!input.trim()) {
      setResult(null);
      return;
    }

    const extracted = extractTimeAndZone(input);
    if (extracted) {
      const parsedDt = parseDateTimeWithZone(extracted.time, extracted.zone);
      if (parsedDt) {
        const nowInZone = DateTime.local().setZone(extracted.zone);
        const finalDt = parsedDt.set({ year: nowInZone.year, month: nowInZone.month, day: nowInZone.day });
        
        setResult({
          sourceTime: finalDt,
          sourceZone: extracted.zone,
          germanTime: getGermanTime(finalDt),
        });
      }
    } else {
      setResult(null);
    }
  }, [input]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-accent-color/20 to-accent-color/10 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative glass-panel rounded-[2rem] p-2 flex items-center gap-2 border-2 border-accent-color/20 focus-within:border-accent-color transition-all shadow-2xl">
          <div className="pl-4">
            <Search className="w-6 h-6 text-accent-color" />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.placeholder}
            className="flex-1 bg-transparent border-none outline-none py-4 px-2 text-lg font-medium placeholder:text-text-secondary/50"
          />
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-6"
          >
            {/* Source Time */}
            <div className="glass-panel p-8 rounded-[2rem] text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-text-secondary/20" />
              <div className="flex items-center justify-center gap-2 text-text-secondary mb-3">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">{result.sourceZone.split('/').pop()?.replace('_', ' ')}</span>
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
              <div className="w-12 h-12 rounded-full bg-accent-color flex items-center justify-center text-white shadow-lg shadow-accent-color/30 rotate-90 md:rotate-0">
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

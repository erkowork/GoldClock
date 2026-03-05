import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, Clock, MapPin, Globe2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { parseTimezoneInput, extractTimeAndZone, parseDateTimeWithZone, getGermanTime, formatTime } from '../utils/timezone';
import { DateTime } from 'luxon';
import { motion, AnimatePresence } from 'motion/react';

export default function Converter() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{
    sourceTime: DateTime;
    sourceZone: string;
    germanTime: DateTime;
    isSpecificTime: boolean;
  } | null>(null);
  
  const { use24HourFormat } = useAppStore();
  const [currentTime, setCurrentTime] = useState(DateTime.local());

  // Update current time every minute if no specific time is requested
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(DateTime.local());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!input.trim()) {
      setResult(null);
      return;
    }

    // 1. Try extracting specific time + zone (e.g. "10:00 PST")
    const extracted = extractTimeAndZone(input);
    if (extracted) {
      const parsedDt = parseDateTimeWithZone(extracted.time, extracted.zone);
      if (parsedDt) {
        // We have a specific time in a specific zone
        // If the parsed time is in the past for today, we might want to assume today or tomorrow.
        // For simplicity, we just use the parsed time for today.
        
        // Ensure the date is today in that timezone
        const nowInZone = DateTime.local().setZone(extracted.zone);
        const finalDt = parsedDt.set({ year: nowInZone.year, month: nowInZone.month, day: nowInZone.day });
        
        setResult({
          sourceTime: finalDt,
          sourceZone: extracted.zone,
          germanTime: getGermanTime(finalDt),
          isSpecificTime: true
        });
        return;
      }
    }

    // 2. Try parsing just the timezone (e.g. "Paris", "UTC-5")
    const zone = parseTimezoneInput(input);
    if (zone) {
      const sourceTime = currentTime.setZone(zone);
      setResult({
        sourceTime,
        sourceZone: zone,
        germanTime: getGermanTime(sourceTime),
        isSpecificTime: false
      });
      return;
    }

    setResult(null);
  }, [input, currentTime]);

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 px-4">
      {/* Search Input */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-text-secondary group-focus-within:text-accent-color transition-colors" />
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 'Paris', 'UTC-5', '10:00 PST', 'Meeting at 15:00 in Tokyo'"
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-bg-secondary border-2 border-border-color focus:border-accent-color focus:ring-4 focus:ring-accent-color/20 outline-none transition-all text-lg shadow-sm"
        />
      </div>

      {/* Results Display */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center"
          >
            {/* Source Time */}
            <div className="glass-panel p-6 rounded-3xl flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-text-secondary to-transparent opacity-20" />
              <div className="flex items-center gap-2 text-text-secondary mb-2">
                <MapPin className="w-4 h-4" />
                <span className="font-medium uppercase tracking-wider text-xs">{result.sourceZone.split('/').pop()?.replace('_', ' ')}</span>
              </div>
              <div className="text-5xl font-light tracking-tight mb-1">
                {formatTime(result.sourceTime, use24HourFormat)}
              </div>
              <div className="text-sm text-text-secondary">
                {result.sourceTime.toFormat('ccc, d MMM')}
              </div>
              <div className="mt-4 text-xs font-mono bg-bg-primary px-3 py-1 rounded-full border border-border-color">
                {result.sourceTime.offsetNameShort} (UTC{result.sourceTime.toFormat('ZZ')})
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex justify-center text-text-secondary/50">
              <ArrowRight className="w-8 h-8" />
            </div>

            {/* German Time (Highlight) */}
            <div className="glass-panel p-6 rounded-3xl flex flex-col items-center text-center relative overflow-hidden border-accent-color/50 shadow-[0_0_40px_rgba(212,175,55,0.15)]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-color to-transparent" />
              <div className="flex items-center gap-2 text-accent-color mb-2">
                <Globe2 className="w-4 h-4" />
                <span className="font-medium uppercase tracking-wider text-xs">Germany (Berlin)</span>
              </div>
              <div className="text-6xl font-semibold tracking-tighter mb-1 text-text-primary">
                {formatTime(result.germanTime, use24HourFormat)}
              </div>
              <div className="text-sm text-text-secondary">
                {result.germanTime.toFormat('ccc, d MMM')}
              </div>
              <div className="mt-4 text-xs font-mono bg-bg-primary px-3 py-1 rounded-full border border-border-color">
                {result.germanTime.offsetNameShort} (UTC{result.germanTime.toFormat('ZZ')})
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Default German Time Display when no input */}
      <AnimatePresence>
        {!result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex flex-col items-center p-8 rounded-3xl glass-panel">
              <div className="text-accent-color font-medium tracking-widest uppercase text-sm mb-4">Current Time in Germany</div>
              <div className="text-7xl font-light tracking-tighter">
                {formatTime(getGermanTime(currentTime), use24HourFormat)}
              </div>
              <div className="mt-4 text-text-secondary">
                {getGermanTime(currentTime).toFormat('cccc, d MMMM yyyy')}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState } from 'react';
import { ScanText, ArrowRight } from 'lucide-react';
import { extractTimeAndZone, parseDateTimeWithZone, getGermanTime, formatTime } from '../utils/timezone';
import { useAppStore } from '../store/useAppStore';
import { DateTime } from 'luxon';
import { motion, AnimatePresence } from 'motion/react';

export default function TimezoneScanner() {
  const [text, setText] = useState('');
  const { use24HourFormat } = useAppStore();
  const [result, setResult] = useState<{
    sourceTime: DateTime;
    sourceZone: string;
    germanTime: DateTime;
  } | null>(null);

  const handleScan = () => {
    if (!text.trim()) return;
    
    const extracted = extractTimeAndZone(text);
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
        return;
      }
    }
    setResult(null);
    alert('Could not detect a valid time and timezone in the text.');
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-16 px-4">
      <div className="flex items-center gap-2 mb-6">
        <ScanText className="w-6 h-6 text-accent-color" />
        <h2 className="text-2xl font-semibold tracking-tight">Timezone Scanner</h2>
      </div>

      <div className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste text here... e.g. 'Let's meet tomorrow at 10:00 PST for the sync.'"
            className="w-full h-32 p-4 rounded-2xl bg-bg-secondary border border-border-color focus:border-accent-color outline-none resize-none text-sm"
          />
          <button
            onClick={handleScan}
            className="self-end px-6 py-2 rounded-full bg-accent-color text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <ScanText className="w-4 h-4" />
            Scan Text
          </button>
        </div>

        <div className="w-px bg-border-color hidden md:block" />

        <div className="flex-1 flex items-center justify-center min-h-[160px]">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center text-center"
              >
                <div className="text-sm text-text-secondary mb-2">
                  Detected: <span className="font-medium text-text-primary">{formatTime(result.sourceTime, use24HourFormat)} {result.sourceZone.split('/').pop()?.replace('_', ' ')}</span>
                </div>
                <div className="text-text-secondary/50 mb-2">
                  <ArrowRight className="w-5 h-5 rotate-90 md:rotate-0" />
                </div>
                <div className="text-accent-color font-medium tracking-widest uppercase text-xs mb-1">
                  German Time
                </div>
                <div className="text-5xl font-semibold tracking-tighter text-text-primary">
                  {formatTime(result.germanTime, use24HourFormat)}
                </div>
                <div className="text-xs text-text-secondary mt-2">
                  {result.germanTime.toFormat('ccc, d MMM')}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-text-secondary/50 text-center text-sm"
              >
                Paste text and click scan to extract time.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

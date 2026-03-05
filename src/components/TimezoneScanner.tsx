import React, { useState } from 'react';
import { ScanText, ArrowRight, FileText, Sparkles } from 'lucide-react';
import { extractTimeAndZone, parseDateTimeWithZone, getGermanTime, formatTime } from '../utils/timezone';
import { useAppStore } from '../store/useAppStore';
import { DateTime } from 'luxon';
import { motion, AnimatePresence } from 'motion/react';
import { translations } from '../utils/translations';

export default function TimezoneScanner() {
  const [text, setText] = useState('');
  const { use24HourFormat, language } = useAppStore();
  const t = translations[language];
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
    alert(language === 'de' ? 'Keine gültige Zeit/Zeitzone im Text gefunden.' : 'Could not detect a valid time and timezone in the text.');
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-8">
        <div>
          <h2 className="text-4xl font-bold tracking-tighter mb-2 flex items-center gap-3">
            <ScanText className="w-10 h-10 text-accent-color" />
            {t.timezoneScanner}
          </h2>
          <p className="text-text-secondary font-medium">Extract time information from any text</p>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-[2.5rem] flex flex-col lg:flex-row gap-12 border-2 border-border-color shadow-2xl">
        <div className="flex-1 flex flex-col gap-6">
          <div className="relative">
            <div className="absolute top-4 left-4 p-2 rounded-lg bg-accent-color/10">
              <FileText className="w-4 h-4 text-accent-color" />
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.pasteText}
              className="w-full h-48 pl-14 pr-6 py-6 rounded-3xl bg-bg-secondary border-2 border-border-color focus:border-accent-color outline-none resize-none text-base font-medium transition-all"
            />
          </div>
          <button
            onClick={handleScan}
            className="self-end px-10 py-4 rounded-full bg-accent-color text-white font-bold hover:opacity-90 transition-all active:scale-95 flex items-center gap-3 shadow-lg shadow-accent-color/20"
          >
            <Sparkles className="w-5 h-5" />
            {t.scanText}
          </button>
        </div>

        <div className="w-px bg-border-color hidden lg:block" />

        <div className="flex-1 flex items-center justify-center min-h-[240px] relative">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center text-center w-full"
              >
                <div className="px-4 py-1.5 rounded-full bg-bg-secondary border border-border-color text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-6">
                  {t.detected}: <span className="text-accent-color">{formatTime(result.sourceTime, use24HourFormat)} {result.sourceZone.split('/').pop()?.replace('_', ' ')}</span>
                </div>
                
                <div className="text-accent-color/20 mb-6">
                  <ArrowRight className="w-12 h-12 rotate-90 lg:rotate-0" />
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-accent-color font-bold tracking-[0.2em] uppercase text-[10px] mb-2">
                    {t.germanTime}
                  </div>
                  <div className="text-7xl font-extrabold tracking-tighter text-text-primary mb-2">
                    {formatTime(result.germanTime, use24HourFormat)}
                  </div>
                  <div className="text-sm font-bold text-text-secondary uppercase tracking-widest">
                    {result.germanTime.setLocale(language).toFormat('cccc, d. MMMM')}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-text-secondary/30 text-center flex flex-col items-center gap-4"
              >
                <ScanText className="w-16 h-16 opacity-10" />
                <p className="text-lg font-medium max-w-[200px]">{t.emptyScanner}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

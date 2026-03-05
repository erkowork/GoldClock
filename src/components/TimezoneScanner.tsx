import React, { useState } from 'react';
import { ScanText, ArrowRight, FileText, Sparkles, ClipboardPaste } from 'lucide-react';
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

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch (err) {
      console.error('Failed to read clipboard', err);
    }
  };

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
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent-color/10">
            <ScanText className="w-5 h-5 text-accent-color" />
          </div>
          <h2 className="text-2xl font-bold tracking-tighter">{t.timezoneScanner}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePaste}
            className="px-4 py-2 rounded-full bg-bg-secondary border border-border-color text-text-secondary text-[10px] font-bold uppercase tracking-widest hover:border-accent-color hover:text-accent-color transition-all flex items-center gap-2"
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            {language === 'de' ? 'Einfügen' : 'Paste'}
          </button>
          <button
            onClick={handleScan}
            className="px-6 py-2 rounded-full bg-accent-color text-[var(--accent-text)] text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-accent-color/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {t.scanText}
          </button>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-[1.5rem] flex flex-col md:flex-row gap-6 border-2 border-border-color shadow-lg">
        <div className="flex-1 relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.pasteText}
            className="w-full h-24 p-4 rounded-xl bg-bg-secondary border border-border-color focus:border-accent-color outline-none resize-none text-xs font-medium transition-all"
          />
        </div>

        <div className="w-px bg-border-color hidden md:block" />

        <div className="flex-1 flex items-center justify-center min-h-[100px]">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center text-center"
              >
                <div className="px-2 py-0.5 rounded-full bg-bg-secondary border border-border-color text-[8px] font-bold uppercase tracking-widest text-text-secondary mb-2">
                  {t.detected}: <span className="text-accent-color">{formatTime(result.sourceTime, use24HourFormat)} {result.sourceZone.split('/').pop()?.replace('_', ' ')}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-accent-color/30">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-accent-color font-bold tracking-[0.2em] uppercase text-[8px] mb-0.5">
                      {t.germanTime}
                    </div>
                    <div className="text-3xl font-black tracking-tighter text-text-primary">
                      {formatTime(result.germanTime, use24HourFormat)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-text-secondary/20 text-center flex flex-col items-center gap-2"
              >
                <ScanText className="w-8 h-8 opacity-10" />
                <p className="text-[10px] font-bold uppercase tracking-widest">{t.emptyScanner}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

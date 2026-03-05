import React from 'react';
import { useAppStore, Theme } from '../store/useAppStore';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Sparkles } from 'lucide-react';
import { translations } from '../utils/translations';

interface ThemeOption {
  id: Theme;
  name: string;
  preview: string; // CSS classes for preview
  accent: string;
  description: string;
}

const themeOptions: ThemeOption[] = [
  { id: 'light', name: 'Light', preview: 'bg-white border-slate-200', accent: 'bg-[#d4af37]', description: 'Clean & Professional' },
  { id: 'dark', name: 'Dark', preview: 'bg-[#0f172a] border-slate-800', accent: 'bg-[#d4af37]', description: 'Classic Night Mode' },
  { id: 'gold-glass', name: 'Gold Glass', preview: 'bg-[#121212] border-[#d4af37]/30', accent: 'bg-[#d4af37]', description: 'Luxury & Elegance' },
  { id: 'midnight-neon', name: 'Midnight Neon', preview: 'bg-black border-[#00ffcc]/30', accent: 'bg-[#00ffcc]', description: 'Futuristic Cyberpunk' },
  { id: 'rose-quartz', name: 'Rose Quartz', preview: 'bg-[#fff5f7] border-pink-200', accent: 'bg-[#ff4081]', description: 'Soft & Approachable' },
  { id: 'emerald-forest', name: 'Emerald Forest', preview: 'bg-[#061a14] border-emerald-800', accent: 'bg-[#20c997]', description: 'Deep & Organic' },
  { id: 'editorial-serif', name: 'Editorial', preview: 'bg-[#fdfcf0] border-stone-300', accent: 'bg-[#1a1a1a]', description: 'Classic Typography' },
  { id: 'high-contrast', name: 'Contrast', preview: 'bg-black border-white', accent: 'bg-[#ffff00]', description: 'Maximum Visibility' },
];

export default function ThemeMenu() {
  const { theme, setTheme, language, isThemeMenuOpen, setIsThemeMenuOpen } = useAppStore();
  const t = translations[language];

  const onClose = () => setIsThemeMenuOpen(false);

  return (
    <AnimatePresence>
      {isThemeMenuOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-bg-secondary border border-border-color rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-6 md:p-8 flex flex-col h-full overflow-hidden">
              <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-accent-color/20 ring-1 ring-accent-color/30">
                    <Sparkles className="w-5 h-5 text-accent-color" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight text-text-primary">{t.themes}</h3>
                    <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest opacity-70">Style your interface</p>
                  </div>
                </div>
                <button 
                  onClick={onClose} 
                  className="p-2 hover:bg-accent-color/10 rounded-full transition-all border border-border-color hover:border-accent-color/50 group"
                >
                  <X className="w-5 h-5 text-text-primary group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-2 custom-scrollbar pb-4">
                {themeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setTheme(opt.id)}
                    className={`group relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all text-center ${
                      theme === opt.id 
                        ? 'border-accent-color bg-accent-color/10 shadow-lg' 
                        : 'border-border-color hover:border-accent-color/30 hover:bg-bg-primary/50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl border-2 flex-shrink-0 ${opt.preview} flex items-center justify-center overflow-hidden shadow-md group-hover:scale-105 transition-transform`}>
                      <div className={`w-6 h-6 rounded-full ${opt.accent} shadow-inner flex items-center justify-center ring-2 ring-white/20`}>
                        {theme === opt.id && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-text-primary text-xs tracking-tight">{opt.name}</span>
                      <span className="text-[7px] uppercase font-bold tracking-widest text-text-secondary opacity-80">{opt.description}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border-color shrink-0 flex justify-center">
                <button 
                  onClick={onClose}
                  className="w-full px-8 py-3 rounded-full bg-accent-color text-[var(--accent-text)] font-black tracking-widest uppercase text-[10px] hover:brightness-110 transition-all active:scale-95 shadow-xl shadow-accent-color/30"
                >
                  {language === 'de' ? 'Fertig' : 'Done'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

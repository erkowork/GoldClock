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
  { id: 'light', name: 'Light', preview: 'bg-white border-slate-200', accent: 'bg-gold-500', description: 'Clean & Professional' },
  { id: 'dark', name: 'Dark', preview: 'bg-slate-900 border-slate-800', accent: 'bg-gold-500', description: 'Classic Night Mode' },
  { id: 'gold-glass', name: 'Gold Glass', preview: 'bg-stone-900 border-gold-500/30', accent: 'bg-gold-500', description: 'Luxury & Elegance' },
  { id: 'midnight-neon', name: 'Midnight Neon', preview: 'bg-black border-cyan-500/30', accent: 'bg-cyan-500', description: 'Futuristic Cyberpunk' },
  { id: 'rose-quartz', name: 'Rose Quartz', preview: 'bg-pink-50 border-pink-200', accent: 'bg-pink-500', description: 'Soft & Approachable' },
  { id: 'emerald-forest', name: 'Emerald Forest', preview: 'bg-emerald-950 border-emerald-800', accent: 'bg-emerald-500', description: 'Deep & Organic' },
  { id: 'editorial-serif', name: 'Editorial', preview: 'bg-[#fdfcf0] border-stone-300', accent: 'bg-stone-900', description: 'Classic Typography' },
  { id: 'high-contrast', name: 'Contrast', preview: 'bg-black border-white', accent: 'bg-yellow-400', description: 'Maximum Visibility' },
];

export default function ThemeMenu({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { theme, setTheme, language } = useAppStore();
  const t = translations[language];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-bg-secondary border border-border-color rounded-[2.5rem] shadow-2xl overflow-hidden glass-panel"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-accent-color/10">
                    <Sparkles className="w-6 h-6 text-accent-color" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight">{t.themes}</h3>
                    <p className="text-sm text-text-secondary">Personalize your experience</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-bg-primary rounded-full transition-colors border border-border-color">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {themeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setTheme(opt.id)}
                    className={`group relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                      theme === opt.id ? 'border-accent-color bg-accent-color/5' : 'border-border-color hover:border-accent-color/50'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-xl border flex-shrink-0 ${opt.preview} flex items-center justify-center overflow-hidden shadow-inner`}>
                      <div className={`w-6 h-6 rounded-full ${opt.accent} shadow-lg flex items-center justify-center`}>
                        {theme === opt.id && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-text-primary">{opt.name}</span>
                      <span className="text-xs text-text-secondary">{opt.description}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={onClose}
                  className="px-8 py-3 rounded-full bg-accent-color text-white font-bold hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-accent-color/20"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

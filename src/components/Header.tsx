import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Clock, Palette, Languages } from 'lucide-react';
import Logo from './Logo';
import ThemeMenu from './ThemeMenu';

export default function Header() {
  const { use24HourFormat, toggleTimeFormat, language, setLanguage, setIsThemeMenuOpen } = useAppStore();

  return (
    <header className="w-full py-4 px-6 flex items-center justify-between glass-panel rounded-b-2xl sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <Logo className="w-8 h-8 text-accent-color" />
        <h1 className="text-xl font-bold tracking-tighter uppercase">GoldClock</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Toggle */}
        <button 
          onClick={() => setLanguage(language === 'de' ? 'en' : 'de')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-secondary border border-border-color hover:border-accent-color transition-all active:scale-95"
          title="Switch Language"
        >
          <Languages className="w-4 h-4 text-accent-color" />
          <span className="text-xs font-bold uppercase">{language}</span>
        </button>

        {/* Time Format Toggle */}
        <button 
          onClick={toggleTimeFormat}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-secondary border border-border-color hover:border-accent-color transition-all active:scale-95"
        >
          <Clock className="w-4 h-4 text-accent-color" />
          <span className="text-xs font-bold">{use24HourFormat ? '24H' : '12H'}</span>
        </button>

        {/* Theme Menu Toggle */}
        <button 
          onClick={() => setIsThemeMenuOpen(true)}
          className="p-2 rounded-full bg-bg-secondary border border-border-color hover:border-accent-color transition-all active:scale-95 shadow-lg shadow-accent-color/10"
        >
          <Palette className="w-5 h-5 text-accent-color" />
        </button>
      </div>
    </header>
  );
}

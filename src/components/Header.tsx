import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Moon, Sun, Settings, Clock, Globe } from 'lucide-react';
import Logo from './Logo';

export default function Header() {
  const { theme, setTheme, use24HourFormat, toggleTimeFormat } = useAppStore();

  const themes = [
    { id: 'light', icon: Sun },
    { id: 'dark', icon: Moon },
    { id: 'gold-glass', icon: Globe },
    { id: 'high-contrast', icon: Settings },
  ] as const;

  return (
    <header className="w-full py-4 px-6 flex items-center justify-between glass-panel rounded-b-2xl sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <Logo className="w-8 h-8 text-text-primary" />
        <h1 className="text-xl font-semibold tracking-tight">GoldClock</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Time Format Toggle */}
        <button 
          onClick={toggleTimeFormat}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-secondary border border-border-color hover:border-accent-color transition-colors"
        >
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">{use24HourFormat ? '24h' : '12h'}</span>
        </button>

        {/* Theme Selector */}
        <div className="flex bg-bg-secondary rounded-full p-1 border border-border-color">
          {themes.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`p-1.5 rounded-full transition-all ${
                  theme === t.id 
                    ? 'bg-accent-color text-white shadow-md' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                title={`Switch to ${t.id} theme`}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

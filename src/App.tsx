import React, { useEffect } from 'react';
import Header from './components/Header';
import Converter from './components/Converter';
import GoldenGlobe from './components/GoldenGlobe';
import FavoritesList from './components/FavoritesList';
import MeetingPlanner from './components/MeetingPlanner';
import TimezoneScanner from './components/TimezoneScanner';
import ThemeMenu from './components/ThemeMenu';
import Logo from './components/Logo';
import { useAppStore } from './store/useAppStore';
import { motion } from 'motion/react';
import { translations } from './utils/translations';

export default function App() {
  const { theme, language } = useAppStore();
  const t = translations[language];

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-sans transition-colors duration-500 relative overflow-x-hidden">
      <ThemeMenu />
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent-color/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-color/5 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(var(--accent-color) 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
      </div>

      <Header />
      
      <main className="container mx-auto px-4 py-8 pb-24 relative z-10">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center min-h-[60vh] py-12">
          
          {/* Globe Container - Centered and Large */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20 lg:opacity-40 pointer-events-none">
            <div className="w-full max-w-[600px] aspect-square">
              <GoldenGlobe />
            </div>
          </div>

          {/* Main Content Overlay */}
          <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-color/10 border border-accent-color/20 text-accent-color text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
                <Logo className="w-3 h-3" />
                GoldClock Precision
              </div>
              
              <h2 className="text-2xl md:text-4xl font-black tracking-tighter mb-4 leading-none opacity-90">
                {language === 'de' ? 'Intelligente Weltzeit' : 'Intelligent World Time'}
              </h2>
              
              <p className="max-w-lg mx-auto text-text-secondary text-sm md:text-base font-medium opacity-60">
                {t.heroSubtitle}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="w-full"
            >
              <Converter />
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <div className="mt-32 space-y-32">
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <FavoritesList />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <MeetingPlanner />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <TimezoneScanner />
          </motion.section>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-16 px-4 border-t border-border-color bg-bg-secondary/50 backdrop-blur-sm">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <Logo className="w-10 h-10" />
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter uppercase leading-none">GoldClock</span>
              <span className="text-[10px] font-bold text-accent-color tracking-widest uppercase">GoldApps</span>
            </div>
          </div>
          <p className="text-text-secondary text-sm font-bold tracking-tight">
            GoldClock - GoldApps © 2026 - Intelligenter Weltzeit-Konverter
          </p>
        </div>
      </footer>
    </div>
  );
}

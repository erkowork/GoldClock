import React, { useEffect } from 'react';
import Header from './components/Header';
import Converter from './components/Converter';
import GoldenGlobe from './components/GoldenGlobe';
import FavoritesList from './components/FavoritesList';
import MeetingPlanner from './components/MeetingPlanner';
import TimezoneScanner from './components/TimezoneScanner';
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
        <section className="relative flex flex-col items-center justify-center min-h-[80vh] py-12">
          
          {/* Globe Container - Centered and Large */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30 lg:opacity-60 pointer-events-none">
            <div className="w-full max-w-[800px] aspect-square">
              <GoldenGlobe />
            </div>
          </div>

          {/* Main Content Overlay */}
          <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center mb-12"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-1.5 rounded-full bg-accent-color/10 border border-accent-color/20 text-accent-color text-xs font-bold tracking-widest uppercase mb-6"
              >
                Smart World Time Converter
              </motion.div>
              
              <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-[0.9]">
                {t.heroTitle} <br />
                <span className="text-accent-color italic">{t.germany}</span>?
              </h2>
              
              <p className="max-w-xl mx-auto text-text-secondary text-lg md:text-xl font-medium leading-relaxed">
                {t.heroSubtitle}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-color flex items-center justify-center text-white font-bold text-xl">G</div>
            <span className="text-xl font-bold tracking-tighter uppercase">GoldClock</span>
          </div>
          <p className="text-text-secondary text-sm font-medium">
            {t.footer}
          </p>
          <div className="flex gap-6 text-text-secondary">
            <a href="#" className="hover:text-accent-color transition-colors">Privacy</a>
            <a href="#" className="hover:text-accent-color transition-colors">Terms</a>
            <a href="#" className="hover:text-accent-color transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

import React, { useEffect } from 'react';
import Header from './components/Header';
import Converter from './components/Converter';
import GoldenGlobe from './components/GoldenGlobe';
import FavoritesList from './components/FavoritesList';
import MeetingPlanner from './components/MeetingPlanner';
import TimezoneScanner from './components/TimezoneScanner';
import { useAppStore } from './store/useAppStore';
import { motion } from 'motion/react';

export default function App() {
  const theme = useAppStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-sans transition-colors duration-300">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pb-24">
        {/* Hero Section with Globe and Converter */}
        <section className="relative flex flex-col lg:flex-row items-center justify-center gap-12 min-h-[60vh]">
          
          {/* Background Globe (Mobile) / Side Globe (Desktop) */}
          <div className="absolute lg:relative inset-0 lg:inset-auto w-full h-full lg:w-[500px] lg:h-[500px] opacity-20 lg:opacity-100 pointer-events-none lg:pointer-events-auto z-0">
            <GoldenGlobe />
          </div>

          {/* Main Converter UI */}
          <div className="relative z-10 w-full max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-center mb-4">
                What time is it in <span className="text-accent-color">Germany</span>?
              </h2>
              <p className="text-center text-text-secondary mb-8 text-lg">
                Type a city, timezone, or paste a meeting time.
              </p>
              <Converter />
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mt-24 space-y-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <FavoritesList />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <MeetingPlanner />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <TimezoneScanner />
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-text-secondary text-sm border-t border-border-color mt-24">
        <p>GoldClock &copy; {new Date().getFullYear()} - Intelligent World Time Converter</p>
      </footer>
    </div>
  );
}

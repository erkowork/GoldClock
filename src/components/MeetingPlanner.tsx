import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { DateTime } from 'luxon';
import { formatTime } from '../utils/timezone';
import { Users, Clock, Globe } from 'lucide-react';
import { translations } from '../utils/translations';
import { motion } from 'motion/react';

export default function MeetingPlanner() {
  const { favorites, use24HourFormat, language } = useAppStore();
  const t = translations[language];
  const [baseTime, setBaseTime] = useState(DateTime.local().setZone('Europe/Berlin').startOf('hour'));

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    setBaseTime(baseTime.set({ hour: hours, minute: minutes }));
  };

  const getTimeColor = (hour: number) => {
    if (hour >= 9 && hour <= 17) return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    if (hour >= 7 && hour < 9 || hour > 17 && hour <= 21) return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
  };

  const zones = ['Europe/Berlin', ...favorites.filter(f => f !== 'Europe/Berlin')];

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-8">
        <div>
          <h2 className="text-4xl font-bold tracking-tighter mb-2 flex items-center gap-3">
            <Users className="w-10 h-10 text-accent-color" />
            {t.globalMeetingFinder}
          </h2>
          <p className="text-text-secondary font-medium">Coordinate across borders with ease</p>
        </div>
        
        <div className="glass-panel p-4 rounded-3xl flex items-center gap-4 border-2 border-accent-color/20">
          <div className="p-2 rounded-xl bg-accent-color/10">
            <Clock className="w-5 h-5 text-accent-color" />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t.meetingTimeBerlin}</label>
            <input
              type="time"
              value={baseTime.toFormat('HH:mm')}
              onChange={handleTimeChange}
              className="bg-transparent border-none outline-none text-xl font-bold font-mono text-accent-color"
            />
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-[2.5rem] overflow-hidden border-2 border-border-color shadow-2xl">
        <div className="grid grid-cols-[1.5fr_1fr_1fr] gap-4 p-6 border-b border-border-color bg-bg-secondary/50 text-[10px] font-bold uppercase tracking-widest text-text-secondary">
          <div className="flex items-center gap-2">
            <Globe className="w-3 h-3" />
            {t.location}
          </div>
          <div className="text-right">{t.localTime}</div>
          <div className="text-center">{t.status}</div>
        </div>
        
        <div className="divide-y divide-border-color">
          {zones.map((tz, index) => {
            const timeInZone = baseTime.setZone(tz);
            const hour = timeInZone.hour;
            const colorClass = getTimeColor(hour);
            
            return (
              <motion.div 
                key={tz} 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="grid grid-cols-[1.5fr_1fr_1fr] gap-4 p-6 items-center hover:bg-accent-color/[0.02] transition-colors group"
              >
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-text-primary group-hover:text-accent-color transition-colors">
                    {tz.split('/').pop()?.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-bold text-text-secondary font-mono tracking-widest">
                    UTC{timeInZone.toFormat('ZZ')}
                  </span>
                </div>
                
                <div className="text-right flex flex-col">
                  <span className="text-2xl font-light tracking-tighter text-text-primary">
                    {formatTime(timeInZone, use24HourFormat)}
                  </span>
                  <span className="text-[10px] font-bold text-text-secondary uppercase">
                    {timeInZone.setLocale(language).toFormat('ccc, d. MMM')}
                  </span>
                </div>
                
                <div className="flex justify-center">
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${colorClass} shadow-sm`}>
                    {hour >= 9 && hour <= 17 ? t.good : hour >= 7 && hour <= 21 ? t.okay : t.night}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

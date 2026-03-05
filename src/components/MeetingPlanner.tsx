import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { DateTime } from 'luxon';
import { formatTime } from '../utils/timezone';
import { Users, Clock, Globe, Sun, Moon, Sunrise, Sunset, Calendar, Share2 } from 'lucide-react';
import { translations } from '../utils/translations';
import { motion, AnimatePresence } from 'motion/react';

export default function MeetingPlanner() {
  const { favorites, use24HourFormat, language } = useAppStore();
  const t = translations[language];
  const [baseTime, setBaseTime] = useState(DateTime.local().setZone('Europe/Berlin').startOf('hour'));

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    setBaseTime(baseTime.set({ hour: hours, minute: minutes }));
  };

  const getStatusInfo = (hour: number) => {
    if (hour >= 9 && hour <= 17) return { 
      label: t.good, 
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      icon: <Sun className="w-4 h-4" />
    };
    if (hour >= 7 && hour < 9) return { 
      label: t.okay, 
      color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      icon: <Sunrise className="w-4 h-4" />
    };
    if (hour > 17 && hour <= 21) return { 
      label: t.okay, 
      color: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
      icon: <Sunset className="w-4 h-4" />
    };
    return { 
      label: t.night, 
      color: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
      icon: <Moon className="w-4 h-4" />
    };
  };

  const zones = ['Europe/Berlin', ...favorites.filter(f => f !== 'Europe/Berlin')];

  const generateCalendarLink = (type: 'google' | 'outlook' | 'apple', time: DateTime, zone: string) => {
    const title = encodeURIComponent('Global Meeting');
    const start = time.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
    const end = time.plus({ hours: 1 }).toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
    const body = encodeURIComponent(`Meeting scheduled via GoldClock in ${zone}`);
    
    if (type === 'google') {
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${body}`;
    }
    if (type === 'outlook') {
      // More reliable Outlook Web deep link with compact date format
      return `https://outlook.office.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${title}&startdt=${start}&enddt=${end}&body=${body}`;
    }
    // For Apple/ICS
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${start}
DTEND:${end}
SUMMARY:Global Meeting
DESCRIPTION:Meeting scheduled via GoldClock in ${zone}
END:VEVENT
END:VCALENDAR`;
    return `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;
  };

  const [activeExport, setActiveExport] = useState<string | null>(null);

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-8">
        <div>
          <h2 className="text-4xl font-bold tracking-tighter mb-2 flex items-center gap-3">
            <Users className="w-10 h-10 text-accent-color" />
            {t.globalMeetingFinder}
          </h2>
          <p className="text-text-secondary font-medium">
            {t.meetingPlannerSubtitle}
          </p>
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

      <div className="glass-panel rounded-[2.5rem] border-2 border-border-color shadow-2xl">
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 p-6 border-b border-border-color bg-bg-secondary/50 text-[10px] font-bold uppercase tracking-widest text-text-secondary rounded-t-[2.5rem]">
          <div className="flex items-center gap-2">
            <Globe className="w-3 h-3" />
            {t.location}
          </div>
          <div className="text-right">{t.localTime}</div>
          <div className="text-center">{t.status}</div>
          <div className="text-center">{t.calendar || 'Calendar'}</div>
        </div>
        
        <div className="divide-y divide-border-color">
          {zones.map((tz, index) => {
            const timeInZone = baseTime.setZone(tz);
            const hour = timeInZone.hour;
            const status = getStatusInfo(hour);
            
            return (
              <motion.div 
                key={tz} 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 p-6 items-center hover:bg-accent-color/[0.02] transition-colors group"
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
                  <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${status.color} shadow-sm`}>
                    {status.icon}
                    {status.label}
                  </div>
                </div>

                <div className="flex justify-center relative">
                  <button 
                    onClick={() => setActiveExport(activeExport === tz ? null : tz)}
                    className="p-2 rounded-xl bg-bg-secondary border border-border-color hover:border-accent-color text-text-secondary hover:text-accent-color transition-all shadow-sm"
                    title="Add to Calendar"
                  >
                    <Calendar className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {activeExport === tz && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        className="absolute top-full mt-3 right-0 bg-bg-secondary backdrop-blur-xl border-2 border-border-color rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] p-3 z-50 flex flex-col gap-1.5 min-w-[200px]"
                      >
                        <div className="text-[9px] font-black uppercase tracking-widest text-text-secondary mb-1 px-2 opacity-70">Export to</div>
                        <a 
                          href={generateCalendarLink('google', timeInZone, tz)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider hover:bg-accent-color/10 text-text-primary rounded-xl transition-colors flex items-center gap-3 border border-transparent hover:border-accent-color/20"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#4285F4]" />
                          Google Calendar
                        </a>
                        <a 
                          href={generateCalendarLink('outlook', timeInZone, tz)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider hover:bg-accent-color/10 text-text-primary rounded-xl transition-colors flex items-center gap-3 border border-transparent hover:border-accent-color/20"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#0078D4]" />
                          Outlook Web
                        </a>
                        <a 
                          href={generateCalendarLink('apple', timeInZone, tz)} 
                          download="meeting.ics"
                          className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider hover:bg-accent-color/10 text-text-primary rounded-xl transition-colors flex items-center gap-3 border border-transparent hover:border-accent-color/20"
                        >
                          <div className="w-2 h-2 rounded-full bg-slate-400" />
                          Apple / iCal (.ics)
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

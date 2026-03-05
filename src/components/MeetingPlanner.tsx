import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { DateTime } from 'luxon';
import { formatTime } from '../utils/timezone';
import { Calendar, Users } from 'lucide-react';

export default function MeetingPlanner() {
  const { favorites, use24HourFormat } = useAppStore();
  const [baseTime, setBaseTime] = useState(DateTime.local().setZone('Europe/Berlin').startOf('hour'));

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    setBaseTime(baseTime.set({ hour: hours, minute: minutes }));
  };

  const getTimeColor = (hour: number) => {
    if (hour >= 9 && hour <= 17) return 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
    if (hour >= 7 && hour < 9 || hour > 17 && hour <= 21) return 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30';
    return 'bg-rose-500/20 text-rose-700 dark:text-rose-400 border-rose-500/30';
  };

  const zones = ['Europe/Berlin', ...favorites.filter(f => f !== 'Europe/Berlin')];

  return (
    <div className="w-full max-w-4xl mx-auto mt-16 px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Users className="w-6 h-6 text-accent-color" />
          Global Meeting Finder
        </h2>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-text-secondary">Meeting Time (Berlin):</label>
          <input
            type="time"
            value={baseTime.toFormat('HH:mm')}
            onChange={handleTimeChange}
            className="px-3 py-1.5 rounded-lg bg-bg-secondary border border-border-color focus:border-accent-color outline-none text-sm font-mono"
          />
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto] gap-4 p-4 border-b border-border-color bg-bg-secondary/50 text-sm font-medium text-text-secondary">
          <div>Location</div>
          <div className="text-right">Local Time</div>
          <div className="w-24 text-center">Status</div>
        </div>
        
        <div className="divide-y divide-border-color">
          {zones.map((tz) => {
            const timeInZone = baseTime.setZone(tz);
            const hour = timeInZone.hour;
            const colorClass = getTimeColor(hour);
            
            return (
              <div key={tz} className="grid grid-cols-[1fr_auto_auto] gap-4 p-4 items-center hover:bg-bg-secondary/30 transition-colors">
                <div className="flex flex-col">
                  <span className="font-medium text-text-primary">
                    {tz.split('/').pop()?.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-text-secondary font-mono">
                    UTC{timeInZone.toFormat('ZZ')}
                  </span>
                </div>
                
                <div className="text-right flex flex-col">
                  <span className="text-xl font-light tracking-tight">
                    {formatTime(timeInZone, use24HourFormat)}
                  </span>
                  <span className="text-xs text-text-secondary">
                    {timeInZone.toFormat('ccc, d MMM')}
                  </span>
                </div>
                
                <div className={`w-24 py-1.5 rounded-full text-xs font-medium text-center border ${colorClass}`}>
                  {hour >= 9 && hour <= 17 ? 'Good' : hour >= 7 && hour <= 21 ? 'Okay' : 'Night'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

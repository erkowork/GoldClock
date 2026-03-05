import React from 'react';

export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="4" />
      <circle cx="50" cy="50" r="35" stroke="var(--accent-color)" strokeWidth="2" strokeDasharray="4 4" className="animate-[spin_20s_linear_infinite]" />
      <path d="M50 25 V50 L65 65" stroke="var(--accent-color)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="50" cy="50" r="4" fill="currentColor" />
    </svg>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import { useAppStore } from '../store/useAppStore';

export default function GoldenGlobe() {
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 });
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useAppStore(state => state.theme);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      // Auto-rotate
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      globeEl.current.controls().enableZoom = false;
    }
  }, []);

  const getGlobeColors = () => {
    switch(theme) {
      case 'dark': return { globe: '#1e293b', atmosphere: '#0f172a', bg: 'rgba(0,0,0,0)' };
      case 'light': return { globe: '#e2e8f0', atmosphere: '#f8fafc', bg: 'rgba(0,0,0,0)' };
      case 'gold-glass': return { globe: '#2a2a2a', atmosphere: '#d4af37', bg: 'rgba(0,0,0,0)' };
      case 'high-contrast': return { globe: '#000000', atmosphere: '#ffff00', bg: 'rgba(0,0,0,0)' };
      default: return { globe: '#1e293b', atmosphere: '#0f172a', bg: 'rgba(0,0,0,0)' };
    }
  };

  const colors = getGlobeColors();

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center relative">
      <Globe
        ref={globeEl}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundColor={colors.bg}
        atmosphereColor={colors.atmosphere}
        atmosphereAltitude={0.15}
        showAtmosphere={true}
        polygonsData={[]}
      />
      {/* Time Ring Overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[110%] h-[110%] rounded-full border-2 border-dashed border-gold-500/30 animate-[spin_60s_linear_infinite]" />
      </div>
    </div>
  );
}

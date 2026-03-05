import React, { useEffect, useRef, useState } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import { useAppStore } from '../store/useAppStore';

export default function GoldenGlobe() {
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ width: 500, height: 500 });
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
      globeEl.current.controls().autoRotateSpeed = 0.8;
      globeEl.current.controls().enableZoom = false;
      
      // Initial position
      globeEl.current.pointOfView({ lat: 20, lng: 10, altitude: 2.5 });
    }
  }, []);

  const getGlobeColors = () => {
    switch(theme) {
      case 'dark': return { globe: '#1e293b', atmosphere: '#38bdf8', bg: 'rgba(0,0,0,0)', arcs: '#38bdf8' };
      case 'gold-glass': return { globe: '#1a1a1a', atmosphere: '#d4af37', bg: 'rgba(0,0,0,0)', arcs: '#d4af37' };
      case 'midnight-neon': return { globe: '#000000', atmosphere: '#00ffcc', bg: 'rgba(0,0,0,0)', arcs: '#00ffcc' };
      case 'rose-quartz': return { globe: '#fff5f7', atmosphere: '#ff4081', bg: 'rgba(0,0,0,0)', arcs: '#ff4081' };
      case 'emerald-forest': return { globe: '#061a14', atmosphere: '#20c997', bg: 'rgba(0,0,0,0)', arcs: '#20c997' };
      case 'editorial-serif': return { globe: '#fdfcf0', atmosphere: '#1a1a1a', bg: 'rgba(0,0,0,0)', arcs: '#1a1a1a' };
      case 'high-contrast': return { globe: '#000000', atmosphere: '#ffff00', bg: 'rgba(0,0,0,0)', arcs: '#ffff00' };
      default: return { globe: '#f8fafc', atmosphere: '#d4af37', bg: 'rgba(0,0,0,0)', arcs: '#d4af37' };
    }
  };

  const colors = getGlobeColors();

  // Generate some random arcs for visual interest
  const arcsData = [...Array(10).keys()].map(() => ({
    startLat: (Math.random() - 0.5) * 180,
    startLng: (Math.random() - 0.5) * 360,
    endLat: (Math.random() - 0.5) * 180,
    endLng: (Math.random() - 0.5) * 360,
    color: colors.arcs
  }));

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center relative group">
      <Globe
        ref={globeEl}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl={theme === 'light' || theme === 'rose-quartz' || theme === 'editorial-serif' 
          ? "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          : "//unpkg.com/three-globe/example/img/earth-night.jpg"
        }
        backgroundColor={colors.bg}
        atmosphereColor={colors.atmosphere}
        atmosphereAltitude={0.25}
        showAtmosphere={true}
        arcsData={arcsData}
        arcColor="color"
        arcDashLength={0.4}
        arcDashGap={4}
        arcDashAnimateTime={2000}
        arcStroke={0.5}
      />
      
      {/* Decorative Rings */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[85%] h-[85%] rounded-full border border-accent-color/20 animate-[spin_30s_linear_infinite]" />
        <div className="absolute w-[95%] h-[95%] rounded-full border border-dashed border-accent-color/10 animate-[spin_60s_linear_infinite_reverse]" />
      </div>
    </div>
  );
}

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
      case 'theme-coffee': return { globe: '#222831', atmosphere: '#948979', bg: 'rgba(0,0,0,0)', arcs: '#948979' };
      case 'theme-matcha': return { globe: '#2C3930', atmosphere: '#A27B5C', bg: 'rgba(0,0,0,0)', arcs: '#A27B5C' };
      case 'theme-cosy': return { globe: '#F7F1DE', atmosphere: '#B87C4C', bg: 'rgba(0,0,0,0)', arcs: '#B87C4C' };
      case 'theme-sunset': return { globe: '#6A2C70', atmosphere: '#F08A5D', bg: 'rgba(0,0,0,0)', arcs: '#F08A5D' };
      case 'theme-beton': return { globe: '#393E46', atmosphere: '#948979', bg: 'rgba(0,0,0,0)', arcs: '#948979' };
      case 'theme-gold': return { globe: '#222222', atmosphere: '#FA8112', bg: 'rgba(0,0,0,0)', arcs: '#FA8112' };
      case 'theme-mint': return { globe: '#FFF8E8', atmosphere: '#F08B51', bg: 'rgba(0,0,0,0)', arcs: '#F08B51' };
      case 'theme-night': return { globe: '#0C0C0C', atmosphere: '#F2613F', bg: 'rgba(0,0,0,0)', arcs: '#F2613F' };
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
        globeImageUrl={theme === 'light' || theme === 'theme-cosy' || theme === 'theme-mint' 
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

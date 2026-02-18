import React, { useState, useEffect } from 'react';

interface Star {
  id: number;
  style: React.CSSProperties;
}

const generateStarStyle = (): React.CSSProperties => {
  const size = Math.random() * 2 + 1; // Star size between 1px and 3px
  const animationDuration = Math.random() * 2 + 3; // Twinkle duration between 3s and 5s
  const animationDelay = Math.random() * 2; // Stagger the twinkle
  return {
    position: 'absolute',
    top: `${Math.random() * 80}%`, // Position within the top 80% of the jar area
    left: `${Math.random() * 90 + 5}%`, // Position horizontally
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: 'white',
    borderRadius: '50%',
    boxShadow: '0 0 6px 2px rgba(255, 255, 224, 0.7)',
    opacity: 0,
    animation: `twinkle ${animationDuration}s infinite alternate ${animationDelay}s, fadeIn 1s ease-out forwards`,
  };
};


const MindfulJar: React.FC<{ starCount: number }> = ({ starCount }) => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    if (starCount > stars.length) {
      const newStars: Star[] = [];
      for (let i = 0; i < starCount - stars.length; i++) {
        newStars.push({ id: Date.now() + i, style: generateStarStyle() });
      }
      setStars(prevStars => [...prevStars, ...newStars]);
    }
  }, [starCount, stars.length]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
      <style>
        {`
          @keyframes twinkle {
            from { opacity: 0.3; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1.2); }
          }
          @keyframes fadeIn {
            to { opacity: 1; }
          }
        `}
      </style>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-64">
        {/* Simple Jar SVG */}
        <svg viewBox="0 0 100 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="jarGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: 'rgba(255,255,255,0.1)'}} />
                <stop offset="50%" style={{stopColor: 'rgba(255,255,255,0.3)'}} />
                <stop offset="100%" style={{stopColor: 'rgba(255,255,255,0.1)'}} />
                </linearGradient>
            </defs>
            <path d="M20,10 H80 V20 H20 Z" fill="rgba(255,255,255,0.2)" />
            <path d="M25,20 Q20,25 20,30 L20,110 Q20,115 25,115 H75 Q80,115 80,110 L80,30 Q80,25 75,20 Z" fill="url(#jarGradient)" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
        </svg>
        <div className="absolute inset-0 top-[10%] bottom-[5%]">
             {stars.map(star => <div key={star.id} style={star.style} />)}
        </div>
      </div>
    </div>
  );
};

export default MindfulJar;
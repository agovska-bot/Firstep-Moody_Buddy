
import React from 'react';

type AnimationType = 'running-man' | 'mood-bubbles' | 'story-bubbles' | 'rising-stars' | 'floating-cloud' | 'writing-pencil' | 'fireworks' | 'pulse-glow' | 'none';

interface AnimatedTaskCardProps {
  title: string;
  description?: string;
  icon: string;
  color: string;
  animationType: AnimationType;
  animationColor?: string;
  isGrid?: boolean;
  onClick: () => void;
  variant?: 'playful' | 'modern' | 'serious';
}

const RunningMan = () => (
    <svg viewBox="0 0 100 100" className="running-man-svg">
        <circle cx="50" cy="20" r="10" fill="currentColor" />
        <line x1="50" y1="30" x2="50" y2="60" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
        <line className="runner-arm1" x1="50" y1="40" x2="70" y2="30" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        <line className="runner-arm2" x1="50" y1="40" x2="30" y2="50" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        <line className="runner-leg1" x1="50" y1="60" x2="70" y2="80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
        <line className="runner-leg2" x1="50" y1="60" x2="30" y2="80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    </svg>
);

const FloatingCloud = () => (
    <>
      <div className="cloud cloud-1">
        <div className="puff puff-1"></div>
        <div className="puff puff-2"></div>
        <div className="puff puff-3"></div>
        <div className="puff puff-4"></div>
      </div>
       <div className="cloud cloud-2">
        <div className="puff puff-1"></div>
        <div className="puff puff-2"></div>
        <div className="puff puff-3"></div>
        <div className="puff puff-4"></div>
      </div>
    </>
);

const RisingStars = () => (
    <>
      <div className="star star-1">★</div>
      <div className="star star-2">★</div>
      <div className="star star-3">★</div>
      <div className="star star-4">★</div>
    </>
);

const MoodBubbles = () => (
    <>
      <div className="mood-bubble bubble-1">😊</div>
      <div className="mood-bubble bubble-2">😢</div>
      <div className="mood-bubble bubble-3">😠</div>
      <div className="mood-bubble bubble-4">😟</div>
    </>
);

const StoryBubbles = () => (
    <>
      <div className="story-bubble sbubble-1"></div>
      <div className="story-bubble sbubble-2"></div>
      <div className="story-bubble sbubble-3"></div>
      <div className="story-bubble sbubble-4"></div>
      <div className="story-bubble sbubble-5"></div>
    </>
);

const WritingPencil = () => (
    <svg viewBox="0 0 140 50" className="writing-svg">
        <defs>
            <path id="writing-text-path" d="M 5,25 H 135" />
        </defs>
        <text className="drawn-text">
            <textPath href="#writing-text-path" startOffset="0%">
                Memories
            </textPath>
        </text>
        <g className="pencil-icon">
            <g transform="rotate(20) translate(0, -10) scale(0.8)">
                <polygon points="0,5 50,5 50,-5 0,-5" fill="#FDD835" />
                <rect x="50" y="-6" width="5" height="12" fill="#BDBDBD" />
                <rect x="55" y="-5" width="8" height="10" rx="2" fill="#F48FB1" />
                <polygon points="0,5 -10,0 0,-5" fill="#FBE9A7" />
                <polygon points="-10,0 -8,1 -8,-1" fill="#424242" />
            </g>
        </g>
    </svg>
);

const Fireworks = () => (
    <>
      <div className="firework fw-1"></div>
      <div className="firework fw-2"></div>
      <div className="firework fw-3"></div>
    </>
);

const PulseGlow = () => (
    <div className="absolute inset-0 bg-white/10 animate-pulse-slow"></div>
);

const Animation = ({ type }: { type: AnimationType }) => {
    switch (type) {
        case 'running-man': return <RunningMan />;
        case 'floating-cloud': return <FloatingCloud />;
        case 'rising-stars': return <RisingStars />;
        case 'mood-bubbles': return <MoodBubbles />;
        case 'story-bubbles': return <StoryBubbles />;
        case 'writing-pencil': return <WritingPencil />;
        case 'fireworks': return <Fireworks />;
        case 'pulse-glow': return <PulseGlow />;
        default: return null;
    }
}

const AnimatedTaskCard: React.FC<AnimatedTaskCardProps> = ({ title, icon, description, color, animationType, animationColor, isGrid, onClick, variant = 'playful' }) => {
  
  const getVariantStyles = () => {
    if (variant === 'serious') {
      return "border border-white/20 shadow-xl bg-opacity-95";
    }
    if (variant === 'modern') {
      return "border border-white/40 shadow-lg";
    }
    return "shadow-[0_4px_12px_rgba(0,0,0,0.05)]";
  };

  return (
    <button
      onClick={onClick}
      className={`relative w-full p-4 rounded-2xl flex ${isGrid ? 'flex-col items-center text-center space-y-2' : 'flex-row items-center space-x-4'} hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:scale-[1.02] transition-all duration-300 min-h-[85px] overflow-hidden ${color} ${getVariantStyles()}`}
    >
        {animationType !== 'none' && (
            <div className={`absolute inset-0 opacity-40 ${animationColor || ''}`}>
                <Animation type={animationType} />
            </div>
        )}
      
      <span className={`text-3xl z-10 flex-shrink-0 drop-shadow-sm ${variant === 'serious' ? 'grayscale-[0.5] contrast-[1.2]' : ''}`}>{icon}</span>
      <div className="z-10 text-left flex flex-col justify-center min-w-0 flex-grow w-full">
        <p className={`text-xl font-black leading-tight break-words overflow-wrap-anywhere ${isGrid ? 'text-center' : ''} ${variant === 'serious' ? 'tracking-tight' : ''}`}>{title}</p>
        {description && !isGrid && <p className="text-sm opacity-90 mt-1 leading-snug break-words font-bold">{description}</p>}
      </div>
      <style>{`
        .overflow-wrap-anywhere {
            overflow-wrap: anywhere;
            word-break: normal;
        }
        @keyframes pulse-slow {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.3; }
        }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        
        .running-man-svg { position: absolute; bottom: 0px; left: -100px; width: 60px; height: 60px; animation: run-across 2s linear infinite; }
        @keyframes run-across { 0% { transform: translateX(0px); } 100% { transform: translateX(550px); } }
        .runner-arm1 { animation: runner-arm-swing1 0.4s linear infinite alternate; transform-origin: 50px 40px; }
        .runner-arm2 { animation: runner-arm-swing2 0.4s linear infinite alternate; transform-origin: 50px 40px; }
        .runner-leg1 { animation: runner-leg-swing1 0.4s linear infinite alternate; transform-origin: 50px 60px; }
        .runner-leg2 { animation: runner-leg-swing2 0.4s linear infinite alternate; transform-origin: 50px 60px; }
        @keyframes runner-arm-swing1 { from { transform: rotate(-45deg); } to { transform: rotate(45deg); } }
        @keyframes runner-arm-swing2 { from { transform: rotate(45deg); } to { transform: rotate(-45deg); } }
        @keyframes runner-leg-swing1 { from { transform: rotate(35deg); } to { transform: rotate(-45deg); } }
        @keyframes runner-leg-swing2 { from { transform: rotate(-45deg); } to { transform: rotate(35deg); } }
        
        .cloud { position: absolute; left: -120px; width: 60px; height: 40px; }
        .cloud-1 { top: 5px; animation: float 25s linear infinite; }
        .cloud-2 { top: 30px; transform: scale(0.6); animation: float 35s linear infinite; animation-delay: -5s; }
        .puff { position: absolute; background: currentColor; border-radius: 50%; }
        .puff-1 { width: 30px; height: 30px; top: 10px; left: 15px; }
        .puff-2 { width: 20px; height: 20px; top: 0; left: 5px; }
        .puff-3 { width: 20px; height: 20px; top: 0; right: 5px; }
        .puff-4 { width: 15px; height: 15px; top: 12px; right: 0; }
        @keyframes float { from { transform: translateX(0); } to { transform: translateX(550px); } }
        
        .star { position: absolute; bottom: -20px; font-size: 16px; color: white; animation: rise 5s linear infinite; text-shadow: 0 0 6px rgba(255, 215, 0, 0.8); }
        .star-1 { left: 20%; animation-delay: 0s; }
        .star-2 { left: 45%; animation-delay: 1s; transform: scale(0.8); }
        .star-3 { left: 70%; animation-delay: 2.5s; }
        .star-4 { left: 90%; animation-delay: 4s; transform: scale(1.2); }
        @keyframes rise { to { transform: translateY(-120px); opacity: 0; } }
        
        .mood-bubble { position: absolute; bottom: -30px; font-size: 1.2rem; animation: float-up 8s linear infinite; }
        .mood-bubble.bubble-1 { left: 10%; animation-delay: 0s; }
        .mood-bubble.bubble-2 { left: 35%; animation-delay: 2s; }
        .mood-bubble.bubble-3 { left: 60%; animation-delay: 4s; }
        .mood-bubble.bubble-4 { left: 85%; animation-delay: 6s; }
        @keyframes float-up { to { transform: translateY(-150px); opacity: 0; } }
        
        .story-bubble { position: absolute; bottom: -50px; border-radius: 50%; border: 1.5px solid currentColor; animation: float-up-bubbles 10s linear infinite; }
        .story-bubble::after { content: ''; position: absolute; top: 15%; left: 15%; width: 25%; height: 25%; border-radius: 50%; background: white; opacity: 0.5; }
        .story-bubble.sbubble-1 { left: 10%; width: 30px; height: 30px; animation-delay: 0s; }
        .story-bubble.sbubble-3 { left: 60%; width: 40px; height: 40px; animation-delay: 4s; }
        .story-bubble.sbubble-4 { left: 85%; width: 25px; height: 25px; animation-delay: 6s; }
        @keyframes float-up-bubbles { to { transform: translateY(-180px); opacity: 0; } }
        
        .writing-svg { position: absolute; width: 120px; height: 40px; right: -20px; top: 50%; transform: translateY(-50%); }
        .drawn-text { font-family: 'Dancing Script', cursive; font-size: 24px; font-weight: 700; fill: transparent; stroke: currentColor; stroke-width: 2px; stroke-dasharray: 220; stroke-dashoffset: 220; animation: draw-text 4s ease-in-out infinite; }
        .pencil-icon { offset-path: url(#writing-text-path); animation: move-pencil 4s ease-in-out infinite; }
        @keyframes draw-text { 
            0% { stroke-dashoffset: 220; fill: transparent; opacity: 0; } 
            10% { stroke-dashoffset: 220; fill: transparent; opacity: 1; }
            70% { stroke-dashoffset: 0; fill: transparent; opacity: 1; } 
            80% { stroke-dashoffset: 0; fill: currentColor; opacity: 1; } 
            90% { opacity: 0; } 
            100% { opacity: 0; } 
        }
        @keyframes move-pencil { 0% { offset-distance: 0%; opacity: 0; } 10% { offset-distance: 0%; opacity: 1; } 70% { offset-distance: 100%; opacity: 1; } 71% { offset-distance: 100%; opacity: 1; } 90% { offset-distance: 100%; opacity: 0; } 100% { offset-distance: 100%; opacity: 0; } }
        
        .firework { position: absolute; width: 4px; height: 4px; background: transparent; border-radius: 50%; opacity: 1; transform: scale(0); box-shadow: 0 0 0 0 currentColor, 0 0 0 0 currentColor, 0 0 0 0 currentColor, 0 0 0 0 currentColor; animation: firework-explode 1.5s ease-out infinite; }
        .fw-1 { top: 20%; left: 20%; animation-delay: 0s; }
        .fw-2 { top: 40%; left: 80%; animation-delay: 0.5s; }
        .fw-3 { top: 70%; left: 50%; animation-delay: 1s; }
        @keyframes firework-explode { 0% { transform: scale(0.5); opacity: 1; } 80% { opacity: 1; } 100% { transform: scale(1); opacity: 0; box-shadow: -40px 0 0 0 currentColor, 40px 0 0 0 currentColor, 0 -40px 0 0 currentColor, 0 40px 0 0 currentColor; } }
      `}</style>
    </button>
  );
};

export default AnimatedTaskCard;

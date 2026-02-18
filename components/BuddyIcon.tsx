
import React, { useState } from 'react';

const BuddyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  const [isJiggling, setIsJiggling] = useState(false);

  const handleInteraction = () => {
    if (isJiggling) return;
    setIsJiggling(true);
    setTimeout(() => {
      setIsJiggling(false);
    }, 500); // Duration of the jiggle animation
  };

  const { onClick, onKeyDown, className, ...rest } = props;

  const mergedClassName = `${className || ''} cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-300 rounded-full`;

  return (
    <svg
      viewBox="0 -5 85 75"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Say hi to Buddy"
      role="button"
      tabIndex={0}
      onClick={(e) => {
        handleInteraction();
        if (onClick) onClick(e);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleInteraction();
        if (onKeyDown) onKeyDown(e);
      }}
      className={mergedClassName}
      {...rest}
    >
      <style>
        {`
          @keyframes blink {
            0%, 90%, 100% { transform: scaleY(1); }
            95% { transform: scaleY(0.1); }
          }
          @keyframes jiggle {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(8deg); }
            50% { transform: rotate(-8deg); }
            75% { transform: rotate(8deg); }
          }
          .buddy-body {
            transform-origin: center 80%;
          }
          .buddy-eye {
            animation: blink 5s infinite ease-in-out;
            transform-origin: center center;
          }
          .jiggle {
            animation: jiggle 0.5s ease-in-out;
            transform-origin: 50% 90%;
          }
        `}
      </style>
      <g className={isJiggling ? 'jiggle' : ''}>
        <g transform="translate(2, 2)" className="buddy-body">
            {/* Mascot Body - Thinner stroke (3.0) */}
            <path d="M45.7,21.9c0-12.1-9.8-21.9-21.9-21.9S2,9.8,2,21.9c0,9.1,5.6,16.9,13.6,20.2l-0.7,5.7c-0.1,0.8,0.5,1.5,1.3,1.5c0.1,0,0.2,0,0.3-0.1l7.3-5.2c1.3,0.2,2.6,0.2,4,0.2C35.9,43.8,45.7,34,45.7,21.9z" fill="#50C878" stroke="#004D40" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <circle className="buddy-eye" cx="15.8" cy="20.5" r="2.8" fill="#004D40"/>
            <circle className="buddy-eye" cx="32.8" cy="20.5" r="2.8" fill="#004D40"/>
            <path d="M18.8,29.5c0,0,3,4,8,0" fill="none" stroke="#004D40" strokeWidth="3" strokeLinecap="round"/>
        </g>

        {/* Thick Plus Icon - Enlarged to 0.82 */}
        <g transform="translate(42, 26) scale(0.82)">
          <path
            d="M15,2v26 M2,15h26"
            fill="none"
            stroke="#004D40"
            strokeWidth="17"
            strokeLinecap="round"
          />
          <path
            d="M15,2v26 M2,15h26"
            fill="none"
            stroke="#FFCB05"
            strokeWidth="11"
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  );
};

export default BuddyIcon;

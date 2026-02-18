
import React from 'react';

interface TaskCardProps {
  title: string;
  description?: string;
  icon: string;
  color: string;
  isGrid?: boolean;
  onClick: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ title, icon, description, color, isGrid, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-2xl flex ${isGrid ? 'flex-col items-center text-center space-y-2' : 'flex-row items-center space-x-4'} shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:scale-[1.02] transition-all duration-300 min-h-[85px] ${color}`}
    >
      <span className="text-3xl flex-shrink-0 drop-shadow-sm">{icon}</span>
      <div className="text-left flex flex-col justify-center min-w-0 flex-grow w-full">
        <p className={`text-xl font-black leading-tight break-words overflow-wrap-anywhere ${isGrid ? 'text-center' : ''}`}>{title}</p>
        {description && !isGrid && <p className="text-sm opacity-90 mt-1 leading-snug break-words font-bold">{description}</p>}
      </div>
      <style>{`
        .overflow-wrap-anywhere {
            overflow-wrap: anywhere;
            word-break: normal;
        }
      `}</style>
    </button>
  );
};

export default TaskCard;

import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
}

const Toast: React.FC<ToastProps> = ({ message }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 2800); // Slightly less than the AppContext timer to allow for fade out
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message) return null;

  return (
    <div
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {message}
    </div>
  );
};

export default Toast;
import React from 'react';

export const Flecha = ({onClick}) => {
  return (
    <button
      onClick={onClick}
      className="relative rotate-180 w-12 h-12 bg-blue-500 hover:bg-blue-700 text-white font-bold flex items-center justify-center"
      style={{ clipPath: 'polygon(100% 50%, 0% 0%, 0% 100%)' }}
    >

    </button>
  );
};

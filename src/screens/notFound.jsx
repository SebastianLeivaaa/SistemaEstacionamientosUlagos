import React from 'react';

export const NotFound = () => {
  return (
    <div className='w-screen h-screen m-auto flex flex-col items-center justify-center dark:bg-midnight-950 gap-y-4'>
      <h2 className='text-5xl text-black dark:text-white-50 text-center max-xs:text-2xl'>404 - Página no encontrada</h2>
      <p className='text-xl text-black dark:text-white-50 text-center  max-xs:text-lg'>Lo sentimos, la página que estás buscando no existe.</p>
    </div>
  );
};
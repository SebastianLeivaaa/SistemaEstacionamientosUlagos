import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';

export const QrReader = ({onScan}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const qrScanner = new QrScanner(videoRef.current, result => {
      onScan(result);
    });

    qrScanner.start();

    return () => {
      qrScanner.stop();
    };
  }, [onScan]);

  return (
    <div className='w-full h-full'>
      <video ref={videoRef} className='w-full h-full'></video>
    </div>
  );
};

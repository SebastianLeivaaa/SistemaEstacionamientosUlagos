import React, { useEffect, useRef } from 'react';
import QrScanner from 'qr-scanner';

export const QrReader = ({ onScan, timeoutInSeconds }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const qrScanner = new QrScanner(videoRef.current, result => {
      onScan(result);
    }, { highlightScanRegion: true});

    qrScanner.start();

    const timeoutId = setTimeout(() => {
      qrScanner.stop();
    }, timeoutInSeconds * 1000);

    return () => {
      clearTimeout(timeoutId);
      qrScanner.stop();
    };
  }, [onScan, timeoutInSeconds]);

  return (
    <div className='w-[300px] h-[300px]'>
      <video ref={videoRef} className='w-full h-full min-w-full min-h-full'></video>
    </div>
  );
};

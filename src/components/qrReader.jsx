import React, { useEffect, useRef } from 'react';
import QrScanner from 'qr-scanner';

export const QrReader = ({ onScan, timeoutInSeconds, highlightScanRegion }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const qrScanner = new QrScanner(videoRef.current, result => {
      onScan(result);
    }, { highlightScanRegion });

    qrScanner.start();

    const timeoutId = setTimeout(() => {
      qrScanner.stop();
    }, timeoutInSeconds * 1000);

    return () => {
      clearTimeout(timeoutId);
      qrScanner.stop();
    };
  }, [onScan, timeoutInSeconds, highlightScanRegion]);

  return (
    <div className='w-full h-full'>
      <video ref={videoRef} className='w-full h-full'></video>
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';

export const QrReader = () => {
  const videoRef = useRef(null);
  const [qrResult, setQrResult] = useState(null);

  useEffect(() => {
    const qrScanner = new QrScanner(videoRef.current, result => {
      // Manejar el resultado del escaneo aquí
      console.log('Código QR detectado:', result);
      setQrResult(result); // Guardar el resultado del escaneo en el estado local
    });

    qrScanner.start();

    return () => {
      qrScanner.stop();
    };
  }, []);

  return (
    <div>
      <video ref={videoRef}></video>
      <h2>Resultado del escaneo:</h2>
      {qrResult && (
        <div>
          <h2>Resultado del escaneo:</h2>
          <p>Soy el resultado del qr:{qrResult}</p>
        </div>
      )}
    </div>
  );
};

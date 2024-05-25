import React from 'react';
import QRCode from 'qrcode.react';

export const UserQR = (props) => {
    return (
      <div style={{ textAlign: 'center', margin: '20px' }}>
        <QRCode value={props.rut} />
      </div>
    );
  };
import React from 'react';
import QRCode from 'qrcode.react';

export const UserQR = (props) => {
    return (
      <div className='text-center rounded-md'>
        <QRCode value={props.rut} size={props.size} />
      </div>
    );
  };
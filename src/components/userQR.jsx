import React from 'react';
import QRCode from 'qrcode.react';

export const UserQR = (props) => {
    return (
      <div className='bg-white-50 p-4 rounded-md '>
        <QRCode value={props.rut} size={props.size} />
      </div>
    );
  };
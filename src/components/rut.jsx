import React, { useState, useEffect } from "react";

export const Rut = (props) => {


  return (
    <input
        id={props.id}
        name={props.name}
        type={props.tipo}
        className="w-[90%] p-1 border-[0.5px] border-blue-ribbon-600"
        placeholder={props.holder}
        onChange={props.onChange}
        maxLength={props.maxLength}
        value={props.value}
    />
  );
};

export default Rut;

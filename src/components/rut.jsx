import React, { useState, useEffect } from "react";

export const Rut = (props) => {


  return (
    <input
        id={props.id}
        name={props.name}
        type={props.tipo}
        className="p-1 bg-gray-100 dark:bg-gray-700 text-black dark:text-white-50 border-[0.5px] border-midnight-700"
        placeholder={props.holder}
        onChange={props.onChange}
        maxLength={props.maxLength}
        value={props.value}
    />
  );
};

export default Rut;

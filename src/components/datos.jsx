import React from "react";

export const Datos = (props) => {
  const handleChange = (event) => {
    if (props.tipo === "number") {
      const inputValue = event.target.value;
      const maxLength = props.maxLength;
      if (inputValue.length > maxLength) {
        event.target.value = inputValue.slice(0, maxLength);
      }
    }
    props.onChange(event);
  };

  return (
    <input
      type={props.tipo}
      id={props.id}
      onChange={handleChange}
      value={props.value}
      maxLength={props.maxLength}
      name={props.name}
      className="hidden-number-input w-full p-1 bg-gray-100 dark:bg-gray-700 text-black dark:text-white-50 border-[0.5px] border-midnight-700"
      placeholder={props.holder}
    />
  );
};

export default Datos;

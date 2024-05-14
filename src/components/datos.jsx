import React from "react";

export const Datos = (props) => {
  const handleChange = (event) => {
    if (props.tipo === "number") {
      const inputValue = event.target.value;
      const maxLength = props.maxLength;
      if (inputValue.length > maxLength) {
        event.target.value = inputValue.slice(0, maxLength); // Limita la entrada al maxLength
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
      className="w-[90%] p-1 border-[0.5px] border-blue-ribbon-600"
      placeholder={props.holder}
    />
  );
};

export default Datos;

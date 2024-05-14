import React, { useState, useEffect } from "react";
import { validateFormatPhone } from "../utils/validateFormatPhone";

export const Phone = (props) => {
  const [error, setError] = useState(false);
  useEffect(() => {
    setError(!validateFormatPhone(props.value) && props.value !== "");
  }, [props.value]);
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
        id={props.id}
        name={props.name}
        type={props.tipo}
        className="w-[90%] p-1 border-[0.5px] border-blue-ribbon-600"
        placeholder={props.holder}
        onChange={handleChange}
        maxLength={props.maxLength}
        value={props.value}
    />
  );
};

export default Phone;
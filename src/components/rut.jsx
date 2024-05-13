import React, { useState } from "react";

export const Rut = (props) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const handleChange = (event) => {
    const inputValue = event.target.value;
    setValue(inputValue);

    const rutRegex = /^\d{7,8}-[0-9kK]$/;
    setError(!rutRegex.test(inputValue));
  };

  return (
    <div className="w-full flex flex-col ml-4">
      <h1 className="pb-3">{props.titulo}</h1>
      {error && <p className="text-red-500">Formato de RUT inválido</p>}
      <input
        type={props.tipo}
        className={`w-[90%] p-1 border-[0.5px] border-blue-ribbon-600 ${
          error && "border-red-500"
        }`}
        placeholder={props.holder}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export default Rut;

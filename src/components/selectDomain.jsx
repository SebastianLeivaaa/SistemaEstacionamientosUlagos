import React from "react"; 

export const SelectDomain = (props) => {
  const domain = props.userType === 'Estudiante' 
    ? '@alumnos.ulagos.cl' 
    : props.userType === 'Profesor' 
      ? '@ulagos.cl' 
      : '';
  return (
    <>
      {domain === '' ? (
        <input 
          className="w-full p-1 bg-gray-100 dark:bg-gray-700 text-black dark:text-white-50 border-[0.5px] border-midnight-700 text-clip overflow-hidden"
          placeholder="Dominio"
          type="text"
          name="userDomain"
          maxLength={60}
          onChange={props.handleChange}
          value={props.value}
        >
        </input>
      ) : (
        <label className="w-full p-1 bg-gray-100 dark:bg-gray-700 text-black dark:text-white-50 border-[0.5px] border-midnight-700 text-clip overflow-hidden">
          {domain}
        </label>
      )}
    </>
  );
}

export default SelectDomain;

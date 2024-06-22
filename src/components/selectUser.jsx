import React from "react"; 


export const SelectUser = (props) => {
  return(
    <select id={props.id} name={props.name} className="p-1 bg-gray-100 dark:bg-gray-700 text-black dark:text-white-50 border-[0.5px] border-midnight-700" placeholder={props.holder} onChange={props.onChange} value={props.value}>
      <option>Estudiante</option>
      <option>Profesor</option>
      <option>Externo</option>
    </select>
  );
}

export default SelectUser;

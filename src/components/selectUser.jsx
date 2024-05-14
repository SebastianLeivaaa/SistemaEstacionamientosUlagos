import React from "react"; 


export const SelectUser = (props) => {
  return(
    <select id={props.id} name={props.name} className="w-[90%] p-1 border-[0.5px] border-blue-ribbon-600" placeholder={props.holder} onChange={props.onChange} value={props.value}>
      <option>Estudiante</option>
      <option>Funcionario</option>
      <option>Externo</option>
    </select>
  );
}

export default SelectUser;

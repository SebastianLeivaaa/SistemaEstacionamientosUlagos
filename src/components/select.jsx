import React from "react"; 


export const Select = (props) => {
  return(
    <div className="w-full flex flex-col ml-4" >
      <h1 className="pb-3">{props.titulo}</h1>
      <select className="w-[90%] p-1 border-[0.5px] border-blue-ribbon-600 max-md:w-[55%] ">
        <option>Estuduiante</option>
        <option>Funcionario</option>
        <option>Externo</option>
      </select>
      
    </div>
  );
  
}

export default Select
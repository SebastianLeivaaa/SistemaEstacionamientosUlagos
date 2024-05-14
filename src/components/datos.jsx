import React from "react"; 


export const Datos = (props) => {
  return(
    <input type={props.tipo} id={props.id} onChange={props.onChange} value={props.value} maxLength={props.maxLength} name={props.name} className="w-[90%] p-1 border-[0.5px] border-blue-ribbon-600" placeholder={props.holder}/>
  );
  
}

export default Datos
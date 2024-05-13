import React from "react"; 


export const Datos = (props) => {
  return(
    <div className="w-full flex flex-col ml-4" >
      <h1 className="pb-3">{props.titulo}</h1>
      <input type="text" className="w-[90%] p-1 border-[0.5px] border-blue-ribbon-600 max-md:w-[55%] " placeholder={props.holder}/>
    </div>
  );
  
}

export default Datos
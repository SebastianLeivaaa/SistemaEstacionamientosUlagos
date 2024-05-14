import React from "react"; 


export const SelectDomain = (props) => {
    const domain = props.userType === 'Estudiante' ? '@alumnos.ulagos.cl' : '@ulagos.cl'
  return(
    <label className="p-1 border-[0.5px] border-blue-ribbon-600 ">
        {domain}
    </label>
  );
  
}

export default SelectDomain;
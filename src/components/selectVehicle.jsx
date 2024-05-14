import React from "react"; 


export const SelectVehicle = (props) => {
  return(
    <select className="w-[90%] p-1 border-[0.5px] border-blue-ribbon-600 ">
      <option>Automovil</option>
      <option>Camioneta</option>
      <option>Furgón</option>
      <option>Jeep</option>
      <option>Motocicleta</option>
    </select>
  );
  
}

export default SelectVehicle;
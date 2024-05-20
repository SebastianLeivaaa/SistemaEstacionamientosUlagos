import React from "react";

export const SelectVehicle = (props) => {
  return(
    <select 
      className="w-[90%] p-1 border-[0.5px] border-blue-ribbon-600" 
      name={props.name}
      onChange={props.onChange}
      value={props.value}
      disabled={props.disabled}
    >
      <option value="Automovil">Automovil</option>
      <option value="Camioneta">Camioneta</option>
      <option value="Furgón">Furgón</option>
      <option value="Jeep">Jeep</option>
      <option value="Motocicleta">Motocicleta</option>
    </select>
  );
}

export default SelectVehicle;

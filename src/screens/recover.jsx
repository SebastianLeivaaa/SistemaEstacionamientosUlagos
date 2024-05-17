import React from "react";
import Ulogo from "../assets/img/Ulogo.png";
import { useNavigate } from 'react-router-dom';

export const Recover = () =>{
  const navigate = useNavigate();
  const handleBack = () => {
    navigate('/');
};
  return(
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="bg-white-50 flex flex-col items-center p-12 gap-y-8 rounded-md max-md:w-[75%] max-md:px-4 max-md:py-8 max-h-[90%] overflow-y-scroll shadow-white-900 shadow-3xl">

        <img src={Ulogo} alt="Logo Ulagos"/>
        <h1 className="text-2xl font-bold text-center max-md:text-base">Recuperar contraseña</h1>
        <h1 className="text-2xl font-semibold text-center max-md:text-base">Ingrese su correo electrónico</h1>

        <input name="email" type="email" className="w-[90%] p-2 border-[0.5px] border-blue-ribbon-600 max-md:w-[85%] " placeholder="Correo Electrónico"/>
        <button type="submit" className="mt-2 w-full bg-blue-ribbon-600 font-bold text-white-50 px-2 py-2 rounded-md text-lg hover:bg-blue-ribbon-700 flex flex-row items-center justify-center gap-x-2 max-md:text-base">Enviar código</button>
        <button onClick={handleBack} className="font-bold text-blue-ribbon-600 underline">Volver al login</button>
      </div>
    </div>
  );
}
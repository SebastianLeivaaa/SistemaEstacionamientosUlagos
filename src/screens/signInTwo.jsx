import React from "react";
import { useNavigate } from 'react-router-dom';
import Ulogo from "../assets/img/Ulogo.png";


export const SignInTwo = (props) => {
    const navigate = useNavigate();

    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <div className="bg-white-50 flex flex-col items-center p-12 gap-y-8 rounded-md max-md:w-[75%] max-md:px-4 max-md:py-8 max-h-[90%] overflow-y-scroll shadow-white-900 shadow-3xl">
                <img src={Ulogo} alt="Logo Ulagos"/>
                <h1 className="text-2xl font-bold text-center max-md:text-base">ESTACIONAMIENTOS ULAGOS</h1>
                <div className="flex flex-row justify-around w-full">
                    <button onClick={() => {navigate('/')}} className="bg-white-50 text-black px-4 py-2 rounded-md text-lg hover:bg-blue-ribbon-600 hover:text-white-50 max-md:text-base max-md:px-2" enabled>Iniciar Sesión</button>
                    <button className="bg-blue-ribbon-600 text-white-50 px-4 py-2 rounded-md text-lg hover:bg-blue-ribbon-600 hover:text-white-50 max-md:text-base" disabled>Registrarse</button>
                </div>
                
            </div>
        </div>
    );
}


import React from "react"; 
import Datos from "../components/datos"
import { Indice } from "../components/indice";

export const SignIn = () => {
    return (
        <div className="w-[110%]">
            <Indice/>

            <h1 className="font-bold">DATOS PERSONALES</h1>
            <div className="w-[100%] flex flex-row justify-between p-2">
                <Datos
                titulo="Nombre"
                holder="Ingrese su nombre"/>
                <Datos
                titulo="Apellido Paterno"
                holder="Ingresa tu apellido paterno"/>
            </div>
            <div className="w-[100%] flex flex-row justify-between p-2">
                <Datos
                titulo="Nombre"
                holder="Ingrese su nombre"/>
                <Datos
                titulo="Apellido Paterno"
                holder="Ingresa tu apellido paterno"/>
            </div>
        </div>
    );
}
import React from "react"; 
import Datos from "../components/datos"
import { Indice } from "../components/indice";
import Select from "../components/select"

export const SignIn = () => {
    //✓
    return (
        <div className="">
            <Indice
            fase="1"
            />
            <h1 className="font-bold p-4">DATOS PERSONALES</h1>
            <div className="w-[100%] flex flex-row justify-between p-2">
                <Datos
                titulo="Nombre(s)"
                holder="Ingrese su nombre"
                tipo="text"/>
                
                <Datos
                titulo="Apellido Paterno"
                holder="Ingresa tu apellido paterno"
                tipo="text"/>
            </div>
            <div className="w-[100%] flex flex-row justify-between p-2">
                <Datos
                titulo="Apellido Materno"
                holder="Ingresa tu apellido materno"
                tipo="text"/>
                <Datos
                titulo="RUT"
                holder="Ej:20545267-1"
                tipo="text"/>
            </div>
            <div className="w-[100%] flex flex-row justify-between p-2">
                <Select
                titulo="Tipo usuario"
                holder="Estudiante"
                tipo="select"/>
                <Datos
                titulo="Correo electronico"
                holder="correo@dominio.cl"
                tipo="text"/>
            </div>
            <div className="w-[51%] flex flex-row justify-between p-2">
                <Datos
                titulo="Télefono"
                holder="Ej:958472045"
                tipo="number"/>
            </div>
        </div>
    );
}
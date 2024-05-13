import React from "react"; 
import Datos from "../components/datos"
import { Indice } from "../components/indice";
import Select from "../components/select"
import { SlArrowRight } from "react-icons/sl";

export const SignIn = () => {
    //✓
    return (
        <div>
            <Indice
            fase="1"
            />
            <form>
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
                <h1 className="font-bold p-4">DATOS VEHÍCULO</h1>
                <div className="w-[100%] flex flex-row justify-between p-2">
                    <Datos
                    titulo="Patente"
                    holder="Ej: GGXX20"
                    tipo="text"/>
                    <Datos
                    titulo="Marca"
                    holder="Chevrolet"
                    tipo="text"/>
                </div>
                <div className="w-[100%] flex flex-row justify-between p-2">
                    <Datos
                    titulo="Modelo"
                    holder="Ej: Sail"
                    tipo="text"/>
                    <Datos
                    titulo="Año"
                    holder="Ej: 2014"
                    tipo="Number"/>
                </div>
            </form>
            <div className="w-[100%] flex flex-row justify-between items-center p-2">
                <div></div>
                <button className="mr-8 px-10 mt-5 rounded-md py-2 bg-blue-ribbon-600 text-white font-bold text-lg"><SlArrowRight className="text-3xl max-md:text-2xl" />CREE SU CONTRASEÑA</button>
            </div>
        </div>
    );
}
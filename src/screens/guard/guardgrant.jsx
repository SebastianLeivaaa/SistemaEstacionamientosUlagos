import {React, useState} from 'react';
import { MdDirectionsCar } from 'react-icons/md';
import Ulogo from "../../assets/img/Ulogo.png"; 
import { Datos } from '../../components/datos';
import { Rut } from '../../components/rut';
import { FaCheck, FaUser, FaArrowLeft} from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



export const GuardGrant = () => {

    return (
        <div className="flex justify-center">
            {/* Otorgar Estacionamiento */}
            <div className="w-full ">
                <h2 className="text-2xl font-bold mb-4 text-center md:mx-24">OTORGAR ESTACIONAMIENTO</h2>
                <div className="gap-x-2 px-4 py-2 mb-6 bg-blue-ribbon-600 text-white-50 text-center flex flex-row items-center justify-center">
                    <div className='w-6 h-6 bg-indice-50 rounded-full flex items-center justify-center' >
                        <FaCheck className='text-congress-blue-950'/>
                    </div>
                    Completar datos
                </div>
                <div className='px-4'>
                    <h1 className="block text-xl mb-2 font-bold">DATOS CONDUCTOR</h1>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-1">Nombre</label>
                        <Datos
                            holder="Ej: Juan Luis"
                            tipo="text"
                            id="userName"
                            name="userName"
                            maxLength="30"
                            //onChange={handleChange}
                            //value={formData.userName}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-1">Apellidos</label>
                        <Datos
                            holder="Ej: González Díaz"
                            tipo="text"
                            id="userLastName"
                            name="userLastName"
                            maxLength="30"
                            //onChange={handleChange}
                            //value={formData.userName}
                        />
                    </div>
                    <div className="mb-12">
                    <label className="block text-sm font-bold mb-1">Rut</label>
                        <Rut
                            holder="Ej:20545267-1"
                            tipo="text"
                            id="userRut"
                            name="userRut"
                            maxLength="10"
                            //onChange={handleChange}
                            //value={formData.userRut}
                        />
                    </div>
                    <h1 className="block text-xl mb-2 font-bold">DATOS VEHÍCULO</h1>
                    <div className="mb-12">
                    <label className="block text-sm font-bold mb-1">Patente</label>
                        <Datos
                            holder="Ej: GGXX20"
                            tipo="text"
                            id="vehiclePatente"
                            name="vehiclePatente"
                            maxLength="6"
                            //onChange={handleChange}
                            //value={formData.userName}
                        />
                    </div>
                    <div className='w-full flex justify-center mb-8'>
                        <button type="submit" className="text-white-50 rounded-md bg-blue-ribbon-600 hover:bg-blue-ribbon-700 p-1.5 px-3 flex flex-row items-center gap-x-2 font-bold">{(<FaUser className="text-sm"/>)} INGRESAR USUARIO </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GuardGrant;

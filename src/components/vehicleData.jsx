import React, { useState } from 'react';
import { FaTrashAlt } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import axios from "axios";
import { TiWarning } from "react-icons/ti";



export const VehicleData = ( props ) => {

    const [buttonDisable, setButtonDisable] = useState(false);
    const [buttonEnable, setButtonEnable] = useState(false);
    const [buttonDelete, setButtonDelete] = useState(false);
    const [message, setMessage] = useState(false);

    const [vehicleData, setVehicleData] = useState({
        patente: props.patente,
        marca: props.marca,
        modelo: props.modelo,
        anio: props.anio,
        color: props.color,
        tipo: props.tipo,
        estado: props.estado,
        rut: props.rut
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVehicleData({
            ...vehicleData,
            [name]: value
        });
    }

    const handleDisable = () => {
        setButtonDisable(!buttonDisable);
    }

    const handleEnable = () => {
        setButtonEnable(!buttonEnable);
        setMessage(false)
    }

    const handleDelete = () => {
        setButtonDelete(!buttonDelete)
    }
    
    const deleteVehicle = async () => {
        try {
            const response = await axios.delete("http://localhost:3090/api/delete-vehicle", {
                data: {
                    patente: vehicleData.patente,
                    userRut: vehicleData.rut
                }
            });

            // Verificar el código de estado de la respuesta
            if (response.status === 200) {
                // Si la respuesta es exitosa, eliminar el vehículo del frontend
                setVehicleData(null);
            }
        } catch (error) {
            // Manejar el error de la solicitud
            console.error(error);
        }
    }

    const changeStateVehicle = async () => {
        try {
            const response = await axios.put("http://localhost:3090/api/change-state-vehicle", {
                patente: vehicleData.patente,
                estado: vehicleData.estado === 'activo' ? 'inactivo' : 'activo',
                userRut: vehicleData.rut
            });
    
            // Verificar el código de estado de la respuesta
            if (response.status === 200) {
                // Si la respuesta es exitosa, actualizar el estado del vehículo en el frontend
                setVehicleData({
                    ...vehicleData,
                    estado: vehicleData.estado === 'activo' ? 'inactivo' : 'activo'
                });
                setButtonDisable(false);
                setButtonEnable(false);
            }
        } catch (error) {
            // Manejar el error de la solicitud
            if (error.response && error.response.status === 400) {
                setMessage(true);
            } else {
                console.error(error);
            }
        }
    }
    

    return(
        <>
            {buttonDisable ? (
                <div className={`${vehicleData.estado === 'activo' ? 'bg-hint-of-green-100 text-gray-800 border-hint-of-green-500 shadow-hint-of-green-950' : 'bg-gray-200 border-gray-500 shadow-gray-950'} flex flex-col border-[1px] shadow-3xl gap-x-16 w-full p-8 rounded-2xl items-center justify-center gap-y-8`}>
                    <div className='col-span-2 justify-center'>
                        <h1 className='text-xl text-center'>¿Estas seguro que quieres deshabilitar este vehículo para realizar reservas?</h1>
                    </div>
                    <div className='col-span-2 flex items-center gap-x-8 px-2 justify-center w-full'>
                        <button onClick={changeStateVehicle} className='text-white-50 rounded-md p-1.5 px-3 flex flex-row items-center gap-x-1 font-bold bg-green-700 hover:bg-green-800'><FaCheck/> Si</button>
                        <button onClick={handleDisable} className='text-white-50 rounded-md bg-red-500 hover:bg-red-700 p-1.5 px-3 flex flex-row items-center gap-x-1 font-bold'><FaX/> No</button>
                    </div>
                </div>
            ) : buttonEnable ? (
                <div className={`${vehicleData.estado === 'activo' ? 'bg-hint-of-green-100 text-gray-800 border-hint-of-green-500 shadow-hint-of-green-950' : 'bg-gray-200 border-gray-500 shadow-gray-950'} flex flex-col border-[1px] shadow-3xl gap-x-16 w-full p-8 rounded-2xl items-center justify-center gap-y-8`}>
                    <div className='col-span-2 flex flex-col justify-center gap-y-4'>
                        <h1 className='text-xl text-center'>¿Estas seguro que quieres habilitar este vehículo para realizar reservas?</h1>
                        {message && <p className='text-red-500 justify-center text-lg flex flex-row items-center gap-x-2'><TiWarning className='text-2xl'/> Ya tienes un vehículo activo</p>}
                    </div>
                    <div className='col-span-2 flex items-center gap-x-8 px-2 justify-center w-full'>
                        <button onClick={changeStateVehicle} className='text-white-50 rounded-md p-1.5 px-3 flex flex-row items-center gap-x-1 font-bold bg-green-700 hover:bg-green-800'><FaCheck/> Si</button>
                        <button onClick={handleEnable} className='text-white-50 rounded-md bg-red-500 hover:bg-red-700 p-1.5 px-3 flex flex-row items-center gap-x-1 font-bold'><FaX/> No</button>
                    </div>
                </div>
            ) : buttonDelete ? (
                <div className={`${vehicleData.estado === 'activo' ? 'bg-hint-of-green-100 text-gray-800 border-hint-of-green-500 shadow-hint-of-green-950' : 'bg-gray-200 border-gray-500 shadow-gray-950'} flex flex-col border-[1px] shadow-3xl gap-x-16 w-full p-8 rounded-2xl items-center justify-center gap-y-8`}>
                    <div className='col-span-2 flex flex-col justify-center gap-y-4'>
                        <h1 className='text-xl text-center'>¿Estas seguro que quieres eliminar este vehículo para realizar reservas?</h1>
                    </div>
                    <div className='col-span-2 flex items-center gap-x-8 px-2 justify-center w-full'>
                        <button onClick={deleteVehicle} className='text-white-50 rounded-md p-1.5 px-3 flex flex-row items-center gap-x-1 font-bold bg-green-700 hover:bg-green-800'><FaCheck/> Si</button>
                        <button onClick={handleDelete} className='text-white-50 rounded-md bg-red-500 hover:bg-red-700 p-1.5 px-3 flex flex-row items-center gap-x-1 font-bold'><FaX/> No</button>
                    </div>
                </div>
            ) : (
                <div className={`${vehicleData.estado === 'activo' ? 'bg-hint-of-green-100 text-gray-800 border-hint-of-green-500 shadow-hint-of-green-950' : 'bg-gray-200 border-gray-500 shadow-gray-950'} grid border-[1px] grid-cols-2 shadow-3xl gap-x-8 w-full gap-y-8 p-8 rounded-2xl items-center`}>
            <div className='col-span-2'>
                <h1 className='text-xl'>VEHÍCULO {vehicleData.estado.toUpperCase()}</h1>
            </div>
            <h1 className='text-lg'>Patente</h1>
            <h1 className='text-lg'>{vehicleData.patente}</h1>
            <h1 className='text-lg'>Marca</h1>
            <h1 className='text-lg'>{vehicleData.marca}</h1>
            <h1 className='text-lg'>Modelo</h1>
            <h1 className='text-lg'>{vehicleData.modelo}</h1>
            <h1 className='text-lg'>Año</h1>
            <h1 className='text-lg'>{vehicleData.anio}</h1>
            <h1 className='text-lg'>Color</h1>
            <h1 className='text-lg'>{vehicleData.color}</h1>
            <h1 className='text-lg'>Tipo vehículo</h1>
            <h1 className='text-lg'>{vehicleData.tipo}</h1>

            <div className='col-span-2 flex items-center gap-x-8 px-8 justify-center w-full'>
                <button onClick={vehicleData.estado === 'activo' ? handleDisable : handleEnable} className={`text-white-50 rounded-md p-1.5 px-3 flex flex-row items-center gap-x-1 font-bold ${vehicleData.estado === 'activo' ? 'bg-gray-500 hover:bg-gray-700' : 'bg-green-700 hover:bg-green-800'}`}>{vehicleData.estado === 'activo' ? <FaX/> : <FaCheck/>} {vehicleData.estado === 'activo' ? 'Deshabilitar' : 'Habilitar'}</button>
                <button onClick={handleDelete} className='text-white-50 rounded-md bg-red-500 hover:bg-red-700 p-1.5 px-3 flex flex-row items-center gap-x-1 font-bold'><FaTrashAlt/> Eliminar</button>
            </div>
        </div>
            )}
        </>
    );
}
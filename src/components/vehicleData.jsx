import React, { useState } from 'react';
import { FaTrashAlt } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import axios from "axios";
import { TiWarning } from "react-icons/ti";
import { FaCar } from "react-icons/fa";
import { TiArrowSortedDown } from "react-icons/ti";
import { TiArrowSortedUp } from "react-icons/ti";




export const VehicleData = ( props ) => {

    const [buttonDisable, setButtonDisable] = useState(false);
    const [buttonEnable, setButtonEnable] = useState(false);
    const [buttonDelete, setButtonDelete] = useState(false);
    const [showVehicle, setShowVehicle] = useState(false);
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
    
    const handleShowVehicle = () => {
        setShowVehicle(!showVehicle);
    }

    const deleteVehicle = async () => {
        try {
            const response = await axios.delete("/api/delete-vehicle", {
                data: {
                    patente: vehicleData.patente,
                    userRut: vehicleData.rut
                }
            });

            // Verificar el código de estado de la respuesta
            if (response.status === 200) {
                // Si la respuesta es exitosa, eliminar el vehículo del frontend
                props.onDelete(vehicleData.patente);
            }
        } catch (error) {
            // Manejar el error de la solicitud
            console.error(error);
        }
    }

    const changeStateVehicle = async () => {
        try {
            const response = await axios.put("/api/change-state-vehicle", {
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
                <div className={`${vehicleData.estado === 'activo' ? 'bg-surf-crest-200 border-surf-crest-500 text-camarone-900 shadow-surf-crest-950' : 'bg-cosmos-200 border-cosmos-500 text-persian-plum-900 shadow-cosmos-900'} flex min-h-full flex-col border-[1px] shadow-3xl gap-x-16 w-full p-32 max-md:p-16 rounded-2xl items-center justify-center gap-y-8 `}>
                    <div className='col-span-2 justify-center'>
                        <h1 className='text-xl text-center max-md:text-base'>¿Estas seguro que quieres DESHABILITAR este vehículo para realizar reservas?</h1>
                    </div>
                    <div className='col-span-2 flex items-center gap-x-8 px-2 justify-center w-full'>
                        <button onClick={changeStateVehicle} className='text-white-50 rounded-md p-1.5 px-3 flex flex-row items-center gap-x-1 font-bold bg-green-700 hover:bg-green-800 max-md:font-semibold'><FaCheck/> Si</button>
                        <button onClick={handleDisable} className='text-white-50 rounded-md bg-red-500 hover:bg-red-700 p-1.5 px-3 flex flex-row items-center gap-x-1 font-bold max-md:font-semibold'><FaX/> No</button>
                    </div>
                </div>
            ) : buttonEnable ? (
                <div className={`${vehicleData.estado === 'activo' ? 'bg-surf-crest-200 border-surf-crest-500 text-camarone-900 shadow-surf-crest-950' : 'bg-cosmos-200 border-cosmos-500 text-persian-plum-900 shadow-cosmos-900'} flex flex-col border-[1px] shadow-3xl gap-x-16 w-full p-32 max-md:p-16 rounded-2xl items-center justify-center gap-y-8`}>
                    <div className='col-span-2 flex flex-col justify-center gap-y-4'>
                        <h1 className='text-xl text-center max-md:text-base'>¿Estas seguro que quieres HABILITAR este vehículo para realizar reservas?</h1>
                        {message && <p className='text-red-500 justify-center text-lg flex flex-row items-center gap-x-2'><TiWarning className='text-2xl'/> Ya tienes un vehículo activo</p>}
                    </div>
                    <div className='col-span-2 flex items-center gap-x-8 px-2 justify-center w-full'>
                        <button onClick={changeStateVehicle} className='text-white-50 rounded-md p-1.5 px-3 flex flex-row items-center gap-x-1 font-bold max-md:font-semibold bg-green-700 hover:bg-green-800'><FaCheck/> Si</button>
                        <button onClick={handleEnable} className='text-white-50 rounded-md bg-red-500 hover:bg-red-700 p-1.5 px-3 flex flex-row items-center gap-x-1 font-bold max-md:font-semibold'><FaX/> No</button>
                    </div>
                </div>
            ) : buttonDelete ? (
                <div className={`${vehicleData.estado === 'activo' ? 'bg-surf-crest-200 border-surf-crest-500 text-camarone-900 shadow-surf-crest-950' : 'bg-cosmos-200 border-cosmos-500 text-persian-plum-900 shadow-cosmos-900'} flex flex-col border-[1px] shadow-3xl gap-x-16 w-full p-32 max-md:p-16 rounded-2xl items-center justify-center gap-y-8`}>
                    <div className='col-span-2 flex flex-col justify-center gap-y-4'>
                        <h1 className='text-xl text-center max-md:text-base'>¿Estas seguro que quieres ELIMINAR este vehículo para realizar reservas?</h1>
                    </div>
                    <div className='col-span-2 flex items-center gap-x-8 px-2 justify-center w-full'>
                        <button onClick={deleteVehicle} className='text-white-50 rounded-md p-1.5 px-3 flex flex-row items-center gap-x-1 font-bold max-md:font-semibold bg-green-700 hover:bg-green-800'><FaCheck/> Si</button>
                        <button onClick={handleDelete} className='text-white-50 rounded-md bg-red-500 hover:bg-red-700 p-1.5 px-3 flex flex-row items-center gap-x-1 font-bold max-md:font-semibold'><FaX/> No</button>
                    </div>
                </div>
            ) : (
                <div className={`${vehicleData.estado === 'activo' ? 'shadow-surf-crest-950' : ' shadow-cosmos-900'} flex flex-col shadow-3xl gap-x-8 w-full rounded-2xl items-center`}>
                    <button onClick={handleShowVehicle} className={`${vehicleData.estado === 'activo' ? 'bg-surf-crest-200 border-surf-crest-500 text-camarone-900' : 'bg-cosmos-200 border-cosmos-500 text-persian-plum-900' } border-[1px] w-full p-8 max-md:p-4 rounded-t-2xl flex flex-row justify-between items-center'`}>
                        <span className='flex flex-row gap-x-4 max-md:gap-x-2 items-center'>
                            <FaCar className='text-3xl max-md:text-lg'/>
                            <h1 className='text-xl max-md:text-base'>{vehicleData.patente}</h1>
                        </span>
                        <h1 className='flex flex-row gap-x-1 text-xl max-md:text-base items-center'>{vehicleData.estado.toUpperCase()} {showVehicle ? <TiArrowSortedUp className='text-3xl'/> : <TiArrowSortedDown className='text-3xl'/>}</h1>
                    </button>
                    {showVehicle && (
                        <div className='grid grid-cols-2 w-full p-8 max-md:p-4 rounded-b-2xl border-[1px] border-alabaster-600  bg-alabaster-50 text-outer-space-900 font-semibold'>
                            <h1 className='text-lg max-md:text-base'>Patente</h1>
                            <h1 className='text-lg max-md:text-base'>{vehicleData.patente}</h1>
                            <h1 className='text-lg max-md:text-base'>Marca</h1>
                            <h1 className='text-lg max-md:text-base'>{vehicleData.marca}</h1>
                            <h1 className='text-lg max-md:text-base'>Modelo</h1>
                            <h1 className='text-lg max-md:text-base'>{vehicleData.modelo}</h1>
                            <h1 className='text-lg max-md:text-base'>Año</h1>
                            <h1 className='text-lg max-md:text-base'>{vehicleData.anio}</h1>
                            <h1 className='text-lg max-md:text-base'>Color</h1>
                            <h1 className='text-lg max-md:text-base'>{vehicleData.color}</h1>
                            <h1 className='text-lg max-md:text-base'>Tipo vehículo</h1>
                            <h1 className='text-lg max-md:text-base'>{vehicleData.tipo}</h1>
                            <div className='col-span-2 flex items-center gap-x-16 px-8 justify-center w-full mt-10 max-md:px-2 max-md:gap-x-4 max-md:text-sm'>
                                <button onClick={vehicleData.estado === 'activo' ? handleDisable : handleEnable} className={`text-white-50 rounded-md p-1.5 px-3 flex flex-row items-center gap-x-1 font-bold  max-md:font-semibold ${vehicleData.estado === 'activo' ? 'bg-red-400 hover:bg-gray-700' : 'bg-green-600 hover:bg-green-800'}`}>{vehicleData.estado === 'activo' ? <FaX/> : <FaCheck/>} {vehicleData.estado === 'activo' ? 'Deshabilitar' : 'Habilitar'}</button>
                                <button onClick={handleDelete} className='text-white-50 rounded-md bg-red-500 hover:bg-red-700 p-1.5 px-3 flex flex-row items-center gap-x-1 font-bold max-md:font-semibold '><FaTrashAlt/> Eliminar</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
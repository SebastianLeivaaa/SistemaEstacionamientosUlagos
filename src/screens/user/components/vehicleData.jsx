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
    const [showVehicle, setShowVehicle] = useState(props.firstVehicle);
    const [message, setMessage] = useState(false);
    const [isRotated, setIsRotated] = useState(false);

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

    const handleDisable = () => {
        setButtonDisable(!buttonDisable);
        setIsRotated(!isRotated);
    };

    const handleEnable = () => {
        setButtonEnable(!buttonEnable);
        setMessage(false);
        setIsRotated(!isRotated);
    };

    const handleDelete = () => {
        setButtonDelete(!buttonDelete);
        setIsRotated(!isRotated); 
    };

    const deleteVehicle = async () => {
        try {
            const response = await axios.delete("http://localhost:3090/api/delete-vehicle", {
                data: {
                    patente: vehicleData.patente,
                    userRut: vehicleData.rut
                }
            });

            if (response.status === 200) {
                props.onDelete(vehicleData.patente);
            }
        } catch (error) {
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
    
            if (response.status === 200) {
                setVehicleData({
                    ...vehicleData,
                    estado: vehicleData.estado === 'activo' ? 'inactivo' : 'activo'
                });
                setButtonDisable(false);
                setButtonEnable(false);
                setIsRotated(!isRotated);
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setMessage(true);
            } else {
                console.error(error);
            }
        }
    }
    

    return(
        <>
            <div style={{ perspective: 1000, transform: isRotated ? 'rotateX(180deg) rotateY(180deg)' : 'rotateY(0deg)' }} className={`${vehicleData.estado === 'activo' ? 'shadow-midnight-800' : ' shadow-red-500'} relative flex flex-col shadow-3xl w-full h-[280px] duration-1000 transition-all ease-linear rounded-2xl items-center`}>
                {buttonDisable ? (
                    <div style={{transform: 'rotateX(180deg) rotateY(180deg)'}} className="dark:bg-midnight-900 dark:text-white-50 dark:shadow-midnight-900 bg-white-50 text-black shadow-white-50 flex flex-col shadow-3xl p-4 w-full h-[280px] rounded-2xl items-center justify-center gap-y-4">
                        <div className='w-full justify-center'>
                            <h1 className='text-lg text-center max-md:text-base'>¿Estas seguro que quieres DESHABILITAR este vehículo para realizar reservas?</h1>
                        </div>
                        <div className='col-span-2 flex items-center gap-x-8 px-2 justify-center w-full'>
                            <button onClick={changeStateVehicle} className='text-white-50 rounded-md p-1.5 px-3 flex flex-row items-center gap-x-1 font-bold bg-green-700 hover:bg-green-800 max-md:font-semibold'><FaCheck/> Si</button>
                            <button onClick={handleDisable} className='text-white-50 rounded-md bg-red-500 hover:bg-red-700 p-1.5 px-3 flex flex-row items-center gap-x-1 font-bold max-md:font-semibold'><FaX/> No</button>
                        </div>
                    </div>
                ) : buttonEnable ? (
                    <div style={{transform: 'rotateX(180deg) rotateY(180deg)'}} className="dark:bg-midnight-900 dark:text-white-50 dark:shadow-midnight-900 bg-white-50 text-black shadow-white-50 flex flex-col shadow-3xl p-4 w-full h-[280px] rounded-2xl items-center justify-center gap-y-4">
                        <div className='col-span-2 flex flex-col justify-center gap-y-4'>
                            <h1 className='text-xl text-center max-md:text-base'>¿Estas seguro que quieres HABILITAR este vehículo para realizar reservas?</h1>
                            {message && <p className='text-yellow-500 justify-center text-lg flex flex-row items-center gap-x-2'><TiWarning className='text-2xl'/> Ya tienes un vehículo activo</p>}
                        </div>
                        <div className='col-span-2 flex items-center gap-x-8 px-2 justify-center w-full'>
                            <button onClick={changeStateVehicle} className='text-white-50 rounded-md p-1.5 px-3 flex flex-row items-center gap-x-1 font-bold max-md:font-semibold bg-green-700 hover:bg-green-800'><FaCheck/> Si</button>
                            <button onClick={handleEnable} className='text-white-50 rounded-md bg-red-500 hover:bg-red-700 p-1.5 px-3 flex flex-row items-center gap-x-1 font-bold max-md:font-semibold'><FaX/> No</button>
                        </div>
                    </div>
                ) : buttonDelete ? (
                    <div style={{transform: 'rotateX(180deg) rotateY(180deg)'}} className="dark:bg-midnight-900 dark:text-white-50 dark:shadow-midnight-900 bg-white-50 text-black shadow-white-50 flex flex-col shadow-3xl p-4 w-full h-[280px] rounded-2xl items-center justify-center gap-y-4">
                        <div className='col-span-2 flex flex-col justify-center gap-y-4'>
                            <h1 className='text-xl text-center max-md:text-base'>¿Estas seguro que quieres ELIMINAR este vehículo para realizar reservas?</h1>
                        </div>
                        <div className='col-span-2 flex items-center gap-x-8 px-2 justify-center w-full'>
                            <button onClick={deleteVehicle} className='text-white-50 rounded-md p-1.5 px-3 flex flex-row items-center gap-x-1 font-bold max-md:font-semibold bg-green-700 hover:bg-green-800'><FaCheck/> Si</button>
                            <button onClick={handleDelete} className='text-white-50 rounded-md bg-red-500 hover:bg-red-700 p-1.5 px-3 flex flex-row items-center gap-x-1 font-bold max-md:font-semibold'><FaX/> No</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className={`${vehicleData.estado === 'activo' ? 'bg-green-700  text-white-50' : 'bg-red-600  text-white-50' } w-full p-3 max-md:p-4 rounded-t-2xl flex flex-row justify-between items-center'`}>
                            <span className='flex flex-row gap-x-2 max-md:gap-x-2 items-center font-semibold'>
                                <FaCar className='text-2xl max-md:text-lg'/>
                                <h1 className='text-base max-md:text-sm'>{vehicleData.patente}</h1>
                            </span>
                            <h1 className='flex flex-row gap-x-1 text-base max-md:text-sm items-center font-semibold'>{vehicleData.estado.toUpperCase()}</h1>
                        </div>
                        <div className='grid grid-cols-2 gap-x-8 items-center gap-y-0.5 w-full h-full p-3 max-md:p-4 rounded-b-2xl text-black bg-white-100 dark:bg-bay-of-many-900 dark:text-white-50 font-semibold'>
                            <h1 className='text-base max-md:text-sm'>Patente</h1>
                            <h1 className='text-base max-md:text-sm'>{vehicleData.patente}</h1>
                            <h1 className='text-base max-md:text-sm'>Marca</h1>
                            <h1 className='text-base max-md:text-sm'>{vehicleData.marca}</h1>
                            <h1 className='text-base max-md:text-sm'>Modelo</h1>
                            <h1 className='text-base max-md:text-sm'>{vehicleData.modelo}</h1>
                            <h1 className='text-base max-md:text-sm'>Año</h1>
                            <h1 className='text-base max-md:text-sm'>{vehicleData.anio}</h1>
                            <h1 className='text-base max-md:text-sm'>Color</h1>
                            <h1 className='text-base max-md:text-sm'>{vehicleData.color}</h1>
                            <h1 className='text-base max-md:text-sm'>Tipo vehículo</h1>
                            <h1 className='text-base max-md:text-sm'>{vehicleData.tipo}</h1>
                            <div className='col-span-2 flex md:flex-row items-center justify-evenly gap-x-5 w-full mt-4 max-md:text-sm'>
                                <button onClick={vehicleData.estado === 'activo' ? handleDisable : handleEnable} className={`text-white-50 w-full  rounded-md p-1.5 px- flex flex-row justify-center items-center gap-x-1 font-bold  max-md:font-semibold ${vehicleData.estado === 'activo' ? 'bg-red-400 hover:bg-gray-700' : 'bg-green-600 hover:bg-green-800'}`}>{vehicleData.estado === 'activo' ? <FaX/> : <FaCheck/>} {vehicleData.estado === 'activo' ? 'Deshabilitar' : 'Habilitar'}</button>
                                <button onClick={handleDelete} className='text-white-50 rounded-md bg-red-500 hover:bg-red-700 w-full p-1.5 px-3 flex flex-row justify-center items-center gap-x-1 font-bold max-md:font-semibold '><FaTrashAlt/> Eliminar</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
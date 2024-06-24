import React, { useState, useEffect } from "react";
import { MdDirectionsCarFilled, MdAdd } from "react-icons/md";
import { VehicleData } from "./components/vehicleData";
import { ClipLoader } from 'react-spinners';
import { IoIosSave } from "react-icons/io";
import { FaBell, FaCheck } from "react-icons/fa";
import { TiWarning } from "react-icons/ti";
import axios from "axios";



export const MyVehicles = ( {user} ) => {
 
    const [vehicles, setVehicles] = useState([]);
    const [newVehicle, setNewVehicle] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [formData, setFormData] = useState({
        vehiclePatente: ''
    });

    const handleNewVehicle = () => {
        setNewVehicle(!newVehicle);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value.toUpperCase()
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        const newVehicleData = {
            patente: formData.vehiclePatente,
            userRut: user.userRut
        };

        try {
            if(formData.vehiclePatente.length === 6){
                const response = await axios.post("/api/add-new-vehicle", newVehicleData, { withCredentials: true });
                await getVehicles(user.userRut);
                setFormData({ vehiclePatente: '' });
                setMessage({ type: 'success', text: response.data.message });
            }else{
                setMessage({ type: 'error', text: 'La patente debe tener 6 caracteres' });
            }

        } catch (error) {
            console.error("Error adding vehicle:", error);
            setMessage({ type: 'error', text: error.response?.data?.error || 'Error al agregar el vehículo' });
        }
        setIsLoading(false);
    };

    const getVehicles = async (userRut) => {
        try {
            const response = await axios.post('/api/get-vehicles', { userRut }, { withCredentials: true });
            // Ordenar vehículos para que los activos estén primero
            const sortedVehicles = response.data.sort((a, b) => a.regi_estado.localeCompare(b.regi_estado));
            setVehicles(sortedVehicles);
        } catch (error) {
            console.log(error);
        }
    };


    const removeVehicleFromState = (patente) => {
        setVehicles(vehicles.filter(vehicle => vehicle.vehi_patente !== patente));
    };

    useEffect(() => {
        getVehicles(user.userRut);
    }, [vehicles]);

    return(
        <div className="w-full h-full flex flex-col px-4 pt-8 2xl:px-60 m-auto items-center max-md:px-2 gap-y-4 overflow-y-scroll">
            <div className="w-full grid grid-cols-2 max-md:grid-cols-1 gap-4">
                <div className="dark:bg-midnight-950 bg-white-50 shadow-3xl contrast-[95%] mb-8 rounded-md p-8 max-md:p-4 w-full flex flex-col gap-y-8 max-md:gap-y-4">
                    <h1 className="dark:text-white-50 text-black font-bold text-2xl flex flex-row gap-x-2 items-center"><MdAdd className="text-4xl text-black dark:text-white-50"/> Agregar nuevo vehículo</h1>
                    <form onSubmit={handleSubmit} className='flex flex-col w-full'>
                        <div className='flex flex-row items-center justify-start gap-x-4 p-2 max-2xl:flex-col max-2xl:gap-y-4 max-2xl:items-start'>
                            <label className='w-fit font-semibold text-xl max-md:text-lg text-black dark:text-white-50'>Ingrese la patente: </label>
                            <div className="flex flex-row gap-x-4">
                                <input onChange={handleChange} value={formData.vehiclePatente} type='text' id='vehiclePatente' name='vehiclePatente' minLength='6' maxLength='6' placeholder='EJ:GGXX20' className="p-1 bg-gray-100 dark:bg-gray-700 text-black dark:text-white-50 border-[0.5px] border-midnight-700"></input>
                                <button type='submit' className='flex flex-row gap-x-1 items-center bg-midnight-700 hover:bg-midnight-800 rounded-md font-bold p-2 text-white-50'>{isLoading ? (<ClipLoader color="#FFFFFF" size={24} />) : (<IoIosSave className='text-2xl' />)} Guardar</button>
                            </div>
                        </div>
                        {message && (
                            <h1 className={`p-2 rounded flex flex-row gap-x-1 max-lg:flex-col gap-y-1 text-center justify-center items-center ${message.type === 'success' ? 'text-green-700 dark:text-green-600' : 'dark:text-yellow-500 text-red-600'}`}>
                                {message.type === 'success' ? <FaCheck /> : <TiWarning className='text-2xl'/> } {message.text}
                            </h1>
                        )}
                    </form>
                </div>
                <div className="dark:bg-midnight-950 bg-white-50 shadow-3xl contrast-[95%] mb-8 rounded-md p-8 max-md:p-4 w-full flex flex-col gap-y-8 max-md:gap-y-4">
                    <h1 className="dark:text-white-50 text-black font-bold text-2xl flex flex-row gap-x-2 items-center"><FaBell className="text-4xl text-black dark:text-white-50"/>Recordatorio</h1>
                    <p className="text-black dark:text-white-50 text-lg font-semibold text-start max-md:text-base">Recuerda que solo puedes tener un máximo de 6 vehículos registrados en el sistema.</p>
                </div>
            </div>
            <div className="dark:bg-midnight-950 bg-white-50 shadow-3xl contrast-[95%] mb-8 rounded-md p-8 max-md:p-4 w-full flex flex-col gap-y-8 max-md:gap-y-4">
                <h1 className="dark:text-white-50 text-black font-bold text-2xl flex flex-row gap-x-2 items-center"><MdDirectionsCarFilled className="text-4xl text-black dark:text-white-50"/> Mis vehículos</h1>
                <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 items-center justify-center w-full gap-6">
                    {vehicles.length > 0 ? (
                        vehicles.map((vehicle, index) => (
                            <VehicleData
                                key={index}
                                patente={vehicle.vehi_patente}
                                marca={vehicle.vehi_marca}
                                modelo={vehicle.vehi_modelo}
                                anio={vehicle.vehi_anio}
                                color={vehicle.vehi_color}
                                tipo={vehicle.vehi_tipo}
                                estado={vehicle.regi_estado}
                                rut={vehicle.regi_usua_rut}
                                firstVehicle={index === 0}
                                index={index}
                                onDelete={removeVehicleFromState}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col max-md:flex-row gap-x-2 items-center col-span-3 gap-y-2 w-full justify-center">
                            <MdDirectionsCarFilled className="text-9xl text-gray-700 dark:text-white-50"/>
                            <h1 className="text-center text-2xl max-md:text-xl font-bold text-black dark:text-white-50">No se encontraron vehículos</h1>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}; 
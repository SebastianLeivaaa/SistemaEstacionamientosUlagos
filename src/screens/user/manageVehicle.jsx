import React, { useState, useEffect } from 'react';
import Ulogo from "../../assets/img/Ulogo.png";
import { HiOutlineLogin } from "react-icons/hi";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { VehicleData } from '../../components/vehicleData';
import { IoMdAdd } from "react-icons/io";
import { IoIosSave } from "react-icons/io";
import { TiArrowSortedDown } from "react-icons/ti";
import { TiArrowSortedUp } from "react-icons/ti";
import { FaCheck } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { ClipLoader } from 'react-spinners';

export const ManageVehicle = () => {
    const [user, setUser] = useState({
        email: "",
        userName: "",
        userLastNamePat: "",
        userLastNameMat: "",
        userRut: "",
    });
    const [vehicles, setVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newVehicle, setNewVehicle] = useState(false);
    const [message, setMessage] = useState(null);
    const [formData, setFormData] = useState({
        vehiclePatente: ''
    });

    const navigate = useNavigate();

    const logOut = async () => {
        const response = await axios.get("http://localhost:3090/api/logout", { withCredentials: true });
        navigate('/');
    };

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
        const newVehicleData = {
            patente: formData.vehiclePatente,
            userRut: user.userRut
        };

        try {
            const response = await axios.post("http://localhost:3090/api/add-new-vehicle", newVehicleData, { withCredentials: true });
            console.log("Vehicle added successfully:", response.data);
            await getVehicles(user.userRut);
            setFormData({ vehiclePatente: '' });
            setMessage({ type: 'success', text: response.data.message });
        } catch (error) {
            console.error("Error adding vehicle:", error);
            setMessage({ type: 'error', text: error.response?.data?.error || 'Error al agregar el vehículo' });
        }
        setIsLoading(false);
    };

    const getProfile = async () => {
        try {
            const response = await axios.get("http://localhost:3090/api/login", { withCredentials: true });
            setUser({
                email: response.data.email,
                userName: response.data.userName,
                userLastNamePat: response.data.userLastNamePat,
                userLastNameMat: response.data.userLastNameMat,
                userRut: response.data.userRut,
            });
            return response.data.userRut;
        } catch (error) {
            navigate("/");
        }
    };

    const getVehicles = async (userRut) => {
        try {
            const response = await axios.post('http://localhost:3090/api/get-vehicles', { userRut }, { withCredentials: true });
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
        const fetchProfileAndVehicles = async () => {
            const userRut = await getProfile();
            if (userRut) {
                await getVehicles(userRut);
            }
        };
        fetchProfileAndVehicles();
    }, []);

    return (
        <div className="w-screen min-h-screen flex items-center justify-center py-16">
            <div className="flex flex-col h-[800px] w-[50%] overflow-y-scroll p-8 gap-y-8 rounded-md max-md:w-[75%] max-md:px-4 max-md:py-8 bg-white-50 relative">
                <div className="flex flex-wrap justify-end xl:flex-wrap lg:flex-wrap md:flex-wrap sm:flex-wrap xl:justify-between lg:justify-end md:justify-end sm:justify-end w-full">
                    <img src={Ulogo} alt="Logo Ulagos" className="px-5 w-full xl:w-1/2 lg:w-full md:w-full sm:w-full" />
                    <div className="flex flex-col items-end justify-end">
                        <h1 className="text-lg font-bold text-center max-md:text-base text-congress-blue-900">{user.userName.toLocaleUpperCase()} {user.userLastNamePat.toLocaleUpperCase()} {user.userLastNameMat.toLocaleUpperCase()}</h1>
                        <button onClick={logOut} className="mt-4 bg-white font-bold text-red-600 text-lg flex flex-row items-center justify-center gap-x-1 max-md:text-base"><HiOutlineLogin className="text-3xl max-md:text-2xl" />CERRAR SESIÓN</button>
                    </div>
                </div>
                <div className='flex flex-col items-center gap-y-8'>
                    <h1 className='font-bold text-2xl mt-10'>TUS VEHÍCULOS</h1>
                    <button onClick={handleNewVehicle} className='flex flex-row p-3 bg-blue-ribbon-600 hover:bg-blue-ribbon-700 rounded-md font-bold w-fit text-white-50 items-center gap-x-1'><IoMdAdd className='text-2xl' /> Agregar nuevo vehiculo {newVehicle ? <TiArrowSortedUp className='text-2xl' /> : <TiArrowSortedDown className='text-2xl' />}</button>
                    {newVehicle && (
                        <form onSubmit={handleSubmit} className='flex flex-col gap-y-8'>
                            <h1 className='flex items-center justify-center text-xl font-semibold'>Ingrese su nuevo vehiculo</h1>
                            <div className='flex flex-row items-center gap-x-4 p-2 max-md:flex-col max-md:gap-y-4 max-md:items-start'>
                                <label className='w-fit font-semibold'>Ingrese la patente: </label>
                                <input onChange={handleChange} value={formData.vehiclePatente} type='text' id='vehiclePatente' name='vehiclePatente' maxLength='6' placeholder='EJ:GGXX20' className="p-1 border-[0.5px] border-blue-ribbon-600"></input>
                                <button type='submit' className='flex flex-row gap-x-1 items-center bg-blue-ribbon-600 hover:bg-blue-ribbon-700 rounded-md font-bold p-2 text-white-50'>{isLoading ? (<ClipLoader color="#0d6efd" size={24} />) : (<IoIosSave className='text-2xl' />)} Guardar</button>
                            </div>
                            {message && (
                                <h1 className={`p-2 rounded flex flex-row gap-x-2 justify-center items-center ${message.type === 'success' ? 'text-camarone-700' : 'text-red-800'}`}>
                                    {message.type === 'success' ? <FaCheck /> : <FaX />} {message.text}
                                </h1>
                            )}
                        </form>
                    )}
                </div>
                <div className='flex flex-row items-center gap-x-12 mt-8'>
                    <div className="items-s gap-x-12 w-full justify-center flex">
                        <div className='flex flex-col gap-y-12 xl:w-[60%] lg:w-[90%] max-md:w-full max-md:p-3 items-center justify-center'>
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
                                <p className='w-full text-center flex justify-center text-2xl'>No se encontraron vehículos.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

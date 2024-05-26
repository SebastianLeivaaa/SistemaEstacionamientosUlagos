import {React, useState} from 'react';
import { MdDirectionsCar } from 'react-icons/md';
import Ulogo from "../../assets/img/Ulogo.png"; 
import { Datos } from '../../components/datos';
import { Rut } from '../../components/rut';
import { FaCheck, FaUser, FaArrowLeft} from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



export const GuardManage = () => {
    const navigate = useNavigate();
    const [patente, setPatente] = useState({
        vehiclePatente2: ""
    });
    const [error, setError] = useState('');

    const handleChange2 = (e) => {
        setPatente({
            ...patente,
            [e.target.name]: e.target.value 
        })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                '/api/release-reservation',
                { vehiclePatente: vehiclePatente2.value },
                { withCredentials: true }
            );
            if(res.data){
                navigate('/release', { state:{ estacionamiento: res.data} });
            }

            
            
            
        } catch (error) {
            setError(error.response.data);
        }
    };
    
    return (
        <div className="min-h-screen border-blue-ribbon-600 flex items-center justify-center">
            <div className="bg-white-50 p-8 rounded-lg shadow-md w-full max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                    <button className="text-blue-ribbon-600"> <FaArrowLeft className="w-6 h-6" /></button>
                    <img src={Ulogo} alt="Universidad De Los Lagos" className="h-20" /> 
                    <div></div>
                </div>
                <div className="flex justify-between">
                    {/* Otorgar Estacionamiento */}
                    <div className="w-1/2 pr-4 border-r border-gray-500">
                        <h2 className="text-2xl font-bold mb-4 text-center">OTORGAR ESTACIONAMIENTO</h2>
                        <div className="gap-x-2 bg-blue-ribbon-600 text-white-50 px-4 py-2 text-center flex flex-row items-center justify-center">
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
                    {/* Liberar Estacionamiento */}
                    <div className="w-1/2 pl-4">
                        <h2 className="text-2xl font-bold mb-4 text-center">LIBERAR ESTACIONAMIENTO</h2>
                        <div className="gap-x-2 bg-blue-ribbon-600 text-white-50 px-4 py-2 text-center flex flex-row items-center justify-center">
                            <div className='w-6 h-6 bg-indice-50 rounded-full flex items-center justify-center' >
                                <FaCheck className='text-congress-blue-950'/>
                            </div>
                            Completar datos
                        </div>
                        <form onSubmit={handleSubmit} className='px-4'>
                            <h1 className="block text-xl mb-2 font-bold">DATOS VEHÍCULO</h1>
                            <div className="mb-12">
                                <label className="block text-sm font-bold mb-1">Patente</label>
                                <Datos
                                    holder="Ej: GGXX20"
                                    tipo="text"
                                    id="vehiclePatente2"
                                    name="vehiclePatente2"
                                    maxLength="6"
                                    onChange={handleChange2}
                                />
                            </div>
                            <div className='w-full flex justify-center mb-4'>
                                <button type="submit" className="text-white-50 rounded-md bg-blue-ribbon-600 hover:bg-blue-ribbon-700 p-1.5 px-3 flex flex-row items-center gap-x-2 font-bold">
                                    {(<MdDirectionsCar className="text-2xl"/>)} LIBERAR ESTACIONAMIENTO
                                </button>
                            </div>
                            <div className='flex justify-center'>{error && <p className='text-red-600'>{error}</p>}</div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
  );
}

export default GuardManage;

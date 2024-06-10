import {React, useState} from 'react';
import { MdDirectionsCar } from 'react-icons/md';
import Ulogo from "../../assets/img/Ulogo.png"; 
import { Datos } from '../../components/datos';
import { Rut } from '../../components/rut';
import { FaCheck, FaUser, FaArrowLeft} from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



export const GuardRelease = () => {
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
                'http://localhost:3090/api/release-reservation',
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
        <div className="flex justify-center">
            {/* Liberar Estacionamiento */}
            <div className="w-full ">
                <h2 className="text-2xl font-bold mb-4 text-center md:mx-24">LIBERAR ESTACIONAMIENTO</h2>
                <div className="gap-x-2 px-4 py-2 mb-6 bg-blue-ribbon-600 text-white-50 text-center flex flex-row items-center justify-center">
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
    );
}

export default GuardRelease;

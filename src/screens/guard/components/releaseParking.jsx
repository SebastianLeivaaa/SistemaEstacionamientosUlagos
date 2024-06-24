import React, { useState } from "react";
import { MdLocalParking, MdDirectionsCar } from "react-icons/md";
import { ClipLoader } from 'react-spinners';
import { TiWarning } from "react-icons/ti";
import axios from "axios"

export const ReleaseParking = ( { user } ) => {

    const [patente, setPatente] = useState({
        vehiclePatente: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});


    const handleChange = (e) => {
        setPatente({
            ...patente,
            [e.target.name]: e.target.value 
        })
    };

    const handleSubmit = async (e) => {
        setSuccess(false);
        e.preventDefault();
        setErrors({});
        setError(null);
        const newErrors = {};
        if(patente.vehiclePatente.length !== 6){
            newErrors.vehiclePatente = 'La patente debe tener 6 caracteres';
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        }else{
            setIsLoading(true);
            try {
                const res = await axios.post(
                    '/api/release-reservation',
                    { vehiclePatente: vehiclePatente.value.toUpperCase(), guardRut: user.userRut },
                    { withCredentials: true }
                );

                if(res.status === 200){
                    setSuccess(true);
                }
            } catch (error) {
                setError({ text: error.response?.data || 'Error al liberar' });
            }
            setIsLoading(false);
        }
        
    };

    return (

        <>
           
            <div className="dark:bg-midnight-950 bg-white-50 shadow-3xl  contrast-[95%] rounded-md p-8 max-md:p-4 w-full flex flex-col gap-y-4 max-md:gap-y-4 text-white-50">
                <h1 className="dark:text-white-50 text-black font-bold text-2xl flex flex-row gap-x-2 items-center"><MdLocalParking className="text-3xl text-black dark:text-white-50" />Liberar Estacionamiento</h1>
                <label className="w-fit font-semibold text-xl max-xl:text-base max-md:text-base text-black dark:text-white-50">Ingrese la Patente:</label>
                <form className='flex flex-row  '>
                 
                    <input
                        type='text'
                        id='vehiclePatente'
                        onChange={handleChange}
                        value={patente.vehiclePatente}
                        maxLength='6'
                        name='vehiclePatente'
                        className='p-1 max-lg:w-[50%] max-md:w-[100%] bg-gray-100 dark:bg-gray-700 text-black dark:text-white-50 border-[0.5px] border-midnight-700'
                        placeholder='Ej:GGXX20'
                    />
                    
                    <div className='w-full flex ml-8 items-center'>
                        
                        <button onClick={handleSubmit} className="text-white-50 rounded-md bg-blue-ribbon-600 hover:bg-blue-ribbon-700 p-1.5 px-3 flex flex-row items-center gap-x-2 font-bold">
                            {isLoading ? (<ClipLoader color="#FFFFFF" size={24}/>) : (<MdDirectionsCar className="text-2xl"/>)} Liberar
                        </button>
                    </div>
                </form>
                {errors.vehiclePatente && (
                    <p className='p-2 rounded flex flex-row text-lg gap-x-1 max-lg:text-sm gap-y-1 justify-center items-center text-center dark:text-yellow-500 text-red-600'>
                        <TiWarning className='text-2xl'/> {errors.vehiclePatente}
                    </p>
                )}
                {error && (
                    <p className='p-2 rounded flex flex-row text-lg gap-x-1 max-lg:text-sm  gap-y-1 justify-center items-center text-center dark:text-yellow-500 text-red-600'>
                        <TiWarning className="text-2xl"/> {error.text}
                    </p>
                )}
                {success && (
                    <p className='p-2 rounded flex flex-row text-lg gap-x-1 max-lg:text-sm  gap-y-1 justify-center items-center text-center dark:text-yellow-500 text-green-500'>
                        <MdDirectionsCar className="text-2xl"/> Estacionamiento liberado
                    </p>
                )}
            </div>
            
        </>
    );
}
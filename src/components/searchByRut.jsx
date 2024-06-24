import React, {useState} from "react";
import { IoSearch } from "react-icons/io5"
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { TiWarning } from "react-icons/ti";
import { formatDateTwo } from "../utils/formatDateTwo";
import { validateRut } from "../utils/validateRut";


export const SearchByRut = ( { updateRecordReservation, handleResultFor } ) => {

    const [formData, setFormData] = useState({
        rut: '',
        date: '',
    });


    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        setMessage(null);
        const newErrors = {};
        if(formData.date !== ''){
            if(formData.date < minDate || formData.date > today){
                newErrors.date = `Por favor, ingrese una fecha entre ${formatDateTwo(minDate)} y ${formatDateTwo(today)}`;
            }
        }
        if(!validateRut(formData.rut)){
            newErrors.rut = 'Ingrese un rut válido';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        }else{
            try {
                const response = await axios.post("/api/get-record-reservation-by-rut", formData, { withCredentials: true });
                updateRecordReservation(response.data);
                handleResultFor('rut');
            }catch(error){
                updateRecordReservation([])
                handleResultFor('');
                setMessage({ text: error.response?.data?.message || 'Error al buscar el historial' });
            }
        }
        setIsLoading(false);
    }

    const today = new Date().toISOString().split('T')[0];
    const minDate = '2024-01-01';


    return (
        <>
            <form className="flex flex-row w-full gap-x-8 max-xl:gap-x-2 max-lg:flex-col gap-y-4 justify-center mt-8">
                <div className="flex flex-row max-lg:w-full items-center justify-center gap-x-2 max-lg:flex-col max-xl:gap-y-2 max-xl:items-center max-lg:items-start">
                    <label className="w-fit font-semibold text-xl max-xl:text-base max-md:text-base text-black dark:text-white-50">RUT:</label>
                    <input
                        type='text'
                        id='rut'
                        onChange={handleChange}
                        value={formData.rut}
                        maxLength='10'
                        name='rut'
                        className='p-1 max-lg:w-[50%] max-md:w-[100%] bg-gray-100 dark:bg-gray-700 text-black dark:text-white-50 border-[0.5px] border-midnight-700'
                        placeholder='Ej:21485789-5'
                    />
                </div>
                <div className="flex flex-row items-center max-lg:w-full justify-center gap-x-2 max-lg:flex-col max-xl:gap-y-2 max-xl:items-center max-lg:items-start">
                    <label className="w-fit font-semibold text-xl max-xl:text-base max-md:text-base text-black dark:text-white-50">Fecha (opcional):</label>
                    <input
                        type='date'
                        id='date'
                        onChange={handleChange}
                        value={formData.date}
                        maxLength='6'
                        name='date'
                        className='p-1 max-lg:w-[50%] max-md:w-[100%] px-2 bg-gray-100 dark:bg-gray-700 text-black dark:text-white-50 border-[0.5px] border-midnight-700'
                        placeholder='DD/MM/AAAA'
                        max={today}
                        min={minDate}
                    />
                </div>
                <button onClick={handleSubmit} className='flex flex-row w-fit max-md:w-full max-lg:mt-4 gap-x-1 items-center justify-center bg-midnight-700 hover:bg-midnight-800 rounded-md font-bold p-2 text-white-50'>
                    {isLoading ? (<ClipLoader color="#FFFFFF" size={24}/>) : (<IoSearch className="text-2xl"/>)}  Consultar
                </button>
            </form>
            {errors.rut && (
                <p className='p-2 rounded flex flex-row text-lg gap-x-1 max-lg:flex-col gap-y-1 justify-center items-center text-center dark:text-yellow-500 text-red-600'>
                    <TiWarning className="text-2xl"/> {errors.rut}
                </p>
            )}
            {message && (
                <p className='p-2 rounded flex flex-row text-lg gap-x-1 max-lg:flex-col gap-y-1 justify-center items-center text-center dark:text-yellow-500 text-red-600'>
                    <TiWarning className="text-2xl"/> {message.text}
                </p>
            )}
            {errors.date && (
                <p className='p-2 rounded flex flex-row text-lg gap-x-1 max-lg:flex-col gap-y-1 justify-center items-center text-center dark:text-yellow-500 text-red-600'>
                    <TiWarning className="text-2xl"/> {errors.date}
                </p>
            )}
        </>
    )
}
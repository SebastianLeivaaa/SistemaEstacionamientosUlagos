import React, {useState, useEffect} from "react";
import { IoSearch } from "react-icons/io5"
import { IoHome } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';;
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { TiWarning } from "react-icons/ti";
import { validateRut } from "../utils/validateRut";

export const ConfirmReservationByRut = () => {

    const [rutUser, setRutUser] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { value } = e.target;
        setRutUser(value);
    }
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        setMessage(null);
        const newErrors = {};
        if(!validateRut(formData.rut)){
            newErrors.rut = 'Ingrese un rut válido';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        }else{
            try {
                const response = await axios.post("/api/get-record-reservation-by-rut", rutUser, { withCredentials: true });
                console.log(response.data)
                navigate('/record-reservation-by-rut', { state: { recordReservation: response.data } } )
            }catch(error){
                setMessage({ text: error.response?.data?.message || 'Error al buscar el historial' });
            }
        }
        setIsLoading(false);
    }
    return(
        <div className="flex flex-col w-full gap-y-8 items-center">
            <div className="flex flex-col gap-y-4 px-16 max-md:gap-y-2 items-center">
                <h1 className="text-base">Ingrese el RUT que le otorgará el cliente para confirmar su llegada al estacionamiento de la Universidad de Los Lagos Campus Chinquihue</h1>
                <div className="flex flex-row gap-x-2 w-full items-center justify-center">
                    <label className="text-lg max-md:text-lg">RUT:</label>
                    <div className="flex flex-col gap-y-2">
                        <input
                            type='text'
                            id='rut'
                            onChange={handleChange}
                            value={rutUser}
                            maxLength='10'
                            name='rut'
                            className='w-[100%] max-md:w-[100%] p-1 border-[0.5px] border-blue-ribbon-600'
                            placeholder='Ej:21485789-5'
                        />
                        {errors.rut && (
                            <p className='text-red-600 text-base max-md:text-center'>{errors.rut}</p>
                        )}
                    </div>
                </div>
            </div>
            {message && (
                <div className="flex flex-row gap-x-2 justify-center items-center max-md:flex-col">
                    <TiWarning className="text-2xl text-red-600"/>
                    <p className='text-red-600 text-base max-md:text-center'>{message.text}</p>
                </div>
            )}
            <div className="flex flex-row justify-around mt-16 max-md:flex-col max-md:gap-y-4 max-md:mt-0">
                <button className='flex flex-row max-md:text-sm p-3 bg-blue-ribbon-600 hover:bg-blue-ribbon-700 rounded-md font-bold w-fit max-md:w-full text-white-50 items-center justify-center gap-x-2 '>
                    <IoHome className="text-2xl"/> VOLVER AL MENU PRINCIPAL
                </button>
                <button onClick={handleSubmit} className='flex flex-row p-3 max-md:text-sm bg-blue-ribbon-600 hover:bg-blue-ribbon-700 rounded-md font-bold w-fit max-md:w-full text-white-50 items-center justify-center gap-x-2 '>
                    {isLoading ? (<ClipLoader color="#FFFFFF" size={24}/>) : (<IoSearch className="text-2xl"/>)}  CONSULTAR
                </button>
            </div>
        </div>
    );
}
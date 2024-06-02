import React, {useState, useEffect} from "react";
import { IoSearch } from "react-icons/io5"
import { IoHome } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';;
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { TiWarning } from "react-icons/ti";
import { validateRut } from "../utils/validateRut";
import { QrReader } from "./qrReader";

export const ConfirmReservationByQr = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [errors, setErrors] = useState({});

    const handleScan = (result) => {
        handleSubmit(result);
        console.log(result);
    };

    const navigate = useNavigate();

    const handleSubmit = async (rutUser) => {
        setIsLoading(true);
        setErrors({});
        setMessage(null);
        const newErrors = {};
        if(!validateRut(rutUser)){
            newErrors.rut = 'Ingrese un código QR válido';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        }else{
            try {
                const response = await axios.post("/api/get-active-reservation-by-qr", {rutUser: rutUser}, { withCredentials: true });
                navigate('/confirm-reservation-final', { state: { recordReservation: response.data } } )
            }catch(error){
                setMessage({ text: error.response?.data?.message || 'Error al buscar el historial' });
            }
        }
        setIsLoading(false);
    }
    return(
        <div className="flex flex-col w-full gap-y-8 items-center">
            <div className="flex flex-col gap-y-0 px-16 items-center max-2xl:px-0">
                <h1 className="text-base max-md:text-sm text-center">Escanee el código QR que le otorgará el usuario para confirmar si tiene una reserva asociada:</h1>
                <div className="flex flex-col w-[350px] h-[350px] max-md:w-[200px] max-md:h-[200px] justify-center">
                    <QrReader onScan={handleScan}/>
                </div>
            </div>
            {isLoading ? (
                <ClipLoader color="#FFFFFF" size={24}/>
            ): (
                <>
                    {errors.rut && (
                        <div className="flex flex-row gap-x-2 justify-center items-center max-md:flex-col">
                            <TiWarning className="text-2xl text-red-600"/>
                            <p className='text-red-600 text-base max-md:text-center'>{errors.rut}</p>
                        </div>
                    )}
                    {message && (
                        <div className="flex flex-row gap-x-2 justify-center items-center max-md:flex-col">
                            <TiWarning className="text-2xl text-red-600"/>
                            <p className='text-red-600 text-base max-md:text-center'>{message.text}</p>
                        </div>
                    )}
                </>
            )}
            <div className="flex w-full flex-row items-center justify-center max-md:flex-col max-md:gap-y-4 max-md:mt-0">
                <button onClick={() => {navigate('/guard')}} className='flex flex-row max-md:text-xs p-3 max-md:p-2 bg-blue-ribbon-600 hover:bg-blue-ribbon-700 rounded-md font-bold w-fit max-sm:w-full text-white-50 items-center justify-center gap-x-2 max-md:gap-x-1 '>
                    <IoHome className="text-xl"/> VOLVER AL MENU PRINCIPAL
                </button>
            </div>
        </div>
    );
}
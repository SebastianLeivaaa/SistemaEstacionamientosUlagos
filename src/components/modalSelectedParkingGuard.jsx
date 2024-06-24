import React, {useState, useEffect} from 'react';
import { BsQuestionCircle, BsXCircle } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { FaCheck, FaUser } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { ClipLoader } from 'react-spinners';
import axios from "axios";
import { validateRut } from "../utils/validateRut"
import { TiWarning } from "react-icons/ti";

export const ModalSelectedParkingGuard = (props) => {

    const [formData, setFormData] = useState({
        vehiclePatente2: '',
        userRut: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(
             vehiclePatente2.value.toUpperCase(),
             userRut.value,
             props.parking.esta_id)

             
        setErrors({});
        setError(null);
        const newErrors = {};     
        if(!validateRut(userRut.value)){
            newErrors.userRut = 'El RUT no es válido';
        }
        if(vehiclePatente2.value.length !== 6){
            newErrors.vehiclePatente2 = 'La patente debe tener 6 caracteres';
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        }else{
            setIsLoading(true);
            try {
                const response = await axios.post(
                    '/api/reserve-parking-by-guard',
                    { parkingId: props.parking.esta_id, userRut: userRut.value.toUpperCase(), vehiclePatent: vehiclePatente2.value.toUpperCase(), guardRut: props.user.userRut },
                    { withCredentials: true }
                );
                if (response.status === 200) {
                    setSuccess(true);
                }
            } catch (error) {
                if (error.response.status === 400) {
                    setErrors({ activeReservation: error.response.data.error });
                } else {
                    setError(true);
                }
                console.log(error);
            }
            setIsLoading(false);
        }
    };

    
    return(
        <>  
            <div className="fixed flex flex-col items-center justify-center inset-0 overflow-y-auto w-fit max-xs:max-w-[95%] h-fit m-auto bg-white-50 dark:bg-midnight-950 rounded-lg p-8 gap-y-6 z-40">
                <div className='sticky w-full top-0 justify-end flex'>
                    <button onClick={props.closeModal} className="p-0 flex justify-end items-end"><RxCross2 className='text-2xl text-black dark:text-white-50'/></button>
                </div>
                <p className="text-center mt-4 text-gray-700 dark:text-gray-400 text-lg font-bold max-md:text-base mb-">
                    Para Otorgar un estacionamiento es necesario que complete los siguienes datos: 
                </p>
                <form className="flex flex-row w-full gap-x-8 max-xl:gap-x-2 max-md:flex-col gap-y-4 justify-start  mt-0">

                    <div className="col-span-2 flex flex-row max-lg:w-full items-center gap-x-2 max-md:flex-col max-xl:gap-y-2 max-xl:items-center max-md:items-start">
                        <label className="w-fit font-semibold text-xl max-xl:text-base max-md:text-base text-black dark:text-white-50">Rut:</label>
                        <input
                            type='text'
                            id='userRut'
                            onChange={handleChange}
                            value={formData.userRut}
                            maxLength='10'
                            name='userRut'
                            className='p-1 max-md:w-[100%] bg-gray-100 dark:bg-gray-700 text-black dark:text-white-50 border-[0.5px] border-midnight-700'
                            placeholder='Ej:12870631-3'
                        />
                    </div>

                    <div className="col-span-2 flex flex-row max-lg:w-full items-center gap-x-2 max-md:flex-col max-xl:gap-y-2 max-xl:items-center max-md:items-start">
                        <label className="w-fit font-semibold text-xl max-xl:text-base max-md:text-base text-black dark:text-white-50">Patente:</label>
                        <input
                            type='text'
                            id='vehiclePatente2'
                            onChange={handleChange}
                            value={formData.vehiclePatente2}
                            maxLength='6'
                            name='vehiclePatente2'
                            className='p-1 max-md:w-[100%] bg-gray-100 dark:bg-gray-700 text-black dark:text-white-50 border-[0.5px] border-midnight-700'
                            placeholder='Ej:GGXX20'
                        />
                    </div>
                    <button onClick={handleSubmit} className='flex flex-row w-fit max-md:w-full max-md:mt-4 gap-x-1 items-center justify-center bg-midnight-700 hover:bg-midnight-800 rounded-md font-bold p-1.5 px-3 text-white-50'>
                        {isLoading ? (<ClipLoader color="#FFFFFF" size={24}/>) : (<FaUser className="text-2xl"/>)}  Otorgar
                    </button>
                </form>
                <div className='flex flex-col justify-start items-start'>
                    {errors.userRut && (
                        <p className='p-2 rounded flex flex-row text-lg gap-x-1 gap-y-1 max-xs:text-sm justify-center items-center text-center dark:text-yellow-500 text-red-600'>
                            <TiWarning className='text-2xl'/> {errors.userRut}
                        </p>
                    )}
                    {errors.vehiclePatente2 && (
                        <p className='p-2 rounded flex flex-row text-lg gap-x-1 gap-y-1 max-xs:text-sm justify-center items-center text-center dark:text-yellow-500 text-red-600'>
                            <TiWarning className='text-2xl'/> {errors.vehiclePatente2}
                        </p>
                    )}
                    {errors.activeReservation && (
                        <p className='p-2 rounded flex flex-row text-lg gap-x-1 gap-y-1 max-xs:text-sm justify-center items-center text-center dark:text-yellow-500 text-red-600'>
                            <TiWarning className='text-2xl'/> {errors.activeReservation}
                        </p>
                    )}
                    {error && (
                        <p className='p-2 rounded flex flex-row text-lg gap-x-1 gap-y-1 max-xs:text-sm justify-center items-center text-center dark:text-yellow-500 text-red-600'>
                            <TiWarning className="text-2xl"/> Ha ocurrido un error al hacer la solicitud
                        </p>
                    )}
                    {success && (
                        <div className="fixed flex flex-col items-center justify-center inset-0 overflow-y-auto w-fit max-w-[40%] max-lg:max-w-[75%] max-xs:max-w-[95%] h-fit m-auto bg-white-50 dark:bg-midnight-950 rounded-lg p-8 gap-y-6 z-40">
                            <FaCheck className='text-9xl text-green-500'/>
                            <h1 className='text-center text-xl text-black dark:text-white-50 max-md:text-lg'>Se ha otorgado con éxito el estacionamiento {props.parking.esta_numero}</h1>
                            <div className='flex flex-row justify-center items-center gap-x-2 mt-2 max-xs:mt-2'>
                                <button onClick={() => {props.onCloseSection()}} className='bg-green-700 text-white-50 font-bold p-1.5 px-3 rounded-lg items-center flex flex-row gap-x-1'><FaCheck className='text-lg text-white-50'/> Aceptar</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

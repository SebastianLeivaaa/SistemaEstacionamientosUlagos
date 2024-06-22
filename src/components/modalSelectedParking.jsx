import React, {useState, useEffect} from 'react';
import { BsQuestionCircle } from "react-icons/bs";
import { FaCheck } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { BsXCircle } from "react-icons/bs";
import { ClipLoader } from 'react-spinners';
import axios from "axios";

export const ModalSelectedParking = (props) => {

    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showModalConfirmation, setShowModalConfirmation] = useState(false);

    const navigate = useNavigate();
    const registerReservation = async () => {
        setIsLoading(true);
        try{
            const response = await axios.post("http://localhost:3090/api/reserve-parking", { parkingId: props.parking.esta_id, userRut: props.infoUser.userRut, vehiclePatent: props.infoVehicleActive }, { withCredentials: true });
            if(response.status === 200){
                setShowModalConfirmation(true);
            }else{
                setError(true);
            }
        }catch(error){
            setError(true);
            console.log(error);
        }
        setIsLoading(false);
    };

    useEffect(() => {}, [showModalConfirmation]);

    return(
        <>
            {showModalConfirmation ? (
                <div className="fixed flex flex-col items-center justify-center inset-0 overflow-y-auto w-fit max-w-[40%] max-lg:max-w-[75%] max-xs:max-w-[95%] h-fit m-auto bg-white-50 dark:bg-midnight-950 rounded-lg p-8 gap-y-6 z-40">
                    <FaCheck className='text-9xl text-green-500'/>
                    <h1 className='text-center text-xl text-black dark:text-white-50 max-md:text-lg'>Reserva realizada con éxito.</h1>
                    <div className='flex flex-col gap-y-1.5'>
                        <p className="text-center mt-4 text-gray-700 dark:text-gray-400 text-lg font-bold max-md:text-base">
                            Para hacer válida tu reserva, por favor presenta tu código QR o proporciona tu RUT al guardia de seguridad al llegar.
                        </p>
                        <p className="text-center mt-4 text-gray-700 dark:text-gray-400 max-md:text-sm">
                            Recuerda que debes llegar antes del horario máximo de llegada para validar tu reserva. Si no llegas a tiempo, tu reserva se cancelará automáticamente.
                        </p>
                    </div>
                    <div className='flex flex-row justify-center items-center gap-x-2 mt-2 max-xs:mt-2'>
                        <button onClick={props.handleCurrentPage('/dashboard-user')} className='bg-green-700 text-white-50 font-bold p-1.5 px-3 rounded-lg items-center flex flex-row gap-x-1'><FaCheck className='text-lg text-white-50'/> Aceptar</button>
                    </div>
                </div>
            ) : (
                <div className="fixed flex flex-col items-center justify-center inset-0 overflow-y-auto w-fit max-xs:max-w-[95%] h-fit m-auto bg-white-50 dark:bg-midnight-950 rounded-lg p-8 gap-y-6 z-40">
                    {error ? (
                        <>
                            <BsXCircle className='text-9xl text-red-500'/>
                            <h1 className='text-center text-xl text-black dark:text-white-50 max-md:text-lg'>Ha ocurrido un error al intentar reservar el estacionamiento N° {props.parking.esta_numero}.</h1>
                            <div className='flex flex-row justify-center items-center gap-x-4 mt-4 max-xs:mt-2'>
                                <button onClick={props.closeModal} className='bg-red-500 text-white-50 font-bold p-1.5 px-3 rounded-lg items-center flex flex-row gap-x-1'><FaX/> Cerrar</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <BsQuestionCircle className='text-9xl text-yellow-500'/>
                            <h1 className='text-center text-xl text-black dark:text-white-50 max-md:text-lg'>¿Estas seguro que deseas reservar el estacionamiento N° {props.parking.esta_numero}?</h1>
                            <div className='flex flex-row justify-center items-center gap-x-4 mt-4 max-xs:mt-2'>
                                <button onClick={registerReservation} className='bg-green-700 text-white-50  font-bold p-1.5 px-3 rounded-lg items-center flex flex-row gap-x-1'> {isLoading ? (<ClipLoader color="#FFFFFF" size={24}/>) : (<FaCheck/>)} Confirmar</button>
                                <button onClick={props.closeModal} className='bg-red-500 text-white-50 font-bold p-1.5 px-3 rounded-lg items-center flex flex-row gap-x-1'><FaX/> Cancelar</button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
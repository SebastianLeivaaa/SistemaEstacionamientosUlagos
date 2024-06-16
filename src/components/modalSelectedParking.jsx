import React, {useState} from 'react';
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

    const navigate = useNavigate();
    const registerReservation = async () => {
        setIsLoading(true);
        try{
            const response = await axios.post("/api/reserve-parking", { parkingId: props.parking.esta_id, userRut: props.infoUser.userRut, vehiclePatent: props.infoVehicleActive }, { withCredentials: true });
            if(response.status === 200){
                navigate('/reserve-success', { state: { parking: props.parking.esta_numero, timeReservation: response.data.timeReservation, vehiclePatent: props.infoVehicleActive } });
            }else{
                setError(true);
            }
        }catch(error){
            setError(true);
            console.log(error);
        }
        setIsLoading(false);
    };

    return(
        <div className="fixed flex flex-col items-center justify-center inset-0 overflow-y-auto w-fit h-fit m-auto bg-white-50 rounded-lg p-8 gap-y-6">
            {error ? (
                <>
                    <BsXCircle className='text-9xl text-red-500'/>
                    <h1 className='text-center text-xl'>Ha ocurrido un error al intentar reservar el estacionamiento N° {props.parking.esta_numero}.</h1>
                    <div className='flex flex-row justify-center items-center gap-x-4 mt-4'>
                        <button onClick={props.closeModal} className='bg-red-500 text-white-50 font-bold p-1.5 px-3 rounded-lg items-center flex flex-row gap-x-1'><FaX/> Cerrar</button>
                    </div>
                </>
            ) : (
                <>
                    <BsQuestionCircle className='text-9xl text-yellow-500'/>
                    <h1 className='text-center text-xl'>¿Estas seguro que deseas reservar el estacionamiento N° {props.parking.esta_numero}?</h1>
                    <div className='flex flex-row justify-center items-center gap-x-4 mt-4'>
                        <button onClick={registerReservation} className='bg-green-700 text-white-50  font-bold p-1.5 px-3 rounded-lg items-center flex flex-row gap-x-1'> {isLoading ? (<ClipLoader color="#FFFFFF" size={24}/>) : (<FaCheck/>)} Confirmar</button>
                        <button onClick={props.closeModal} className='bg-red-500 text-white-50 font-bold p-1.5 px-3 rounded-lg items-center flex flex-row gap-x-1'><FaX/> Cancelar</button>
                    </div>
                </>
            )}
        </div>
    );
}
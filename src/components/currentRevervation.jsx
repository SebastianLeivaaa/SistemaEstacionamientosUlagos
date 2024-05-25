import React, {useState} from "react";
import { UserQR } from "./userQR";
import { formatTimeTwo } from "../utils/formatTimeTwo.js";
import { formatDateTwo } from "../utils/formatDateTwo.js";
import { FaTrashAlt } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { IoHome } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import axios from "axios";



export const CurrentReservation = (props) => {

    const navigate = useNavigate();

    const userMenu = () => {
        navigate('/user');
    }

    const [showConfirmation, setShowConfirmation] = useState(false);

    const deleteReservation = async () => {
        try {
            const response = await axios.post('/api/delete-reservation', { userRut: props.userRut }, { withCredentials: true });
            if (response.status === 200) {
                props.refreshReservations();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const confirmDelete = () => {
        setShowConfirmation(!showConfirmation);
    }


    return (
        <div className="flex flex-col w-full gap-y-12">
            <div className="flex flex-row w-full items-center max-md:flex-col max-md:gap-y-6">
                <div className="flex flex-col items-center justify-center w-[40%] max-md:w-[100%]">
                    <UserQR rut={props.userRut}/>
                    <h1 className="text-lg max-md:text-base font-bold italic">TU CÓDIGO QR</h1>
                </div>
                <div className="w-[60%] flex flex-col gap-y-4 max-md:w-[100%]">
                    <h1 className="text-lg max-md:text-base font-bold italic">N° ESTACIONAMIENTO: {props.numeroEstacionamiento}</h1>
                    <h1 className="text-lg max-md:text-base font-bold italic">FECHA: {formatDateTwo(props.fecha)}</h1>
                    <h1 className="text-lg max-md:text-base font-bold italic">HORARIO MÁXIMO DE LLEGADA: {formatTimeTwo(props.horaInicio)}</h1>
                    <h1 className="text-lg max-md:text-base font-bold italic">VEHICULO: {props.patente}</h1>
                </div>
            </div>
            <h1 className="text-lg max-md:text-base font-bold italic text-center">PRESENTE EL CÓDIGO AL GUARDIA AL INGRESAR</h1>
            {!showConfirmation ? (
                <div className="flex flex-row justify-around max-md:flex-col max-md:items-center max-md:gap-y-6">
                    <button onClick={confirmDelete}  className='flex flex-row p-3 bg-red-500 hover:bg-red-700 rounded-md font-bold w-fit max-md:w-full max-md:justify-center text-white-50 items-center gap-x-2'>
                        <FaTrashAlt className="text-xl"/> CANCELAR RESERVA
                    </button>
                    <button onClick={userMenu}  className='flex flex-row p-3 bg-blue-ribbon-600 hover:bg-blue-ribbon-700 rounded-md font-bold w-fit max-md:w-full text-white-50 items-center gap-x-2 '>
                        <IoHome className="text-2xl"/> VOLVER AL MENU PRINCIPAL
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-y-8 font-bold italic">
                    <h1 className="text-center text-xl">¿Estas seguro que quieres cancelar esta reserva?</h1>
                    <div className="flex flex-row justify-center gap-x-16">
                        <button onClick={deleteReservation}  className='flex flex-row py-3 px-8 bg-red-500 hover:bg-red-700 rounded-md font-bold  text-white-50 items-center gap-x-2'>
                            <FaCheck className="text-xl"/> SI
                        </button>
                        <button onClick={confirmDelete}  className='flex flex-row py-3 px-8 bg-blue-ribbon-600 hover:bg-blue-ribbon-700 rounded-md font-bold text-white-50 items-center gap-x-2 '>
                            <FaX className="text-2xl"/> NO
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
import React, { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { formatDate } from "../utils/formatDate";
import { TiArrowSortedDown } from "react-icons/ti";
import { TiArrowSortedUp } from "react-icons/ti";

export const RecordReservationDataGuard = (props) => {
    const [showReservation, setShowReservation] = useState(props.firstRecord);


    const handleShowReservation = () => {
        setShowReservation(!showReservation);
    }

    return (
        <div key={props.index} className="flex flex-col shadow-3xl shadow-gray-800 w-[75%] max-md:w-[100%] rounded-2xl items-center">
                <button onClick={handleShowReservation} className="flex flex-row w-full rounded-t-lg p-4 max-md:p-3 bg-blue-ribbon-600 text-white-50 justify-between">
                    <span className="flex flex-row items-center gap-x-4 max-md:gap-x-2 font-semibold">
                        <FaCalendarAlt className="text-2xl max-md:text-base"/>
                        <h1 className="text-lg max-md:text-sm">{formatDate(props.fecha)}</h1>
                    </span>
                    {showReservation ? <TiArrowSortedUp className='text-3xl'/> : <TiArrowSortedDown className='text-3xl'/>}
                </button>
                {showReservation && (
                    <div className="grid grid-cols-2 gap-x-16 items-center gap-y-4 w-full p-8 max-md:p-4 rounded-b-2xl border-[1px] border-alabaster-600  bg-alabaster-50 text-outer-space-900 font-semibold">
                        <h1 className='text-lg max-md:text-sm'>Patente</h1>
                        <h1 className='text-lg max-md:text-sm'>{props.patente}</h1>
                        <h1 className='text-lg max-md:text-sm'>RUT</h1>
                        <h1 className='text-lg max-md:text-sm'>{props.rut}</h1>
                        <h1 className='text-lg max-md:text-sm'>Nombre</h1>
                        <h1 className='text-lg max-md:text-sm'>{props.nombre}</h1>
                        <h1 className='text-lg max-md:text-sm'>Apellidos</h1>
                        <h1 className='text-lg max-md:text-sm'>{props.apellidoPat} {props.apellidoMat}</h1>
                        <h1 className='text-lg max-md:text-sm'>Hora llegada</h1>
                        <h1 className='text-lg max-md:text-sm'>{props.horaLlegada}</h1>
                        <h1 className='text-lg max-md:text-sm'>Hora salida</h1>
                        <h1 className='text-lg max-md:text-sm'>{props.horaSalida}</h1>
                        <h1 className='text-lg max-md:text-sm'>N° Estacionamiento</h1>
                        <h1 className='text-lg max-md:text-sm'>{props.numeroEstacionamiento}</h1>
                        <h1 className='text-lg max-md:text-sm'>Tipo</h1>
                        <h1 className='text-lg max-md:text-sm'>{props.tipo}</h1>
                    </div>
                )}
            </div>
    );
}
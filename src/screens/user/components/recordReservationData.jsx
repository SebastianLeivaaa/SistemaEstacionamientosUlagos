import React, { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { formatDate } from "../../../utils/formatDate";
import { formatDateTwo } from "../../../utils/formatDateTwo";
import { TiArrowSortedDown } from "react-icons/ti";
import { TiArrowSortedUp } from "react-icons/ti";
import axios from "axios";


export const RecordReservationData = ({ patente, fecha, horaLlegada, horaSalida, fechaSalida, numeroEstacionamiento }) => {
    const [showReservation, setShowReservation] = useState();
    

    return (
        <>
            
            <div  className="flex flex-col shadow-3xl shadow-midnight-800 w-full rounded-2xl items-center">
                <div className="flex flex-row w-full rounded-t-lg p-3 max-md:p-3 bg-midnight-800 text-white-50 justify-between">
                    <span className="flex flex-row items-center gap-x-4 max-md:gap-x-2 font-semibold">
                        <FaCalendarAlt className="text-2xl max-md:text-base"/>
                        <h1 className="text-base max-md:text-sm">{formatDate(fecha)}</h1>
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-x-8 items-center gap-y-0.5 w-full p-3 max-md:p-4 rounded-b-2xl text-black bg-white-100 dark:bg-bay-of-many-900 dark:text-white-50 font-semibold">
                    <h1 className='text-base max-md:text-sm'>Patente</h1>
                    <h1 className='text-base max-md:text-sm'>{patente}</h1>
                    <h1 className='text-base max-md:text-sm'>Hora llegada</h1>
                    <h1 className='text-base max-md:text-sm'>{horaLlegada}</h1>
                    <h1 className='text-base max-md:text-sm'>Hora salida</h1>
                    <h1 className='text-base max-md:text-sm'>{horaSalida}</h1>
                    <h1 className='text-base max-md:text-sm'>Fecha salida</h1>
                    <h1 className='text-base max-md:text-sm'>{fechaSalida !== null && (formatDateTwo(fechaSalida))}</h1>
                    <h1 className='text-base max-md:text-sm'>N° Estacionamiento</h1>
                    <h1 className='text-base max-md:text-sm'>{numeroEstacionamiento}</h1>
                </div>
            </div>
        </>
    );
}

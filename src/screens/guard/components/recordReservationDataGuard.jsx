import React, { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { formatDate } from "../../../utils/formatDate";
import { formatDateTwo } from "../../../utils/formatDateTwo";


export const RecordReservationDataGuard = (props) => {


    return (
        <div className="flex flex-col shadow-3xl shadow-midnight-800 w-full rounded-2xl items-center">
                <div className="flex flex-row w-full rounded-t-lg p-3 max-md:p-3 bg-midnight-800 text-white-50 justify-between">
                    <span className="flex flex-row items-center gap-x-4 max-md:gap-x-2 font-semibold">
                        <FaCalendarAlt className="text-2xl max-md:text-base"/>
                        <h1 className="text-base max-md:text-sm">{formatDate(props.fecha)}</h1>
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-x-8 items-center gap-y-0.5 w-full p-3 max-md:p-4 rounded-b-2xl text-black bg-white-100 dark:bg-bay-of-many-900 dark:text-white-50 font-semibold">
                    <h1 className='text-base max-md:text-sm'>Patente</h1>
                    <h1 className='text-base max-md:text-sm'>{props.patente}</h1>
                    <h1 className='text-base max-md:text-sm'>RUT</h1>
                    <h1 className='text-base max-md:text-sm'>{props.rut}</h1>
                    <h1 className='text-base max-md:text-sm'>Nombre</h1>
                    <h1 className='text-base max-md:text-sm'>{props.nombre}</h1>
                    <h1 className='text-base max-md:text-sm'>Apellidos</h1>
                    <h1 className='text-base max-md:text-sm'>{props.apellidoPat} {props.apellidoMat}</h1>
                    <h1 className='text-base max-md:text-sm'>Hora llegada</h1>
                    <h1 className='text-base max-md:text-sm'>{props.horaLlegada}</h1>
                    <h1 className='text-base max-md:text-sm'>Hora salida</h1>
                    <h1 className='text-base max-md:text-sm'>{props.horaSalida}</h1>
                    <h1 className='text-base max-md:text-sm'>Fecha salida</h1>
                    <h1 className='text-base max-md:text-sm'>{props.fechaSalida !== null && (formatDateTwo(props.fechaSalida))}</h1>
                    <h1 className='text-base max-md:text-sm'>N° Estacionamiento</h1>
                    <h1 className='text-base max-md:text-sm'>{props.numeroEstacionamiento}</h1>
                    <h1 className='text-base max-md:text-sm'>Tipo</h1>
                    <h1 className='text-base max-md:text-sm'>{props.tipo}</h1>
                </div>
            </div>
    );
}
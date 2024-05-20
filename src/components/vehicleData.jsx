import React, { useState } from 'react';
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { Datos } from './datos';

export const VehicleData = ( props ) => {

    const [edit, setEdit] = useState(true);
    const [vehicleData, setVehicleData] = useState({
        patente: props.patente,
        marca: props.marca,
        modelo: props.modelo,
        anio: props.anio,
        color: props.color,
        tipo: props.tipo
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVehicleData({
            ...vehicleData,
            [name]: value
        });
    }

    return(
        <div className='grid grid-cols-2 gap-x-16 gap-y-8'>
            <div className='col-span-2'>
                <h1 className='text-2xl'>Vehículo {props.index}</h1>
            </div>
            <div className='flex flex-col gap-y-2'>
                <label className='text-xl'>Patente</label>
                <input id='patente' name='patente' maxLength="6" type='text' onChange={handleChange} placeholder='Ej:GGXX20' value={vehicleData.patente} className='w-full p-2 border-[0.5px] border-blue-ribbon-600' disabled={edit}></input>
            </div>
            <div className='flex flex-col gap-y-2'>
                <label className='text-xl'>Marca</label>
                <input id='marca' name='marca' type='text' maxLength='30' onChange={handleChange} placeholder='Ej:Chevrolet' value={vehicleData.marca} className='w-full p-2 border-[0.5px] border-blue-ribbon-600' disabled={edit}></input>
            </div>
            <div className='flex flex-col gap-y-2'>
                <label className='text-xl'>Modelo</label>
                <input id='modelo' name='modelo' type='text' maxLength='30' onChange={handleChange} placeholder='Ej:Sail' value={vehicleData.modelo} className='w-full p-2 border-[0.5px] border-blue-ribbon-600' disabled={edit}></input>
            </div>
            <div className='flex flex-col gap-y-2'>
                <label className='text-xl'>Año</label>
                <input id='anio' name='anio' type='number' maxLength='4' onChange={handleChange} placeholder='Ej:2014' value={vehicleData.anio} className='hidden-number-input appearance-none w-full p-2 border-[0.5px] border-blue-ribbon-600' disabled={edit}></input>
            </div>
            <div className='flex flex-col gap-y-2'>
                <label className='text-xl'>Color</label>
                <input id='color' name='color' type='text' maxLength='20' onChange={handleChange} placeholder='Ej:Azul' value={vehicleData.color} className='w-full p-2 border-[0.5px] border-blue-ribbon-600' disabled={edit}></input>
            </div>
            <div className='flex flex-col gap-y-2'>
                <label className='text-xl'>Tipo vehículo</label>
                <select onChange={handleChange} placeholder='Automovil' value={vehicleData.tipo} className='w-full p-2 border-[0.5px] border-blue-ribbon-600' disabled={edit}>
                    <option value="Automovil">Automovil</option>
                    <option value="Camioneta">Camioneta</option>
                    <option value="Furgón">Furgón</option>
                    <option value="Jeep">Jeep</option>
                    <option value="Motocicleta">Motocicleta</option>
                </select>
            </div>
            <div className='col-span-2 flex items-end gap-x-8 px-8 justify-end w-full'>
                <button onClick={() => {setEdit(!edit)}} className='text-white-50 rounded-md bg-blue-ribbon-600 hover:bg-blue-ribbon-700 p-1.5 px-3 flex flex-row items-center gap-x-1 font-bold'> <MdEdit/> Editar </button>
                <button className='text-white-50 rounded-md bg-red-500 hover:bg-blue-ribbon-700 p-1.5 px-3 flex flex-row items-center gap-x-1 font-bold'><FaTrashAlt/> Eliminar</button>
            </div>
        </div>
    );
}
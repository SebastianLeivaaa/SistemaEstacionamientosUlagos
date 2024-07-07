import React, { useState, useEffect } from "react";
import axios from 'axios'
import { MdLocalParking } from "react-icons/md";


export const Capacity = () => {

    const [parkingSpaces, setParkingSpaces] = useState(null);
    const [parkingSpaces2, setParkingSpaces2] = useState(null);

    const getParkingSpaces2 = async () => {
        try{
            const response = await axios.get("/api/parkingSpaces2", {withCredentials: true});
            setParkingSpaces2(response.data.total_libres);
        }catch(error){
            console.log(error);
        }
    }
    useEffect(() => {
        getParkingSpaces2();
        const interval = setInterval(() => {
            getParkingSpaces2();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const getParkingSpaces = async () => {
        try{
            const response = await axios.get("/api/parkingSpaces", {withCredentials: true});
            setParkingSpaces(response.data.total_libres);
        }catch(error){
            console.log(error);
        }
    }
    useEffect(() => {
        getParkingSpaces();
        const interval = setInterval(() => {
            getParkingSpaces();
        }, 10000);

        return () => clearInterval(interval);
    }, []);



    const porcentaje = parseFloat(parkingSpaces2).toFixed(2);

    const bgColor = porcentaje < 30 ? 'bg-red-500' : porcentaje < 50 ? 'bg-yellow-600' : 'bg-green-700';

    return (
        <>
           
            <div className="dark:bg-midnight-950 bg-white-50 shadow-3xl  contrast-[95%] rounded-md p-8 max-md:p-4 w-full flex flex-col gap-y-8 max-md:gap-y-4 text-white-50 font-bold text-xl">
                <h1 className="dark:text-white-50 text-black font-bold text-2xl flex flex-row gap-x-2 items-center"><MdLocalParking className="text-3xl text-black dark:text-white-50" />Estacionamientos</h1>
                <div className="flex flex-row gap-x-8">
                    <div className={`flex flex-col p-2 py-4 max-md:py-2 ${bgColor} rounded-md w-full h-full items-center`}>
                        <h1 className="text-white-50 text-xl font-bold text-center max-md:text-base max-sm:text-xs">Capacidad</h1>
                        <span className="text-white-50 font-bold text-4xl max-md:text-2xl max-sm:text-base">
                            {porcentaje !== null && !isNaN(porcentaje) ? `${porcentaje}%` : 'Cargando...'}
                        </span>
                    </div>
                    <div className={`flex flex-col p-2 py-4 max-md:py-2 ${bgColor} rounded-md w-full h-full items-center`}>
                        <h1 className="text-white-50 text-xl font-bold text-center max-md:text-base max-sm:text-xs">Libres</h1>
                        <span className="text-white-50 font-bold text-4xl max-md:text-2xl max-sm:text-base">
                            {parkingSpaces !== null ? parkingSpaces : 'Cargando...'}
                        </span>
                    </div>

                </div>
            </div>
            
        </>
    );
}
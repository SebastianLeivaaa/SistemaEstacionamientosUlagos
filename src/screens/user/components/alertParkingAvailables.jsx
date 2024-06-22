import React, { useState, useEffect } from "react";
import { TiWarning } from "react-icons/ti";
import axios from "axios";


export const AlertParkingAvailables = () => {

    const [parkingSpaces, setParkingSpaces] = useState(null);
    const getParkingSpaces = async () => {
        try{
            const response = await axios.get("http://localhost:3090/api/parkingSpaces", {withCredentials: true});
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

    const textColor = parkingSpaces <= 15 ? 'text-red-500' : 'text-green-700';

    return(
        <div className="dark:bg-midnight-950 bg-white-50 shadow-3xl  contrast-[95%] rounded-md p-8 max-md:p-4 w-full flex flex-col gap-y-2 max-md:gap-y-0 items-center">
            {parkingSpaces !== null && parkingSpaces <= 15 && (
                <h1 className={`flex flex-row gap-x-2 items-center text-3xl font-bold text-center max-md:text-xl ${textColor}`}>
                    <TiWarning className="text-4xl max-md:text-2xl" /> ATENCIÓN
                </h1>
            )}
            <h1 className={`text-3xl font-bold text-center max-md:text-xl ${textColor}`}>
                ¡QUEDAN {parkingSpaces !== null ? parkingSpaces : 'Cargando...'} ESTACIONAMIENTOS DISPONIBLES!
            </h1>
        </div>
    );
};
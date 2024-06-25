import React, { useState, useEffect } from "react";
import axios from "axios";
import { FcStatistics } from "react-icons/fc";

export const Statistics = ( ) => {

    const [statistics, setStatistics] = useState([]);
    const getStatistics = async () => {
        try {
            const response = await axios.get('/api/get-statistics', { withCredentials: true });
            setStatistics(response.data);
         } catch (error) {
             console.log(error);
         }
       };

      

    useEffect(() => {
        getStatistics();
        const interval = setInterval(() => {
            getStatistics();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return(
        <div className="dark:bg-midnight-950 bg-white-50 shadow-3xl  contrast-[95%] rounded-md p-8 max-md:p-4 w-full flex flex-col gap-y-8 max-md:gap-y-4">
            <h1 className="dark:text-white-50 text-black font-bold text-2xl flex flex-row gap-x-2 items-center"><FcStatistics className="text-3xl text-black dark:text-white-50"/>Estadísticas</h1>
            <div className="flex flex-row gap-x-8 w-full justify-start max-lg:grid max-lg:grid-cols-4 max-md:grid-cols-2 max-lg:gap-x-2 max-md:gap-x-2 gap-y-3">
                <div className="flex flex-col p-2 bg-gray-600 rounded-md w-full h-full items-center">
                    <h1 className="text-white-50 text-xl font-bold text-center max-md:text-base max-sm:text-xs">Reservas Activas</h1>
                    <div className="w-full h-full flex justify-center items-center">
                        {statistics.reservationsActive ? (
                            <span className="text-white-50 font-bold text-4xl max-md:text-2xl max-sm:text-base">{statistics.reservationsActive}</span>
                        ) : (
                            <span className="text-white-50 font-bold">--</span>
                        )}
                    </div>
                </div>
                <div className="flex flex-col p-2 bg-gray-600 rounded-md w-full h-full items-center">
                    <h1 className="text-white-50 text-xl font-bold text-center max-md:text-base max-sm:text-xs">Reservas Hoy</h1>
                    <div className="w-full h-full flex justify-center items-center">
                        {statistics.reservationToday ? (
                            <span className="text-white-50 font-bold text-4xl max-md:text-2xl max-sm:text-base">{statistics.reservationToday}</span>
                        ) : (
                            <span className="text-white-50 font-bold">--</span>
                        )}
                    </div>
                </div>
                <div className="flex flex-col p-2 bg-gray-600 rounded-md w-full h-full items-center">
                    <h1 className="text-white-50 text-xl font-bold text-center max-md:text-base max-sm:text-xs">Reservas Mes</h1>
                    <div className="w-full h-full flex justify-center items-center">
                        {statistics.reservationMonth ? (
                            <span className="text-white-50 font-bold text-4xl max-md:text-2xl max-sm:text-base">{statistics.reservationMonth}</span>
                        ) : (
                            <span className="text-white-50 font-bold">--</span>
                        )}
                    </div>
                </div>
                <div className="flex flex-col p-2 bg-gray-600 rounded-md w-full h-full items-center">
                    <h1 className="text-white-50 text-xl font-bold text-center max-md:text-base max-sm:text-xs">Ocupación</h1>
                    <div className="w-full h-full flex justify-center items-center">
                        {statistics.occupationPercentage ? (
                            <span className="text-white-50 font-bold text-4xl max-md:text-2xl max-sm:text-base">{parseFloat(statistics.occupationPercentage, 10).toFixed(2)}%</span>
                        ) : (
                            <span className="text-white-50 font-bold">--</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
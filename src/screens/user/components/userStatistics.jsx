import React, { useState, useEffect } from "react";
import axios from "axios";
import { FcStatistics } from "react-icons/fc";

export const UserStatistics = ( { user } ) => {

    const [statistics, setStatistics] = useState([]);
    const getStatistics = async (userRut) => {
        try {
            const response = await axios.post('http://localhost:3090/api/get-user-statistics', { userRut }, { withCredentials: true });
            setStatistics(response.data);
        } catch (error) {
            console.log(error);
        }
      };

      

    useEffect(() => {
        getStatistics(user.userRut);
    }, [statistics]);

    return(
        <div className="dark:bg-midnight-950 bg-white-50 shadow-3xl  contrast-[95%] rounded-md p-8 max-md:p-4 w-full flex flex-col gap-y-8 max-md:gap-y-4">
            <h1 className="dark:text-white-50 text-black font-bold text-2xl flex flex-row gap-x-2 items-center"><FcStatistics className="text-3xl text-black dark:text-white-50"/> Tus estadísticas</h1>
            <div className="flex flex-row gap-x-8 w-full justify-start max-lg:grid max-lg:grid-cols-4 max-md:grid-cols-2 max-lg:gap-x-2 max-md:gap-x-2 gap-y-3">
                <div className="flex flex-col p-2 bg-gray-600 rounded-md w-full h-full items-center">
                    <h1 className="text-white-50 text-xl font-bold text-center max-md:text-base max-sm:text-xs">Reservas este mes</h1>
                    <div className="w-full h-full flex justify-center items-center">
                        {statistics.reservationsThisMonth ? (
                            <span className="text-white-50 font-bold text-4xl max-md:text-2xl max-sm:text-base">{statistics.reservationsThisMonth}</span>
                        ) : (
                            <span className="text-white-50 font-bold">--</span>
                        )}
                    </div>
                </div>
                <div className="flex flex-col p-2 bg-gray-600 rounded-md w-full h-full items-center">
                    <h1 className="text-white-50 text-xl font-bold text-center max-md:text-base max-sm:text-xs">Sección favorita</h1>
                    <div className="w-full h-full flex justify-center items-center">
                        {statistics.mostUsedSection ? (
                            <span className="text-white-50 font-bold text-4xl max-md:text-2xl max-sm:text-base">{statistics.mostUsedSection.split(' ')[1]}</span>
                        ) : (
                            <span className="text-white-50 font-bold">--</span>
                        )}
                    </div>
                </div>
                <div className="flex flex-col p-2 bg-gray-600 rounded-md w-full h-full items-center">
                    <h1 className="text-white-50 text-xl font-bold text-center max-md:text-base max-sm:text-xs">Promedio de horas</h1>
                    <div className="w-full h-full flex justify-center items-center">
                        {statistics.averageHoursPerReservation ? (
                            <span className="text-white-50 font-bold text-4xl max-md:text-2xl max-sm:text-base">{parseFloat(statistics.averageHoursPerReservation, 10).toFixed(2)}</span>
                        ) : (
                            <span className="text-white-50 font-bold">--</span>
                        )}
                    </div>
                </div>
                <div className="flex flex-col p-2 bg-gray-600 rounded-md w-full h-full items-center">
                    <h1 className="text-white-50 text-xl font-bold text-center max-md:text-base max-sm:text-xs">Reservas totales</h1>
                    <div className="w-full h-full flex justify-center items-center">
                        {statistics.totalReservations? (
                            <span className="text-white-50 font-bold text-4xl max-md:text-2xl max-sm:text-base">{statistics.totalReservations}</span>
                        ) : (
                            <span className="text-white-50 font-bold">--</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
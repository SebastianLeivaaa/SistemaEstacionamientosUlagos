import React from 'react';
import { MdLocalParking, MdHistory, MdDirectionsCarFilled, MdLogout } from "react-icons/md";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { MdFolderOpen } from "react-icons/md";

export const QuickAccess = ( { handleCurrentPage }) => {

    const navigate = useNavigate();
    
    const logOut = async () => {
        const response = await axios.get("/api/logout", { withCredentials: true });
        navigate('/');
    }

    return(
        <div className="dark:bg-midnight-950 bg-white-50 shadow-3xl  contrast-[95%] rounded-md p-8 max-md:p-4 w-full flex flex-col gap-y-8 max-md:gap-y-4">
            <h1 className="dark:text-white-50 text-black font-bold text-2xl flex flex-row gap-x-2 items-center"><MdFolderOpen className="text-3xl text-black dark:text-white-50"/> Accesos rápidos</h1>
            <div className="flex flex-row gap-x-8 w-full justify-start max-lg:grid max-lg:grid-cols-4 max-md:grid-cols-2 max-lg:gap-x-2 max-md:gap-x-2 gap-y-3">
                <button onClick={() => {handleCurrentPage('/reserve-parking')}} className='flex flex-col p-2 py-6 max-md:py-2 bg-midnight-800 hover:bg-midnight-900 rounded-md w-full h-full justify-center items-center max-md:gap-y-0'>
                    <MdLocalParking className="text-4xl text-white-50 max-sm:text-2xl"/>
                    <h1 className="text-white-50 text-xl font-bold text-center max-lg:text-base max-sm:text-xs">Reservar parking</h1>
                </button>
                <button onClick={() => {handleCurrentPage('/my-reservations')}} className='flex flex-col p-2 py-6 max-md:py-2 bg-midnight-800 hover:bg-midnight-900 rounded-md w-full h-full justify-center items-center max-md:gap-y-0'>
                    <MdHistory className="text-4xl text-white-50 max-sm:text-2xl"/>
                    <h1 className="text-white-50 text-xl font-bold text-center max-lg:text-base max-sm:text-xs">Mis reservas</h1>
                </button>
                <button onClick={() => {handleCurrentPage('/my-vehicles')}} className='flex flex-col p-2 py-6 max-md:py-2 bg-midnight-800 hover:bg-midnight-900 rounded-md w-full h-full justify-center items-center max-md:gap-y-0'>
                    <MdDirectionsCarFilled className="text-4xl text-white-50 max-sm:text-2xl"/>
                    <h1 className="text-white-50 text-xl font-bold text-center max-lg:text-base max-sm:text-xs">Mis vehículos</h1>
                </button>
                <button onClick={logOut} className='flex flex-col p-2 py-6 max-md:py-2 bg-red-500 hover:bg-red-600 rounded-md w-full h-full justify-center items-center max-md:gap-y-0'>
                    <MdLogout className="text-4xl text-white-50 max-sm:text-2xl"/>
                    <h1 className="text-white-50 text-xl font-bold text-center max-lg:text-base max-sm:text-xs">Cerrar sesión</h1>
                </button>
            </div>
        </div>
    );
}
import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdLocalParking, MdDirectionsCarFilled } from "react-icons/md";
// import { UserQR } from "../../../components/userQR";
// import { formatTime } from "../../../utils/formatTime";
// import { LuCalendarClock } from "react-icons/lu";
// import { FaCheck } from "react-icons/fa";
// import { FaX } from "react-icons/fa6";
// import { BsQuestionCircle } from "react-icons/bs";
// import { ClipLoader } from "react-spinners";
// import { BsXCircle } from "react-icons/bs";
// import { BsCheckCircle } from "react-icons/bs";
// import { FaTimes } from "react-icons/fa";



export const CurrentReservation = ({ user }) => {

    const [parkingSpaces, setParkingSpaces] = useState(null);
    const [reservations, setReservations] = useState(null);
    const [inactiveReservations, setInactiveReservations] = useState(null);
    const [takenReservations, setTakenReservations] = useState(null);

    const getParkingSpaces = async () => {
        try{
            const response = await axios.get("http://localhost:3090/api/parkingSpaces", {withCredentials: true});
            setParkingSpaces(response.data.total_libres);
        }catch(error){
            console.log(error);
        }
    }
    const getReservations = async () => {
        try{
            const response = await axios.get("http://localhost:3090/api/get-active-reservations", {withCredentials: true});
            setReservations(response.data[0].count);
        }catch(error){
            console.log(error);
        }
    }
    const getInactiveReservations = async () => {
        try{
            const response = await axios.get("http://localhost:3090/api/get-inactive-reservations", {withCredentials: true});
            setInactiveReservations(response.data[0].count);
        }catch(error){
            console.log(error);
        }
    }
    const getTakenReservations = async () => {
        try{
            const response = await axios.get("http://localhost:3090/api/get-taken-reservations", {withCredentials: true});
            setTakenReservations(response.data[0].count);
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

    useEffect(() => {
        getReservations();
        const interval = setInterval(() => {
            getReservations();
        }, 10000);

        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        getInactiveReservations();
        const interval = setInterval(() => {
            getInactiveReservations();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        getTakenReservations();
        const interval = setInterval(() => {
            getTakenReservations();
        }, 10000);

        return () => clearInterval(interval);
    }, []);


    
    //const textColor = parkingSpaces <= 15 ? 'text-red-500' : 'text-green-700';
    return (
        <>
           
            <div className="dark:bg-midnight-950 bg-white-50 shadow-3xl  contrast-[95%] rounded-md p-8 max-md:p-4 w-full flex flex-col gap-y-8 max-md:gap-y-4 text-white-50 font-bold text-xl">
                <h1 className="dark:text-white-50 text-black font-bold text-2xl flex flex-row gap-x-2 items-center"><MdDirectionsCarFilled className="text-3xl text-black dark:text-white-50" /> Estacionamientos</h1>
                <div className="flex flex-row gap-x-8 w-full justify-start max-lg:grid max-lg:grid-cols-4 max-md:grid-cols-2 max-lg:gap-x-2 max-md:gap-x-2 gap-y-3" >
                    <div className="flex flex-col max-md:py-2 w-full h-full items-center max-md:gap-y-2">
                        <div className="flex flex-col p-2 py-6 max-md:py-2 bg-red-500 rounded-md w-full h-full items-center max-md:gap-y-2">
                            <h1 className="text-white-50 text-xl font-bold text-center max-md:text-base max-sm:text-xs">Ocupados</h1>
                            <span className="text-white-50 font-bold text-4xl max-md:text-2xl max-sm:text-base">
                                {takenReservations !== null ? takenReservations : 'Cargando...'}
                            </span>
                        </div>
                    </div>   
                    <div className="flex flex-col max-md:py-2 w-full h-full items-center max-md:gap-y-2">
                        <div className="flex flex-col p-2 py-6 max-md:py-2 bg-green-600 rounded-md w-full h-full items-center max-md:gap-y-2">
                            <h1 className="text-white-50 text-xl font-bold text-center max-md:text-base max-sm:text-xs">Libres</h1>
                            <span className="text-white-50 font-bold text-4xl max-md:text-2xl max-sm:text-base">
                                {parkingSpaces !== null ? parkingSpaces : 'Cargando...'}
                            </span>
                        </div>
                    </div>  
                    <div className="flex flex-col max-md:py-2 w-full h-full items-center max-md:gap-y-2">
                        <div className="flex flex-col p-2 py-6 max-md:py-2 bg-yellow-500 rounded-md w-full h-full items-center max-md:gap-y-2">
                            <h1 className="text-white-50 text-xl font-bold text-center max-md:text-base max-sm:text-xs">Reservados</h1>
                            <span className="text-white-50 font-bold text-4xl max-md:text-2xl max-sm:text-base">
                                {reservations !== null ? reservations : 'Cargando...'}
                            </span>
                        </div>
                    </div>  
                    <div className="flex flex-col max-md:py-2 w-full h-full items-center max-md:gap-y-2">
                        <div className="flex flex-col p-2 py-6 max-md:py-2 bg-gray-600 rounded-md w-full h-full items-center max-md:gap-y-2">
                            <h1 className="text-white-50 text-xl font-bold text-center max-md:text-base max-sm:text-xs">No Disponibles</h1>
                            <span className="text-white-50 font-bold text-4xl max-md:text-2xl max-sm:text-base">
                                {inactiveReservations !== null ? inactiveReservations : 'Cargando...'}
                            </span>
                        </div>
                    </div>  
                </div>
            </div>
            
        </>
    );
};

import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdDirectionsCarFilled } from "react-icons/md";


export const ParkingAvailability = ({ user }) => {

    const [parkingSpaces, setParkingSpaces] = useState(null);
    const [reservations, setReservations] = useState(null);
    const [inactiveReservations, setInactiveReservations] = useState(null);
    const [takenReservations, setTakenReservations] = useState(null);

    const getParkingSpaces = async () => {
        try{
            const response = await axios.get("/api/parkingSpaces", {withCredentials: true});
            setParkingSpaces(response.data.total_libres);
        }catch(error){
            console.log(error);
        }
    }
    const getReservations = async () => {
        try{
            const response = await axios.get("/api/get-active-reservations", {withCredentials: true});
            setReservations(response.data[0].count);
        }catch(error){
            console.log(error);
        }
    }
    const getInactiveReservations = async () => {
        try{
            const response = await axios.get("/api/get-inactive-reservations", {withCredentials: true});
            setInactiveReservations(response.data[0].count);
        }catch(error){
            console.log(error);
        }
    }
    const getTakenReservations = async () => {
        try{
            const response = await axios.get("/api/get-taken-reservations", {withCredentials: true});
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


        return (
        <>
           
            <div className="dark:bg-midnight-950 bg-white-50 shadow-3xl  contrast-[95%] rounded-md p-8 max-md:p-4 w-full flex flex-col gap-y-8 max-md:gap-y-4 text-white-50 font-bold text-xl">
                <h1 className="dark:text-white-50 text-black font-bold text-2xl flex flex-row gap-x-2 items-center"><MdDirectionsCarFilled className="text-3xl text-black dark:text-white-50" /> Estacionamientos</h1>
                <div className="flex flex-row gap-x-8 w-full justify-start max-lg:grid max-lg:grid-cols-4 max-md:grid-cols-2 max-lg:gap-x-2 max-md:gap-x-2 gap-y-3" >
                        <div className="flex flex-col p-2 py-4 max-md:py-2 bg-red-500 rounded-md w-full h-full items-center">
                            <h1 className="text-white-50 text-xl font-bold text-center max-md:text-base max-sm:text-xs">Ocupados</h1>
                            <span className="text-white-50 font-bold text-4xl max-l:text-2xl max-sm:text-base">
                                {takenReservations !== null ? takenReservations : 'Cargando...'}
                            </span>
                        </div>
                        <div className="flex flex-col p-2 py-4 max-md:py-2 bg-green-600 rounded-md w-full h-full items-center">
                            <h1 className="text-white-50 text-xl font-bold text-center max-md:text-base max-sm:text-xs">Libres</h1>
                            <span className="text-white-50 font-bold text-4xl max-l:text-2xl max-sm:text-base">
                                {parkingSpaces !== null ? parkingSpaces : 'Cargando...'}
                            </span>
                        </div>
                        <div className="flex flex-col p-2 py-4 max-md:py-2 bg-yellow-500 rounded-md w-full h-full items-center">
                            <h1 className="text-white-50 text-xl font-bold text-center max-md:text-base max-sm:text-xs">Reservados</h1>
                            <span className="text-white-50 font-bold text-4xl max-l:text-2xl max-sm:text-base">
                                {reservations !== null ? reservations : 'Cargando...'}
                            </span>
                        </div>
                        <div className="flex flex-col p-2 py-4 max-md:py-2 bg-gray-600 rounded-md w-full h-full items-center">
                            <h1 className="text-white-50 text-xl font-bold text-center max-md:text-base max-sm:text-xs">No Disponibles</h1>
                            <span className="text-white-50 font-bold text-4xl max-l:text-2xl max-sm:text-base">
                                {inactiveReservations !== null ? inactiveReservations : 'Cargando...'}
                            </span>
                        </div>
                </div>
            </div>
            
        </>
    );
};

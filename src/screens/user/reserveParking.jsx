import React, { useState, useEffect } from "react";
import { ParkingMap } from "../../components/ParkingMap"
import { FaBell } from "react-icons/fa";
import axios from "axios";
import { BsXCircle } from "react-icons/bs";
import { FaX } from "react-icons/fa6";
import { MdDashboard, MdDirectionsCarFilled, MdHistory } from "react-icons/md";





export const ReserveParking = ( { user, darkToggle, onToggleMenu, handleToggleMenu, handleCurrentPage } ) => {

    const [vehicleActive, setVehicleActive] = useState(null);
    const [hasActiveReservation, setHasActiveReservation] = useState(false);
    const [isWithinReservationHours, setIsWithinReservationHours] = useState(true);
    

    const getVehicleActive = async (userRut) => {
        try {
            const response = await axios.post('http://localhost:3090/api/get-vehicle-active', { userRut }, { withCredentials: true });
            if(response.data.length === 0){
                setVehicleActive('');
            } else{
                setVehicleActive(response.data[0].vehi_patente);
            }
        } catch (error) {
            console.log(error);
        }
      };

    const getCurrentReservation = async (userRut) => {
        try {
            const response = await axios.post('http://localhost:3090/api/get-current-reservation', { userRut }, { withCredentials: true });
            if(response.data.length === 0){
                setHasActiveReservation(false);
            } else{
                setHasActiveReservation(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const checkReservationHours = () => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const startHour = 5;
        const startMinute = 30;
        const endHour = 22;
        const endMinute = 0;

        if (
            (currentHour > startHour || (currentHour === startHour && currentMinute >= startMinute)) &&
            (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute))
        ) {
            setIsWithinReservationHours(true);
        } else {
            setIsWithinReservationHours(false);
        }
    };

    useEffect(() => {
        getVehicleActive(user.userRut);
        getCurrentReservation(user.userRut);
        checkReservationHours();
    }, []);

    return(
        <>
            {(vehicleActive === '' || hasActiveReservation || !isWithinReservationHours)  && (<div className="fixed inset-0 bg-black opacity-50 z-30"></div>)}
            <div className="relative w-full h-full flex flex-col px-4 xl:px-60 m-auto items-center justify-center grow max-md:px-2 gap-y-4 overflow-y-scroll">
                <ParkingMap darkToggle={darkToggle} onToggleMenu={onToggleMenu} handleToggleMenu={handleToggleMenu} handleCurrentPage={handleCurrentPage} infoUser={user} vehicleActive={vehicleActive}/>
                <div className="dark:bg-midnight-950 bg-white-50 shadow-3xl contrast-[95%] mb-8 rounded-md p-8 max-md:p-4 w-full flex flex-col gap-y-8 max-md:gap-y-4">
                    <h1 className="dark:text-white-50 text-black font-bold text-2xl flex flex-row gap-x-2 items-center"><FaBell className="text-4xl text-black dark:text-white-50"/>Avisos</h1>
                    <ul className="flex flex-col justify-start w-full">
                        <li className="text-black dark:text-white-50 text-lg font-semibold max-md:text-base max-xs:text-sm">
                            • Solo puede tener una reserva activa al mismo tiempo.
                        </li>
                        <li className="text-black dark:text-white-50 text-lg font-semibold max-md:text-base max-xs:text-sm">
                            • Necesita tener un vehículo activo para poder realizar la reserva.
                        </li>
                        <li className="text-black dark:text-white-50 text-lg font-semibold max-md:text-base max-xs:text-sm">
                            • El sistema de reservas está disponible desde las 05:30 AM hasta las 22:00 PM.
                        </li>
                    </ul>
                </div>
            </div>
            {!isWithinReservationHours ? (
                <div className="fixed z-50 flex flex-col items-center inset-0 m-auto w-fit max-2xl:w-fit max-md:p-4 h-fit max-xs:max-w-[95%] overflow-y-scroll bg-white-50 dark:bg-midnight-950 border-[1px] border-black rounded-lg p-4 gap-y-6">
                    <BsXCircle className='text-9xl text-red-500' />
                    <h1 className='text-center text-xl text-black dark:text-white-50 max-md:text-lg'>
                        Las reservas solo pueden realizarse entre las 05:30 AM y las 22:00 PM.
                    </h1>
                    <div className='flex flex-row justify-center items-center gap-x-4 mt-4 max-xs:mt-2'>
                        <button onClick={() => handleCurrentPage('/dashboard-user')} className='bg-midnight-700 text-white-50 font-bold p-1.5 px-3 rounded-lg items-center flex flex-row gap-x-1'><MdDashboard className="text-2xl" /> Volver al Dashboard</button>
                    </div>
                </div>
            ) : hasActiveReservation ? (
                <div className="fixed z-50 flex flex-col items-center inset-0 m-auto w-fit max-2xl:w-fit max-md:p-4 h-fit max-xs:max-w-[95%] overflow-y-scroll bg-white-50 dark:bg-midnight-950 border-[1px] border-black rounded-lg p-4 gap-y-6">
                    <BsXCircle className='text-9xl text-red-500' />
                    <h1 className='text-center text-xl text-black dark:text-white-50 max-md:text-lg'>
                        Ya tienes una reserva activa. Para realizar una nueva reserva, primero debes cancelar la existente.
                    </h1>
                    <div className='flex flex-row justify-center items-center gap-x-4 mt-4 max-xs:mt-2'>
                        <button
                            onClick={() => handleCurrentPage('/my-reservations')}
                            className='bg-midnight-700 text-white-50 font-bold p-1.5 px-3 rounded-lg items-center flex flex-row gap-x-1'
                        >
                            <MdHistory className="text-2xl" /> Ir a Mis Reservas
                        </button>
                    </div>
                </div>
            ) : vehicleActive === '' && (
                <div className="fixed z-50 flex flex-col items-center inset-0 m-auto w-fit max-2xl:w-fit max-md:p-4 h-fit max-xs:max-w-[95%] overflow-y-scroll bg-white-50 dark:bg-midnight-950 border-[1px] border-black rounded-lg p-4 gap-y-6">
                    <BsXCircle className='text-9xl text-red-500' />
                    <h1 className='text-center text-xl text-black dark:text-white-50 max-md:text-lg'>Para realizar una reserva, primero debes registrar un vehículo activo.</h1>
                    <div className='flex flex-row justify-center items-center gap-x-4 mt-4 max-xs:mt-2'>
                        <button onClick={() => handleCurrentPage('/my-vehicles')} className='bg-midnight-700 text-white-50 font-bold p-1.5 px-3 rounded-lg items-center flex flex-row gap-x-1'><MdDirectionsCarFilled  className="text-2xl" /> Ir a Mis Vehículos</button>
                    </div>
                </div>
            )}
        </>
    );
};
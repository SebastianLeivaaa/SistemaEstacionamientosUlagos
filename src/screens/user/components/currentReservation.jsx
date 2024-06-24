import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserQR } from "../../../components/userQR";
import { formatTime } from "../../../utils/formatTime";
import { LuCalendarClock } from "react-icons/lu";
import { FaCheck } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { BsQuestionCircle } from "react-icons/bs";
import { ClipLoader } from "react-spinners";
import { BsXCircle } from "react-icons/bs";
import { BsCheckCircle } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";

export const CurrentReservation = ({ user }) => {
  const [currentReservation, setCurrentReservation] = useState([]);
  const [counter, setCounter] = useState(0);
  const [counter2, setCounter2] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmReserve, setConfirmReserve] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const getCurrentReservation = async (userRut) => {
    try {
      const response = await axios.post('/api/get-current-reservation', { userRut }, { withCredentials: true });
      setCurrentReservation(response.data);
      if (response.data.length > 0) {
        if(response.data[0].rese_estado === 'CONFIRMADA'){
            setConfirmReserve(true);
            const now = new Date();
            const arrivalTimeParts = response.data[0].rese_hora_llegada.split(':');
            const arrivalTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...arrivalTimeParts.map(Number));
            const diffInSeconds = Math.floor((now.getTime() - arrivalTime.getTime()) / 1000);
            setCounter2(diffInSeconds);
        } else {
            setConfirmReserve(false);
            const now = new Date();
            const arrivalTimeParts = response.data[0].rese_hora_llegada_max.split(':');
            const arrivalTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...arrivalTimeParts.map(Number));
            const diffInSeconds = Math.floor((arrivalTime.getTime() - now.getTime()) / 1000);
            setCounter(diffInSeconds);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleModalClick = (event) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  const confirmDelete = () => {
    setShowConfirmation(!showConfirmation);
    setError(false);
    setSuccess(false);
  };

  const deleteReservation = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/delete-reservation', { userRut: user.userRut }, { withCredentials: true });
      if (response.status === 200) {
        setSuccess(true);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getCurrentReservation(user.userRut);
  }, [currentReservation]);

  useEffect(() => {
    if (counter > 0) {
      const timer = setInterval(() => {
        setCounter((prevCounter) => Math.max(prevCounter - 1, 0));
      }, 1000);
      return () => clearInterval(timer);
    }
    if (counter2 > 0) {
        const timer = setInterval(() => {
          setCounter2((prevCounter) => Math.max(prevCounter + 1, 0));
        }, 1000);
        return () => clearInterval(timer);
      }
  }, [counter, counter2]);

  return (
    <>
      {showConfirmation && (<div className="fixed inset-0 bg-black opacity-50 z-50"></div>)}
      <div className="dark:bg-midnight-950 bg-white-50 shadow-3xl  contrast-[95%] rounded-md p-8 max-md:p-4 w-full flex flex-col gap-y-8 max-md:gap-y-4">
        <h1 className="dark:text-white-50 text-black font-bold text-2xl flex flex-row gap-x-2 items-center"><LuCalendarClock className="text-3xl text-black dark:text-white-50"/> Reserva vigente</h1>
        <div className="flex flex-row gap-x-8 w-full justify-start max-lg:grid max-lg:grid-cols-4 max-lg:gap-x-2 max-sm:gap-x-2 gap-y-3">
          {currentReservation.length > 0 ? (
            <>
              <div className="flex flex-col p-3 py-4 bg-midnight-800 rounded-md w-full h-full items-center">
                <h1 className="text-white-50 text-xl font-bold text-center max-md:text-base max-sm:text-xs">Sección</h1>
                <div className="w-full h-full flex justify-center items-center">
                  {currentReservation.length > 0 ? (
                    <span className="text-white-50 font-bold text-4xl max-md:text-2xl max-sm:text-base">{currentReservation[0].secc_nombre.split(" ")[1]}</span>
                  ) : (
                    <span className="text-white-50 font-bold">Cargando...</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col p-3 py-4 bg-midnight-800 rounded-md w-full h-full items-center">
                <h1 className="text-white-50 text-xl font-bold text-center max-md:text-base max-sm:text-xs">Parking</h1>
                <div className="w-full h-full flex justify-center items-center">
                  {currentReservation.length > 0 ? (
                    <span className="text-white-50 text-4xl font-bold max-md:text-2xl max-sm:text-base">{currentReservation[0].esta_numero}</span>
                  ) : (
                    <span className="text-white-50 font-bold">Cargando...</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col p-3 py-4 bg-midnight-800 rounded-md w-full h-full items-center">
                <h1 className="text-white-50 text-xl font-bold text-center max-md:text-base max-sm:text-xs">Patente</h1>
                <div className="w-full h-full flex justify-center items-center">
                  {currentReservation.length > 0 ? (
                    <span className="text-white-50 font-bold text-4xl max-md:text-2xl max-sm:text-base">{currentReservation[0].rese_vehi_patente}</span>
                  ) : (
                    <span className="text-white-50 font-bold">Cargando...</span>
                  )}
                </div>
              </div>
              {confirmReserve ? (
                <>
                  <div className="flex flex-col p-3 py-4 bg-midnight-800 rounded-md w-full h-full items-center">
                    <h1 className="text-white-50 text-xl font-bold text-center max-md:text-base max-sm:text-xs">Tiempo de uso:</h1>
                    <div className="w-full h-full flex justify-center items-center">
                      {currentReservation.length > 0 ? (
                        <span className="text-white-50 font-bold text-4xl max-md:text-2xl max-sm:text-base">{formatTime(counter2)}</span>
                      ) : (
                        <span className="text-white-50 font-bold">Cargando...</span>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col p-3 py-4 bg-midnight-800 rounded-md w-full h-full items-center">
                    <h1 className="text-white-50 text-xl font-bold text-center max-md:text-base max-sm:text-xs">Expira en</h1>
                    <div className="w-full h-full flex justify-center items-center">
                      {currentReservation.length > 0 ? (
                        counter === 0 ? (
                          <span className="text-white-50 font-bold text-4xl max-md:text-2xl max-sm:text-base">Expirada</span>
                        ) : (
                          <span className="text-white-50 font-bold text-4xl max-md:text-2xl max-sm:text-base">{formatTime(counter)}</span>
                        )
                      ) : (
                        <span className="text-white-50 font-bold">Cargando...</span>
                      )}
                    </div>
                  </div>
                  <button className="flex flex-col p-3 py-4 bg-green-700 hover:bg-green-800 rounded-md w-full h-full max-lg:col-span-2 max-sm:h-auto items-center justify-center" onClick={openModal}>
                    <span className="text-white-50 font-bold text-center text-xl max-md:text-base max-sm:text-xs">Ver tu código QR</span>
                  </button>
                  <button className="flex flex-col p-3 py-4 bg-red-500 hover:bg-red-600 rounded-md w-full h-full max-lg:col-span-2 max-sm:h-auto items-center justify-center" onClick={confirmDelete}>
                    <span className="text-white-50 font-bold text-center text-xl max-md:text-base max-sm:text-xs">Anular reserva</span>
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="flex flex-col max-md:flex-row gap-x-2 items-center max-lg:col-span-4 gap-y-8 w-full justify-center">
              <LuCalendarClock className="text-9xl text-gray-700 dark:text-white-50"/>
              <h1 className="text-center text-2xl max-md:text-xl font-bold text-black dark:text-white-50">No tienes una reserva vigente</h1>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50" onClick={handleModalClick}>
          <div className="bg-white p-4 rounded-md" onClick={(e) => e.stopPropagation()}>
            <div className="w-[400px] h-[400px] flex justify-center items-center">
              <UserQR rut={user.userRut} size={400} />
            </div>
          </div>
        </div>
      )}
      {showConfirmation && (
        <div className="fixed z-50 flex flex-col items-center justify-center inset-0 m-auto w-fit h-fit max-xs:w-[95%] bg-white-50 dark:bg-midnight-950 border-[1px] border-black rounded-lg p-8 gap-y-6" onClick={handleModalClick}>
          {error ? (
            <>
              <BsXCircle className='text-9xl text-red-500'/>
              <h1 className='text-center text-xl text-black dark:text-white-50'>Ha ocurrido un error al intentar cancelar la reserva</h1>
              <div className='flex flex-row justify-center items-center gap-x-4 mt-4'>
                <button onClick={confirmDelete} className='bg-red-500 text-white-50 font-bold p-1.5 px-3 rounded-md items-center flex flex-row gap-x-1'><FaTimes className="text-xl"/> Cerrar</button>
              </div>
            </>
          ) : (
            success ? (
              <>
                <BsCheckCircle className='text-9xl text-green-600'/>
                <h1 className='text-center text-xl text-black dark:text-white-50'>¡Reserva cancelada exitosamente!</h1>
                <button type="button" onClick={confirmDelete} className="flex flex-row max-md:text-sm p-3 bg-red-500 hover:bg-red-600 rounded-md font-bold w-[100%] max-md:w-full text-white-50 items-center justify-center gap-x-2">
                  <FaTimes/> Cerrar
                </button>
              </>
            ) : (
              <>
                <BsQuestionCircle className='text-9xl text-red-500'/>
                <h1 className='text-center text-xl text-black dark:text-white-50'>¿Estás seguro que deseas anular tu reserva?</h1>
                <div className='flex flex-row justify-center items-center gap-x-12 mt-4'>
                  <button onClick={deleteReservation} className='bg-green-700 hover:bg-green-800 text-white-50 font-bold p-1.5 px-3 rounded-md items-center flex flex-row gap-x-1'> {isLoading ? (<ClipLoader color="#FFFFFF" size={24}/>) : (<FaCheck/>)} Sí</button>
                  <button onClick={confirmDelete} className='bg-red-500 hover:bg-red-600 text-white-50 font-bold p-1.5 px-3 rounded-md items-center flex flex-row gap-x-1'><FaX/> No</button>
                </div>
              </>
            )
          )}
        </div>
      )}
    </>
  );
};
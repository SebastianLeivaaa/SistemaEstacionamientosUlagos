import React, { useState, useRef, useEffect } from "react";
import { BsQrCode } from "react-icons/bs";
import { ClipLoader } from 'react-spinners';
import { IoSearch } from "react-icons/io5";
import { QrReader } from "../../components/qrReader";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineRestartAlt } from "react-icons/md";
import { validateRut } from "../../utils/validateRut";
import { TiWarning } from "react-icons/ti";
import { FaCalendarAlt } from "react-icons/fa";
import { formatDate } from "../../utils/formatDate";
import { FaCheck } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { BsCheckCircle, BsXCircle } from "react-icons/bs";
import axios from "axios";


export const ConfirmmReservation = ({ user }) => {
  const [scanActive, setScanActive] = useState(false);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isLoading3, setIsLoading3] = useState(false);
  const [errors, setErrors] = useState({});
  const [qrReaderKey, setQrReaderKey] = useState(0);
  const [restartScanner, setRestartScanner] = useState(false); 
  const [reservation, setReservation] = useState([]);
  const [confirm, setConfirm] = useState(false);
  const [rutUser, setRutUser] = useState('');

  const handleScanResponse = (result) => {
    console.log(result);
    handleSubmitByQR(result);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRutUser(value);
  };

  const handleScanActive = () => {
    setScanActive(!scanActive);
    if (!scanActive) {
      setRestartScanner(true);
    }
  }

  const handleRestartScanner = () => {
    setRestartScanner(true);
    setQrReaderKey(prevKey => prevKey + 1);
  }

  const handleSubmitByRut = async (e) => {
    e.preventDefault();
    setIsLoading2(true);
    setConfirm(false);
    setErrors({});
    setMessage(null);
    const newErrors = {};
    if(!validateRut(rutUser)){
        newErrors.rut = 'Ingrese un rut válido';
    }

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
    }else{
        try {
            const response = await axios.post("/api/get-active-reservation-by-rut", { rut: rutUser}, { withCredentials: true });
            setReservation(response.data);
            setScanActive(false);
        }catch(error){
          setScanActive(false);
          setMessage({ text: error.response?.data?.message || 'Error al buscar el historial' });;
        }
    }
    setIsLoading2(false);
}

  const handleSubmitByQR = async (rutUser) => {
    setIsLoading(true);
    setConfirm(false);
    setErrors({});
    setMessage(null);
    const newErrors = {};

    if (Object.keys(newErrors).length > 0) {
        setScanActive(false);
        setErrors(newErrors);
    }else{
        try {
            const response = await axios.post("/api/get-active-reservation-by-qr", {rutUser: rutUser}, { withCredentials: true });
            setReservation(response.data);
            setScanActive(false);
        }catch(error){
            setScanActive(false);
            setMessage({ text: error.response?.data?.message || 'Error al buscar el historial' });
        }
    }
    setIsLoading(false);
}
const confirmReservation = async () => {
  setIsLoading3(true);
  try{
      const response = await axios.post("/api/confirm-reservation", { record: reservation[0], userRut: user.userRut}, {withCredentials: true});
      setReservation([]);
      setConfirm(true);
  }catch(error){
      console.log(error);
  }
  setIsLoading3(false);
};


  return (
    <>
      {scanActive && (<div className="fixed inset-0 bg-black opacity-50 z-50"></div>)}
      <div className="w-full h-full flex flex-col px-4 xl:px-60 pt-8 m-auto items-center max-md:px-2 gap-y-4 overflow-y-scroll">
        <div className="w-full  grid grid-cols-2 max-md:grid-cols-1 gap-x-4">
          <div className="dark:bg-midnight-950 bg-white-50 shadow-3xl contrast-[95%] mb-8 rounded-md px-8 pt-8 pb-8 max-md:p-4 w-full flex flex-col gap-y-8 max-md:gap-y-4">
            <h1 className="text-2xl pb-2 font-bold text-center text-black dark:text-white-50 max-md:text-base">Confirmar Reserva con Rut</h1>
            <h2 className="text-black  dark:text-white-50 text-lg font-semibold text-center max-md:text-base">Ingrese el RUT que le otorgará el usuario para confirmar si tiene una reserva asociada:</h2>
            <form className="w-full flex flex-row max-xl:flex-col gap-x-2 justify-center items-center gap-y-4">
              <input 
                className="w-[50%] gap-y-10 p-2 bg-gray-100 dark:bg-gray-700 text-black dark:text-white-50 border-[0.5px] border-midnight-700" placeholder="Ej:20545267-1"
                type='text'
                id='rut'
                onChange={handleChange}
                value={rutUser}
                maxLength='10'
                name='rut'
              />
              <button onClick={handleSubmitByRut} className="text-white-50 rounded-md bg-blue-ribbon-600 hover:bg-blue-ribbon-700 p-3 px-3 flex flex-row items-center gap-x-2 font-bold">{isLoading2 ? (<ClipLoader color="#FFFFFF" size={24}/>) : (<IoSearch className="text-2xl"/>)}Consultar reserva</button>
            </form>
          </div>
          <div className="dark:bg-midnight-950 bg-white-50 shadow-3xl contrast-[95%] mb-8 rounded-md p-8 max-md:p-4 w-full flex flex-col gap-y-8 max-md:gap-y-4">
            <h1 className="text-2xl font-bold text-center text-black dark:text-white-50 max-md:text-base">Confirmar con código QR</h1>
            <div className="w-full items-center justify-center flex flex-col gap-y-8">
              <h2 className="text-black  dark:text-white-50 text-lg font-semibold text-center max-md:text-base">Escanee el código QR que le otorgará el usuario para confirmar si tiene una reserva asociada:</h2>
              <button onClick={handleScanActive} className="text-white-50 rounded-md bg-blue-ribbon-600 hover:bg-blue-ribbon-700 p-3 px-3 flex flex-row items-center gap-x-2 font-bold"><BsQrCode className="text-lg"/> Haz click para escanear</button>
            </div>
          </div>
        </div>
        <div className="dark:bg-midnight-950 bg-white-50 shadow-3xl contrast-[95%] h-full mb-8 items-center rounded-md p-8 max-md:p-4 w-full flex flex-col gap-y-8 max-md:gap-y-4">
          <h1 className="text-2xl font-bold text-start text-black dark:text-white-50 max-md:text-base">Datos de la reserva</h1>
          {errors.rut && (
            <div className="flex flex-col justify-center items-center gap-y-4 m-auto">
              <BsXCircle className="text-[200px] max-lg:text-9xl text-red-600"/>
              <p className='text-center text-2xl max-md:text-lg text-red-600 dark:text-red-600'>{errors.rut}</p>
            </div>
          )}
          {message && (
            <div className="flex flex-col justify-center items-center gap-y-4 m-auto">
              <BsXCircle className="text-[200px] max-lg:text-9xl text-red-600 dark:text-red-600"/>
              <p className='text-center text-2xl max-md:text-lg text-red-600 dark:text-red-600'>{message.text}</p>
            </div>
          )}
          {reservation.length > 0 && (
            <>
              <div  className="flex flex-col shadow-3xl shadow-midnight-800 w-[50%] max-lg:w-[75%] max-sm:w-[100%] rounded-2xl items-center">
                <div className="flex flex-row w-full rounded-t-lg p-3 max-md:p-3 bg-midnight-800 text-white-50 justify-between">
                    <span className="flex flex-row items-center gap-x-4 max-md:gap-x-2 font-semibold">
                        <FaCalendarAlt className="text-2xl max-md:text-base"/>
                        <h1 className="text-base max-md:text-sm">{formatDate(reservation[0].rese_fecha)}</h1>
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-x-2 items-center gap-y-0.5 w-full p-3 max-md:p-4 rounded-b-2xl text-black bg-white-100 dark:bg-bay-of-many-900 dark:text-white-50 font-semibold">
                    <h1 className='text-base max-md:text-sm'>Nombre</h1>
                    <h1 className='text-base max-md:text-sm'>{reservation[0].usua_nombre} {reservation[0].usua_apellido_paterno} {reservation[0].usua_apellido_materno}</h1>
                    <h1 className='text-base max-md:text-sm'>RUT</h1>
                    <h1 className='text-base max-md:text-sm'>{reservation[0].rese_usua_rut}</h1>
                    <h1 className='text-base max-md:text-sm'>Tipo usuario:</h1>
                    <h1 className='text-base max-md:text-sm'>{reservation[0].usua_tipo}</h1>
                    <h1 className='text-base max-md:text-sm'>N° estacionamiento:</h1>
                    <h1 className='text-base max-md:text-sm'>{reservation[0].esta_numero}</h1>
                    <h1 className='text-base max-md:text-sm'>Patente vehículo:</h1>
                    <h1 className='text-base max-md:text-sm'>{reservation[0].rese_vehi_patente}</h1>
                </div>
              </div>
              <div className="flex flex-col gap-y-6 max-md:gap-y-4 justify-center items-center">
                <h1 className="text-center text-xl max-md:text-base text-black dark:text-white-50">¿Deseas confirmar la reserva?</h1>
                {isLoading3 ? (
                  <div className="flex flex-row justify-center gap-x-24">
                    <ClipLoader color="#0d6efd" size={24}/>
                  </div>
                ): (
                  <div className="flex flex-row justify-center gap-x-24">
                    <button onClick={confirmReservation} className='text-white-50 rounded-md p-1.5 px-3 flex flex-row items-center gap-x-1 font-bold max-md:font-semibold bg-green-700 hover:bg-green-800'><FaCheck/> Si</button>
                    <button onClick={() => {setReservation([])}} className='text-white-50 rounded-md bg-red-500 hover:bg-red-700 p-1.5 px-3 flex flex-row items-center gap-x-1 font-bold max-md:font-semibold'><FaX/> No</button>
                  </div>
                )}
              </div>
            </>
          )}
          {confirm && (
            <div className="flex flex-col justify-center items-center gap-y-4 m-auto">
              <BsCheckCircle className="text-[200px] max-lg:text-9xl text-green-600"/>
              <p className='text-center text-2xl max-md:text-lg text-black dark:text-white-50'>Reserva confirmada con éxito</p>
            </div>
          )}
        </div>
        {scanActive && (
          <div className="fixed z-50 flex flex-col items-center justify-center inset-0 m-auto w-fit h-fit max-xs:w-[95%] bg-white-50 dark:bg-midnight-950 border-[1px] border-black rounded-lg p-8 gap-y-3 max-md:gap-y-6">
            <div className='sticky w-full top-0 justify-end flex'>
              <button onClick={handleScanActive} className="p-0 flex justify-end items-end"><RxCross2 className='text-2xl text-black dark:text-white-50'/></button>
            </div>
            <h2 className="text-black dark:text-white-50 text-xl font-semibold text-center max-md:text-lg">Escanee el código QR</h2>
            <div className="flex flex-col w-[350px] h-[350px] max-xs:w-[250px] max-xs:h-[250px] justify-center items-center gap-y-4">
              {isLoading ? (
                <ClipLoader color="#FFFFFF" size={96}/>    
              ) : (
                <QrReader key={qrReaderKey} onScan={handleScanResponse} restart={restartScanner} timeoutInSeconds={10}/>
              )}
              <button onClick={handleRestartScanner} className="text-white-50 rounded-md bg-blue-ribbon-600 w-fit hover:bg-blue-ribbon-700 p-3 px-3 flex flex-row justify-center items-center gap-x-2 font-bold"><MdOutlineRestartAlt className="text-2xl"/> Reiniciar escáner QR</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

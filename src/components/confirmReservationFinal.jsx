import React, {useState, useEffect} from "react";
import { useLocation } from 'react-router-dom';
import { IoHome } from "react-icons/io5";
import Ulogo from "../assets/img/Ulogo.png";
import { HiOutlineLogin } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';;
import { FaCalendarAlt } from "react-icons/fa";
import { formatDate } from "../utils/formatDate";
import { FaCheck } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { FaCheckCircle } from "react-icons/fa";



export const ConfirmReservationFinal = (props) => {

    const [user, setUser] = useState({
        email: "",
        userName: "",
        userLastNamePat: "",
        userLastNameMat: "",
    });

    const [confirm, setConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);



    const navigate = useNavigate();
    const location = useLocation();
    const recordReservation = location.state?.recordReservation;

    const logOut = async () => {
        const response = await axios.get("http://localhost:3090/api/logout", {withCredentials: true});
        navigate('/');
    };

    const getProfile = async () => {
        try{
            const response = await axios.get("http://localhost:3090/api/login", {withCredentials: true});
            setUser({
                email: response.data.email,
                userName: response.data.userName,
                userLastNamePat: response.data.userLastNamePat,
                userLastNameMat: response.data.userLastNameMat,
                userRut: response.data.userRut,
            });
        }catch(error){
            navigate("/");
        }
    };

    const confirmReservation = async () => {
        setIsLoading(true);
        try{
            const response = await axios.post("http://localhost:3090/api/confirm-reservation", { record: recordReservation[0], userRut: user.userRut}, {withCredentials: true});
            setConfirm(true);
        }catch(error){
            console.log(error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        getProfile();
    }, []);

    return (
        <div className="w-screen min-h-screen flex items-center justify-center py-16">
            <div className="flex flex-col h-[800px] min-w-[50%] overflow-y-scroll p-8 gap-y-8 rounded-md max-xl:w-[75%] max-xl:px-4 max-xl:py-8 bg-white-50 relative">
                <div className="flex flex-wrap sm:flex-row w-full justify-between">
                    <img src={Ulogo} alt="Logo Ulagos" className="px-5 w-full sm:w-60 h-auto" />
                    <div className="flex flex-col items-end justify-end max-sm:w-full max-sm:justify-center max-sm:items-center">
                        <h1 className="text-lg font-bold text-center max-md:text-base text-congress-blue-900">{user.userName.toLocaleUpperCase()} {user.userLastNamePat.toLocaleUpperCase()} {user.userLastNameMat.toLocaleUpperCase()}</h1>
                        <button onClick={logOut} className="mt-4 bg-white font-bold text-red-600 text-lg flex flex-row items-center justify-center gap-x-1 max-md:text-base"><HiOutlineLogin className="text-3xl max-md:text-2xl" />CERRAR SESIÓN</button>
                    </div>
                </div>
                <div className='flex flex-col items-center gap-y-2'>
                    <h1 className='font-bold text-2xl mt-10 max-md:text-lg'>DATOS DE LA RESERVA </h1>
                </div>
                {confirm ? (
                    <>
                        <div className="flex flex-col gap-y-4 items-center">
                            <FaCheckCircle className="text-[175px] max-md:text-[150px] text-blue-500"/>
                            <h1 className="text-2xl font-bold text-gray-900 text-center max-sm:text-lg">CONFIRMACIÓN REALIZADA</h1>
                        </div>
                        <div className="flex flex-col items-center gap-y-8">
                            <div className="flex flex-col xs:px-[10%] sm:px-[20%] lg:px-[25%] 2xl:px-[25%] gap-y-2 w-[100%]">
                                <div className="flex flex-row gap-x-2 justify-start">
                                    <h1 className='text-lg font-bold max-xs:text-xs max-md:text-sm max-lg:text-base'>Nombre:</h1>
                                    <h1 className='text-lg max-xs:text-xs max-md:text-sm max-lg:text-base'>{recordReservation[0].usua_nombre} {recordReservation[0].usua_apellido_paterno} {recordReservation[0].usua_apellido_materno}</h1>
                                </div>
                                <div className="flex flex-row gap-x-2 justify-start">
                                    <h1 className='text-lg font-bold max-xs:text-xs max-md:text-sm max-lg:text-base'>RUT:</h1>
                                    <h1 className='text-lg max-xs:text-xs max-md:text-sm max-lg:text-base'>{recordReservation[0].rese_usua_rut}</h1>
                                </div>
                                <div className="flex flex-row gap-x-2">
                                    <h1 className='text-lg font-bold max-xs:text-xs max-md:text-sm max-lg:text-base'>Tipo usuario:</h1>
                                    <h1 className='text-lg max-xs:text-xs max-md:text-sm max-lg:text-base'>{recordReservation[0].usua_tipo}</h1>
                                </div>
                                <div className="flex flex-row gap-x-2">
                                    <h1 className='text-lg font-bold max-xs:text-xs max-md:text-sm max-lg:text-base'>N° estacionamiento:</h1>
                                    <h1 className='text-lg max-xs:text-xs max-md:text-sm max-lg:text-base'>{recordReservation[0].esta_numero}</h1>
                                </div>
                                <div className="flex flex-row gap-x-2">
                                    <h1 className='text-lg font-bold max-xs:text-xs max-md:text-sm max-lg:text-base'>Patente vehículo:</h1>
                                    <h1 className='text-lg max-xs:text-xs max-md:text-sm max-lg:text-base'>{recordReservation[0].rese_vehi_patente}</h1>
                                </div>
                            </div>
                            <button onClick={() => {navigate('/guard')}} className='flex flex-row max-md:text-xs p-3 max-md:p-2 bg-blue-ribbon-600 hover:bg-blue-ribbon-700 rounded-md font-bold w-fit max-xs:w-full text-white-50 items-center justify-center gap-x-2 max-md:gap-x-1 '>
                                <IoHome className="text-xl"/> VOLVER AL MENU PRINCIPAL
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex flex-col w-full px-20">
                            <div className="flex flex-col shadow-3xl shadow-gray-800 w-full rounded-2xl items-center">
                                <div className="flex flex-row w-full rounded-t-lg p-3 bg-blue-ribbon-600 text-white-50 justify-between">
                                    <span className="flex flex-row items-center gap-x-2 font-semibold">
                                        <FaCalendarAlt className="text-xl max-xl:text-base"/>
                                        <h1 className="text-base max-xl:text-sm">{formatDate(recordReservation[0].rese_fecha)}</h1>
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-16 items-start gap-y-4 w-full p-4  rounded-b-2xl border-[1px] border-alabaster-600  bg-alabaster-50 text-outer-space-900 font-semibold">
                                    <h1 className='text-base max-xl:text-sm'>Nombre:</h1>
                                    <h1 className='text-base max-xl:text-sm'>{recordReservation[0].usua_nombre} {recordReservation[0].usua_apellido_paterno} {recordReservation[0].usua_apellido_materno}</h1>
                                    <h1 className='text-base max-xl:text-sm'>RUT:</h1>
                                    <h1 className='text-base max-xl:text-sm'>{recordReservation[0].rese_usua_rut}</h1>
                                    <h1 className='text-base max-xl:text-sm'>Tipo usuario:</h1>
                                    <h1 className='text-base max-xl:text-sm'>{recordReservation[0].usua_tipo}</h1>
                                    <h1 className='text-base max-xl:text-sm'>N° estacionamiento:</h1>
                                    <h1 className='text-base max-xl:text-sm'>{recordReservation[0].esta_numero}</h1>
                                    <h1 className='text-base max-xl:text-sm'>Patente vehículo:</h1>
                                    <h1 className='text-base max-xl:text-sm'>{recordReservation[0].rese_vehi_patente}</h1>
                                    <h1 className='text-base max-xl:text-sm'>Horario máximo de llegada:</h1>
                                    <h1 className='text-base max-xl:text-sm'>{recordReservation[0].rese_hora_max}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-8">
                            <div className="flex items-center justify-center">
                                <h1 className="text-xl max-md:text-base">¿Deseas confirmar la reserva?</h1>
                            </div>
                            {isLoading ? (
                                <div className="flex flex-row justify-center gap-x-24">
                                    <ClipLoader color="#0d6efd" size={24}/>
                                </div>
                            ): (
                                <div className="flex flex-row justify-center gap-x-24">
                                    <button onClick={confirmReservation} className='text-white-50 rounded-md p-1.5 px-3 flex flex-row items-center gap-x-1 font-bold max-md:font-semibold bg-green-700 hover:bg-green-800'><FaCheck/> Si</button>
                                    <button onClick={() => {navigate('/confirm-reservation')}} className='text-white-50 rounded-md bg-red-500 hover:bg-red-700 p-1.5 px-3 flex flex-row items-center gap-x-1 font-bold max-md:font-semibold'><FaX/> No</button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
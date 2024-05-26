import React, {useEffect, useState} from "react"; 
import Ulogo from "../../assets/img/Ulogo.png";
import Chinquihue from "../../assets/img/Chinquihue.png";
import { LuHistory } from "react-icons/lu";
import { HiOutlineLogin } from "react-icons/hi";
import { FaCheck } from "react-icons/fa";
import { LuParkingCircle } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


export const Guardmenu = () => {
    const [user, setUser] = useState({
        email: "",
        userName: "",
        userLastNamePat: "",
        userLastNameMat: "",
    })
    const navigate = useNavigate();
    const [parkingSpaces, setParkingSpaces] = useState(null);

    const getProfile = async () => {
        try{
            const response = await axios.get("/api/login", {withCredentials: true});
            setUser({
                email: response.data.email,
                userName: response.data.userName,
                userLastNamePat: response.data.userLastNamePat,
                userLastNameMat: response.data.userLastNameMat,
            });
        }catch(error){
            navigate("/");
        }
    }
    const getParkingSpaces = async () => {
        try{
            const response = await axios.get("/api/parkingSpaces", {withCredentials: true});
            setParkingSpaces(response.data.total_libres);
        }catch(error){
            console.log(error);
        }
    }
    useEffect(() => {
        getProfile();
        getParkingSpaces();
        const interval = setInterval(() => {
            getParkingSpaces();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const logOut = async () => {
        const response = await axios.get("/api/logout", {withCredentials: true});
        //console.log(response);
        navigate('/');
    }

    const reservationHistory = () => {
        navigate('/reservation-history');
    }
    const guardManage = () => {
        navigate('/guardmanage');
    }


    const textColor = parkingSpaces <= 15 ? 'text-red-500' : 'text-green-600';

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg">
            <div className="flex flex-col items-center p-8 gap-y-8 rounded-md max-md:w-[75%] max-md:px-4 max-md:py-8 bg-white-50">
                <div className="flex flex-row w-full justify-between">
                    <img src={Ulogo} alt="Logo Ulagos" className="w-44 h-auto"/>
                    <div className="flex flex-col items-start">
                        <h1 className="text-xl font-bold text-center max-md:text-base text-congress-blue-900">{user.userName.toLocaleUpperCase()} {user.userLastNamePat.toLocaleUpperCase()} {user.userLastNameMat.toLocaleUpperCase()}</h1>
                        <button onClick={logOut} className="mt-4 w-full bg-white font-bold text-red-600  text-lg  flex flex-row items-center justify-center gap-x-1 max-md:text-base"><HiOutlineLogin className="text-3xl max-md:text-2xl"/> CERRAR SESIÓN</button>
                    </div>
                </div>
                <img src={Chinquihue} alt="Logo Ulagos" className="w-full  rounded-lg" />
                <div className="flex flex-col items-center">
                    {parkingSpaces !== null && parkingSpaces <= 15 && (
                        <h1 className={`flex flex-row gap-x-2 items-center text-3xl font-bold text-center max-md:text-xl ${textColor}`}>
                            <TiWarning className="text-4xl" /> ATENCIÓN
                        </h1>
                    )}
                    <h1 className={`text-3xl font-bold text-center max-md:text-xl ${textColor}`}>
                        ¡{parkingSpaces !== null ? parkingSpaces : 'Cargando...'} ESTACIONAMIENTOS DISPONIBLES!
                    </h1>
                </div>
                <div className="flex flex-col gap-y-4 gap-x-6 md:flex-row justify-around w-full py-4">
                    <button onClick={guardManage} className='w-full sm:w-[48%] bg-blue-ribbon-600 text-white-100 font-bold rounded-md p-4 text-sm sm:text-sm lg:text-lg flex flex-row items-center justify-center gap-x-2'><LuParkingCircle className="text-3xl"/>ADMINISTRAR ESTACIONAMIENTO</button>
                    <button onClick={reservationHistory} className='w-full sm:w-[48%] bg-blue-ribbon-600 text-white-100 font-bold rounded-md p-4 text-sm sm:text-sm lg:text-lg flex flex-row items-center justify-center gap-x-2'><LuHistory className="text-3xl"/>HISTORIAL DE RESERVAS</button>
                    <button onClick={null} className='w-full sm:w-[48%] bg-blue-ribbon-600 text-white-100 font-bold rounded-md p-4 text-sm sm:text-sm lg:text-lg flex flex-row items-center justify-center gap-x-2'><FaCheck className='text-2xl'/> CONFIRMAR RESERVA</button>
                </div>
                <div className="h-full w-full bg-customGreen flex flex-col justify-center px-4 py-4 rounded-lg font-semibold">
                    <h1>• Todo conductor debe mostrar su cédula de identidad o licencia de conducir para validar su nombre y RUT.</h1>
                    <h1>• En caso de tener algún imprevisto con la patente, puede validarse con algún documento.</h1>
                    <h1>• Para liberar estacionamiento, se debe ingresar la patente del vehículo que va a retirarse.</h1>
                </div>
            </div>
        </div>
    );
}
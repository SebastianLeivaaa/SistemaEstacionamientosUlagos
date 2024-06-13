import { useState, useEffect } from "react";
import Ulogo from "../../assets/img/Ulogo.png";
import Chinquihue from "../../assets/img/Chinquihue.png";
import { LuHistory } from "react-icons/lu";
import { HiOutlineLogin } from "react-icons/hi";
import { FaCarAlt } from "react-icons/fa";
import { FaMapMarked } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { TiWarning } from "react-icons/ti";
import { UserQR } from "../../components/userQR";


export const Usermenu = () => {
    const [user, setUser] = useState({
        email: "",
        userName: "",
        userRut: "",
        userLastNamePat: "",
        userLastNameMat: "",
    })
    const [parkingSpaces, setParkingSpaces] = useState(null);
    const navigate = useNavigate();

    const getProfile = async () => {
        try{
            const response = await axios.get("/api/login", {withCredentials: true});
            setUser({
                email: response.data.email,
                userName: response.data.userName,
                userRut: response.data.userRut,
                userLastNamePat: response.data.userLastNamePat,
                userLastNameMat: response.data.userLastNameMat,
            });
        }catch(error){
            navigate("/");
        }
    }

    const getParkingSpaces = async () => {
        try{
            const response = await axios.get("http://localhost:3090/api/parkingSpaces", {withCredentials: true});
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

    const manageVehicle = () => {
        navigate('/manage-vehicle');
    }
    const reservations = () =>{
        navigate('/reservations');
    }
    const reserve = () =>{
        navigate('/user-reserve');
    }
    const textColor = parkingSpaces <= 15 ? 'text-red-500' : 'text-green-600';

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg">
            <div className="flex flex-col items-center p-8 gap-y-8 rounded-md max-md:w-[75%] w-[50%] max-md:px-4 max-md:py-8 bg-white-50">
                <div className="flex flex-wrap lg:flex-row w-full justify-end sm:justify-between lg:justify-between">
                    <img src={Ulogo} alt="Logo Ulagos" className="px-5 w-full sm:w-60 h-auto"/>
                    <div className="flex flex-col items-end justify-end max-xs:justify-center max-xs:items-center mt-4">
                        <h1 className="text-lg font-bold text-center max-md:text-base text-congress-blue-900">{user.userName.toLocaleUpperCase()} {user.userLastNamePat.toLocaleUpperCase()} {user.userLastNameMat.toLocaleUpperCase()}</h1>
                        <button onClick={logOut} className="mt-4 bg-white font-bold text-red-600  text-lg  flex flex-row items-center justify-center gap-x-1 max-md:text-base"><HiOutlineLogin className="text-3xl max-md:text-2xl"/>CERRAR SESIÓN</button>
                    </div>
                </div>
                <div className="w-full flex flex-col items-center justify-center gap-y-4">
                    <UserQR rut={user.userRut} size={200}/>
                    <h1 className="text-2xl max-md:text-lg font-bold italic">TU CÓDIGO QR</h1>
                </div>
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
                <div className="flex flex-col max-xs:gap-y-4 w-full items-center gap-y-8">
                    <div className="flex flex-col sm:flex-row justify-between w-[90%] max-xs:w-[100%] gap-y-4">
                        <button onClick={reserve} className="w-full sm:w-[48%] bg-blue-ribbon-600 text-white-100 font-bold rounded-md p-4 text-sm sm:text-sm lg:text-lg flex flex-row items-center justify-center gap-x-2"><FaCarAlt className="text-3xl"/>RESERVAR ESTACIONAMIENTO</button>
                        <button onClick={reservations} className="w-full sm:w-[48%] bg-blue-ribbon-600 text-white-100 font-bold rounded-md p-4 text-sm sm:text-sm lg:text-lg flex flex-row items-center justify-center gap-x-2"><LuHistory className="text-3xl"/>MIS RESERVAS</button>                
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between w-[90%] max-xs:w-[100%] gap-y-4">
                        <button  className="w-full sm:w-[48%] bg-blue-ribbon-600 text-white-100 font-bold rounded-md p-4 text-sm sm:text-sm lg:text-lg flex flex-row items-center justify-center gap-x-2"><FaMapMarked className="text-3xl"/>MAPA DE ESTACIONAMIENTO</button>
                        <button onClick={manageVehicle} className="w-full sm:w-[48%] bg-blue-ribbon-600 text-white-100 font-bold rounded-md p-4 text-sm sm:text-sm lg:text-lg flex flex-row items-center justify-center gap-x-2"><FaCarAlt className="text-3xl"/>ACTUALIZAR DATOS DE VEHÍCULO</button>                
                    </div>
                </div>
            </div>
        </div>
    );
}
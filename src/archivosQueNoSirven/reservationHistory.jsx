import React, {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import { HiOutlineLogin } from "react-icons/hi";
import Ulogo from "../../assets/img/Ulogo.png";
import axios from "axios";
import { SearchByPatent } from "../components/searchByPatent";
import { SearchByRut } from "../components/searchByRut";
import { SearchByDate } from "../components/searchByDate";


export const ReservationHistory = () => {

    const [user, setUser] = useState({
        email: "",
        userName: "",
        userLastNamePat: "",
        userLastNameMat: "",
    });

    const [current, setCurrent] = useState('patente');
    const navigate = useNavigate();

    const logOut = async () => {
        const response = await axios.get("/api/logout", {withCredentials: true});
        navigate('/');
    };

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
    };

    const handlePatenteClick = () => {
        setCurrent('patente');
    }

    const handleRutClick = () => {
        setCurrent('rut');
    }

    const handleDateClick = () => {
        setCurrent('fecha');
    }


    useEffect(() => {
        getProfile();
    }, []);

    return(
        <div className="w-screen min-h-screen flex items-center justify-center py-16">
            <div className="flex flex-col h-[800px] w-[50%] overflow-y-scroll p-8 gap-y-8 rounded-md max-md:w-[75%] max-md:px-4 max-md:py-8 bg-white-50 relative">
                <div className="flex flex-wrap sm:flex-row w-full justify-between">
                    <img src={Ulogo} alt="Logo Ulagos" className="px-5 w-full sm:w-60 h-auto" />
                    <div className="flex flex-col items-end justify-end max-sm:w-full max-sm:justify-center max-sm:items-center">
                        <h1 className="text-lg font-bold text-center max-md:text-base text-congress-blue-900">{user.userName.toLocaleUpperCase()} {user.userLastNamePat.toLocaleUpperCase()} {user.userLastNameMat.toLocaleUpperCase()}</h1>
                        <button onClick={logOut} className="mt-4 bg-white font-bold text-red-600 text-lg flex flex-row items-center justify-center gap-x-1 max-md:text-base"><HiOutlineLogin className="text-3xl max-md:text-2xl" />CERRAR SESIÓN</button>
                    </div>
                </div>
                <div className='flex flex-col items-center gap-y-4'>
                    <h1 className='font-bold text-2xl mt-10 text-center'>HISTORIAL DE RESERVAS</h1>
                    <h2 className='text-xl text-center'>Buscar por</h2>
                </div>
                <div className="flex flex-row justify-evenly w-full">
                    <button onClick={handlePatenteClick} className={`${current === 'patente' ? 'bg-blue-ribbon-600 text-white-50' : 'bg-white-50 text-black'}  px-8 py-2 rounded-md text-base font-semibold hover:bg-blue-ribbon-600 hover:text-white-50 max-md:text-sm max-md:px-2`} disabled={current === 'patente'}>
                        PATENTE
                    </button>
                    <button onClick={handleRutClick} className={`${current === 'rut' ? 'bg-blue-ribbon-600 text-white-50' : 'bg-white-50 text-black'}  px-8 py-2 rounded-md text-base font-semibold hover:bg-blue-ribbon-600 hover:text-white-50 max-md:text-sm max-md:px-2`} disabled={current === 'rut'}>
                        RUT
                    </button>
                    <button onClick={handleDateClick} className={`${current === 'fecha' ? 'bg-blue-ribbon-600 text-white-50' : 'bg-white-50 text-black'}  px-8 py-2 rounded-md text-base font-semibold hover:bg-blue-ribbon-600 hover:text-white-50 max-md:text-sm max-md:px-2`} disabled={current === 'fecha'}>
                        FECHA
                    </button>
                </div>
                <div className='w-full px-24 py-8 flex flex-col gap-y-12 max-md:w-[100%] max-md:py-0 max-md:px-4 items-center justify-center'>
                    {current === 'patente' ? (
                        <SearchByPatent/>
                    ) : current === 'rut' ? (
                        <SearchByRut/>
                    ) : (
                        <SearchByDate/>
                    )}
                </div>
            </div>
        </div>
    )
}
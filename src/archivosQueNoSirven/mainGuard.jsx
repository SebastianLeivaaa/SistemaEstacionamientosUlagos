import React, {useState} from "react"; 
import {FaArrowLeft} from "react-icons/fa";
import Ulogo from "../../assets/img/Ulogo.png";
import { GuardRelease } from "./guardrelease";
import { GuardGrant } from "./guardgrant";
import { useNavigate } from 'react-router-dom';


export const MainGuard = () => {
    const navigate = useNavigate();
    const [manage, setManage] = useState(true); //Estado para manejar si se encuentra en el login o en el registro

    //Controlador para cambiar el estado al hacer click en el botón de login
    const handleManageClick = () => {
        setManage(true);
    }

    //Controlador para cambiar el estado al hacer click en el botón de registro
    const handleReleaseClick = () => {
        setManage(false);
    }

    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <div className="bg-white-50 flex flex-col items-center p-12 gap-y-8 rounded-md max-md:w-[75%] max-md:px-4 max-md:py-8 max-h-[90%] overflow-y-scroll shadow-white-900 shadow-3xl">
                <img src={Ulogo} alt="Logo Ulagos"/>
                <div className="flex justify-start w-full"><button className="text-blue-ribbon-600" onClick={() => navigate('/guard')}> <FaArrowLeft className="w-6 h-6" /></button></div>
                <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row justify-around w-full">
                    <button onClick={handleManageClick} className={`${manage ? 'bg-blue-ribbon-600 text-white-50' : 'bg-white-50 text-black'}  px-4 py-2 rounded-md text-lg hover:bg-blue-ribbon-600 hover:text-white-50 max-md:text-base max-md:px-2`} disabled={manage}>Otorgar Estacionamiento</button>
                    <button onClick={handleReleaseClick} className={`${!manage ? 'bg-blue-ribbon-600 text-white-50' : 'bg-white-50 text-black'} px-4 py-2 rounded-md text-lg hover:bg-blue-ribbon-600 hover:text-white-50 max-md:text-base`} disabled={!manage}>Liberar Estacionamiento</button>
                </div>
                {manage ? <GuardGrant/> : < GuardRelease/>}
            </div>
        </div>
    );
}
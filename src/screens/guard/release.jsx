import {React} from 'react';
import Ulogo from "../../assets/img/Ulogo.png"; 
import { FaCheckCircle } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export const Release = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { estacionamiento } = location.state
    return (
        <div className="min-h-screen border-blue-ribbon-600 flex items-center justify-center">
            <div className="bg-white-50 p-8 rounded-lg shadow-md w-full max-w-4xl">
                <div className='flex flex-col items-center'>
                    <img src={Ulogo} alt="Universidad De Los Lagos" className="h-20 mb-14" />
                    <FaCheckCircle className="text-[180px] text-blue-500 mb-4"/>
                    <h1 className='mb-28 font-bold text-xl'>¡LIBERACIÓN EXITOSA!</h1>
                    <h1 className='flex flex-row text-4xl mb-10 '>SE <span className='font-bold px-3'>LIBERÓ</span> EL ESTACIONAMIENTO: {estacionamiento}</h1>
                    <button type="button" onClick={() => navigate('/guard')} className="mb-14 text-white-50 rounded-md bg-blue-ribbon-600 hover:bg-blue-ribbon-700 p-1.5 px-3 flex flex-row items-center gap-x-2 font-semibold">
                        <IoHome/>
                        Volver al menú principal
                    </button>
                </div>
                
                
            </div>
        </div>
    );
}

export default Release;

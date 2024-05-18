import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { Indice } from "../components/indice";
import Ulogo from "../assets/img/Ulogo.png";


export const SignInFinal = () => {
    const navigate = useNavigate();
    return(
        <div className="h-screen w-screen flex items-center justify-center">
            <div className="bg-white-50 flex flex-col items-center p-12 gap-y-8 rounded-md max-md:w-[75%] max-md:px-4 max-md:py-8 max-h-[90%] overflow-y-scroll shadow-white-900 shadow-3xl">
                <img src={Ulogo} alt="Logo Ulagos"/>
                <h1 className="text-2xl font-bold text-center max-md:text-base">ESTACIONAMIENTOS ULAGOS</h1>
                <div className="flex flex-row justify-around w-full">
                    <button onClick={() => {navigate('/')}} className="bg-white-50 text-black px-4 py-2 rounded-md text-lg hover:bg-blue-ribbon-600 hover:text-white-50 max-md:text-base max-md:px-2">Iniciar Sesión</button>
                    <button className="bg-blue-ribbon-600 text-white-50 px-4 py-2 rounded-md text-lg hover:bg-blue-ribbon-600 hover:text-white-50 max-md:text-base" disabled>Registrarse</button>
                </div>
                <div className="w-full col-span-2">
                    <Indice
                        fase="4"
                    />
                    <section className="mt-16 w-[100%] flex flex-col gap-y-8 px-24">
                        <div className="flex flex-col gap-y-8 items-center">
                            <FaCheckCircle className="text-[200px] text-blue-500"/>
                            <h1 className="text-2xl font-bold text-gray-900 ">¡TE HAS REGISTRADO EXITOSAMENTE!</h1>
                            <button onClick={() => {navigate('/');}} className="text-white-50 mt-4 rounded-md bg-blue-600 hover:bg-blue-700 p-1.5 px-6 flex flex-row items-center gap-x-1 w-auto font-bold"><IoHome className="text-xl"/> VOLVER AL INICIO</button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
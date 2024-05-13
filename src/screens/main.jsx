import React, {useState} from "react"; 
import Ulogo from "../assets/img/Ulogo.png";
import { Login } from "./login";
import { SignIn } from "./signIn";


export const Main = () => {
    const [login, setLogin] = useState(true); //Estado para manejar si se encuentra en el login o en el registro

    //Controlador para cambiar el estado al hacer click en el botón de login
    const handleLoginClick = () => {
        setLogin(true);
    }

    //Controlador para cambiar el estado al hacer click en el botón de registro
    const handleSignInClick = () => {
        setLogin(false);
    }

    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <div className="bg-white flex flex-col items-center p-12 gap-y-8 rounded-md max-md:h-[75%] max-md:w-[75%] max-md:px-4 max-md:py-8">
                <img src={Ulogo} alt="Logo Ulagos"/>
                <h1 className="text-2xl font-bold text-center max-md:text-base">ESTACIONAMIENTOS ULAGOS</h1>
                <div className="flex flex-row justify-around w-full">
                    <button onClick={handleLoginClick} className={`${login ? 'bg-blue-ribbon-600 text-white' : 'bg-white text-black'}  px-4 py-2 rounded-md text-lg hover:bg-blue-ribbon-600 hover:text-white max-md:text-base max-md:px-2`} disabled={login}>Iniciar Sesión</button>
                    <button onClick={handleSignInClick} className={`${!login ? 'bg-blue-ribbon-600 text-white' : 'bg-white text-black'} px-4 py-2 rounded-md text-lg hover:bg-blue-ribbon-600 hover:text-white max-md:text-base`} disabled={!login}>Registrarse</button>
                </div>
                {login ? <Login/> : <SignIn/>}
            </div>
        </div>
    );
}
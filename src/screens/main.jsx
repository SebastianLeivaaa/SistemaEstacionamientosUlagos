import React, { useState, useEffect } from "react";
import Ulogo from "../assets/img/logoParkingUlagos.png";
import { Login } from "./login";
import { SignIn } from "./signIn";
import { TopBarMain } from "./user/topBarMain"

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
    const [darkToggle, setDarkToggle] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme ? savedTheme === 'dark' : true;
    });

    const handleDarkToggle = () => {
    setDarkToggle(!darkToggle);
    };
    useEffect(() => {
        const interval = setInterval(() => {
            getProfile();
        }, 10000);
    
        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        if (darkToggle) {
            document.documentElement.classList.add("dark");
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem('theme', 'light');
        }
      }, [darkToggle]);
    return (
     <div className=" grid grid-cols-1 h-screen bg-white-50 dark:bg-midnight-950 ">
        <TopBarMain  handleDarkToggle={handleDarkToggle} darkToggle={darkToggle}/>
        <div className="scrollbar-hide flex grid-cols-2 items-center justify-center md:px-4 bg-white-50 dark:bg-midnight-950">
            <div className="scrollbar-hide bg-white-50 dark:bg-midnight-950 flex flex-col items-center p-10 gap-y-8 rounded-md max-md:w-[75%] max-md:h-[100%] max-xs:w-[85%] max-md:px-4 max-md:py-8 max-h-[100%] overflow-y-scroll shadow-black-900 shadow-3xl">
            <img src={Ulogo} className="w-1/4" alt="Logo Ulagos"/>
                <h1 className="text-2xl font-bold text-center text-black dark:text-white-50 max-md:text-base">ESTACIONAMIENTOS ULAGOS</h1>
                <div className="flex flex-row justify-around w-full">
                    <button onClick={handleLoginClick} className={`${login ? 'bg-midnight-600' : 'bg-white-50'} text-black font-semibold  px-4 py-2 rounded-md text-lg hover:bg-blue-ribbon-600 hover:text-white-50 max-md:text-base max-md:px-2`} disabled={login}>Iniciar Sesión</button>
                    <button onClick={handleSignInClick} className={`${!login ? 'bg-midnight-600' : 'bg-white-50'} text-black font-semibold  px-4 py-2 rounded-md text-lg hover:bg-blue-ribbon-600 hover:text-white-50 max-md:text-base max-md:px-2`} disabled={!login}>Registrarse</button>
                </div>
                {login ? <Login/> : <SignIn/>}
            </div>
        </div>
     </div>
    );
}
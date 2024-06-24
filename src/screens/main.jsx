import React, { useState, useEffect } from "react";
import Ulogo from "../assets/img/logoParkingUlagos.png";
import { Login } from "./login";
import { SignIn } from "./signIn";
import { TopBarMain } from "./user/topBarMain";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Recover } from "./recover";

export const Main = () => {
    const [login, setLogin] = useState(true); 
    const navigate = useNavigate();
    const [handleRecoverOne, setHandleRecoverOne] = useState(false);

    const handleLoginClick = () => {
        setLogin(true);
    }

    const handleSignInClick = () => {
        setLogin(false);
    }

    const handleRecover = () => {
        setHandleRecoverOne(!handleRecoverOne);
    }

    const [darkToggle, setDarkToggle] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme ? savedTheme === 'dark' : true;
    });

    const handleDarkToggle = () => {
        setDarkToggle(!darkToggle);
    };

    const getProfile = async () => {
        try {
          const response = await axios.get("/api/login", {
            withCredentials: true,
          });
          if (response.data.IsGuard) {
            navigate('/base-layout2');
            } else {
            navigate('/base-layout');
            }
        } catch (error) {
          navigate("/");
        }
      };

    useEffect(() => {
        getProfile();
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
        <div className="flex flex-col w-screen h-screen bg-white-50 dark:bg-midnight-950">
            <TopBarMain handleDarkToggle={handleDarkToggle} darkToggle={darkToggle} />
            <div className="scrollbar-hide flex flex-col m-auto items-center justify-center h-[80%] max-xs:w-full max-h-[80%] md:px-4 bg-white-50 dark:bg-midnight-950 transition-all duration-700 ease-in-out">
                <div className={`scrollbar-hide overflow-y-auto bg-white-50 dark:bg-midnight-950 h-full flex flex-col w-fit items-center p-10 gap-y-8 rounded-md max-md:w-[100%] max-md:h-full max-xs:w-[85%] max-md:px-4 max-md:py-8 max-h-full shadow-black-900 shadow-3xl transition-width duration-700 ease-in-out ${login ? 'w-login' : 'w-signin'}`}>
                    <div className="flex flex-row gap-x-2 items-center justify-center">
                        <img src={Ulogo} className="w-[70px]" alt="Logo Ulagos" />
                    </div>
                    {handleRecoverOne ? (
                        <Recover handleRecover={handleRecover}/>
                    ): (
                        <>
                            <div className="flex flex-row justify-center w-full">
                                <button onClick={handleLoginClick} className={`${login ? 'bg-midnight-700 text-white-50 dark:text-white-50' : 'bg-white-50 dark:bg-midnight-950 text-black dark:text-white-50 hover:bg-midnight-700 hover:text-white-50 hover:dark:bg-midnight-700 hover:dark:text-white-50'} font-semibold px-4 py-2 rounded-l-md border-[0.5px] border-gray-700 text-lg max-md:text-base max-md:px-2`} disabled={login}>Iniciar Sesión</button>
                                <button onClick={handleSignInClick} className={`${!login ? 'bg-midnight-700 text-white-50' : 'bg-white-50 dark:bg-midnight-950 text-black dark:text-white-50 hover:bg-midnight-700 hover:text-white-50 hover:dark:bg-midnight-700 hover:dark:text-white-50'} font-semibold px-4 py-2 rounded-r-md border-[0.5px] border-gray-700 text-lg max-md:text-base max-md:px-2`} disabled={!login}>Registrarse</button>
                            </div>
                            {login ? <Login handleRecover={handleRecover}/> : <SignIn handleLoginClick={handleLoginClick}/>}  
                        </>
                    )}                
                </div>
            </div>
        </div>
    );
}

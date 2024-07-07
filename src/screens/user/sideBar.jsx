import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MdDashboard, MdLocalParking, MdHistory, MdDirectionsCarFilled, MdLogout } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { ProfileInfo } from "../../components/profileInfo";

export const SideBar = ({ onToggleMenu, handleToggleMenu, userName, userLastNamePat, userLastNameMat, userEmail, handleCurrentPage, currentPage }) => {
    const [isMaxLG, setIsMaxLG] = useState(window.innerWidth <= 1280);
    const navigate = useNavigate();
    const sidebarRef = useRef(null);

    const logOut = async () => {
        const response = await axios.get("/api/logout", { withCredentials: true });
        navigate('/');
    }

    const handleClickOutside = (event) => {
        if (isMaxLG && onToggleMenu && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            handleToggleMenu(); 
        }
    };

    const handleResize = () => {
        const newIsMaxLG = window.innerWidth <= 1280;
        if (newIsMaxLG !== isMaxLG) {
            setIsMaxLG(newIsMaxLG);
            if (newIsMaxLG && onToggleMenu) {
                handleToggleMenu();
            }
        }
    };

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [isMaxLG, onToggleMenu]);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMaxLG, onToggleMenu]);

    return (
        <div className={`w-[256px] h-full fixed overflow-y-auto z-20 flex flex-col bg-white-50 dark:bg-midnight-950 border-r-[1px] border-white-400 dark:border-white-700 gap-y-6 p-3 transition-all duration-300 ease-in-out ${onToggleMenu ? "visible translate-x-0" : "invisible -translate-x-full"}`} ref={sidebarRef}>
            <nav className="flex flex-col w-full gap-y-4">
                <div className="flex flex-row w-full justify-end items-center">
                    <button className="dark:text-white-50 text-black max-lg:text-3xl 2xl:invisible" onClick={handleToggleMenu}>
                        <RxCross2 className="text-3xl "/>
                    </button>
                </div>
                <ProfileInfo name={userName} lastNamePat={userLastNamePat} lastNameMat={userLastNameMat} email={userEmail}/>
                <div className="flex flex-col gap-y-4 py-4">
                    <h1 className="dark:text-white-50 text-black">Menú principal</h1>
                    <button
                        onClick={() => {
                            handleCurrentPage('/dashboard-user');
                            if(isMaxLG) handleToggleMenu();
                        }}
                        className={`p-4 px-2 flex flex-row gap-x-2 items-center rounded-md ${currentPage === '/dashboard-user' ? 'bg-midnight-700 dark:bg-midnight-500 text-white-50 dark:text-black' : 'text-black dark:text-white-50 hover:bg-midnight-700 hover:text-white-50 hover:dark:bg-midnight-500 hover:dark:text-black'}`}>
                        <MdDashboard /> Dashboard
                    </button>
                    <button
                        onClick={() => {
                            handleCurrentPage('/reserve-parking');
                            if(isMaxLG) handleToggleMenu();
                        }}
                        className={`p-4 px-2 flex flex-row gap-x-2 items-center rounded-md ${currentPage === '/reserve-parking' ? 'bg-midnight-700 dark:bg-midnight-500 text-white-50 dark:text-black' : 'text-black dark:text-white-50 hover:bg-midnight-700 hover:text-white-50 hover:dark:bg-midnight-500 hover:dark:text-black'}`}>
                        <MdLocalParking /> Reservar parking
                    </button>
                    <button
                        onClick={() => {
                            handleCurrentPage('/my-reservations');
                            if(isMaxLG) handleToggleMenu();
                        }}
                        className={`p-4 px-2 flex flex-row gap-x-2 items-center rounded-md ${currentPage === '/my-reservations' ? 'bg-midnight-700 dark:bg-midnight-500 text-white-50 dark:text-black' : 'text-black dark:text-white-50 hover:bg-midnight-700 hover:text-white-50 hover:dark:bg-midnight-500 hover:dark:text-black'}`}>
                        <MdHistory /> Mis reservas
                    </button>
                    <button
                        onClick={() => {
                            handleCurrentPage('/my-vehicles');
                            if(isMaxLG) handleToggleMenu();
                        }}
                        className={`p-4 px-2 flex flex-row gap-x-2 items-center rounded-md ${currentPage === '/my-vehicles' ? 'bg-midnight-700 dark:bg-midnight-500 text-white-50 dark:text-black' : 'text-black dark:text-white-50 hover:bg-midnight-700 hover:text-white-50 hover:dark:bg-midnight-500 hover:dark:text-black'}`}>
                        <MdDirectionsCarFilled /> Mis vehículos
                    </button>
                </div>
                <div className="flex flex-row p-4">
                    <button onClick={logOut} className="mt-4 bg-white font-bold text-black hover:text-midnight-700 dark:text-white-50 dark:hover:text-midnight-300 text-lg flex flex-row items-center justify-center gap-x-1 max-md:text-base">
                        <MdLogout className="text-3xl max-md:text-2xl" /> CERRAR SESIÓN
                    </button>
                </div>
            </nav>
        </div>
    );
};

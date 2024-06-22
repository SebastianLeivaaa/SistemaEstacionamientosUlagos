import React, {useState, useEffect} from "react";
import { FaMoon, FaSun, FaBars } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import iconWeb from "../../assets/img/logoParkingUlagos.png";

export const TopBar = ( {handleToggleMenu, handleDarkToggle, darkToggle } ) => {

    
    return(
        <div className="w-full h-16 flex justify-between items-center px-4 py-2 border-b-[1px] border-white-400 dark:border-white-700">
            <button className="dark:text-white-50 text-black max-lg:text-3xl" onClick={handleToggleMenu}>
                <FaBars className="text-3xl"/>
            </button>
            <div className="h-full gap-x-4 flex flex-row justify-end">
                <button className="text-midnight-950 dark:text-white-50 text-xl max-lg:text-3xl" onClick={handleDarkToggle}>
                    {darkToggle ? <FaSun /> : <FaMoon />}
                </button>
                <img src={iconWeb} alt="ParkingUlagos" className="h-full" />
            </div>
        </div>
    );
};
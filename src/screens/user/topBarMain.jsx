import React, {useState, useEffect} from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

export const TopBarMain = ( {handleDarkToggle, darkToggle } ) => {

    
    return(
        <div className="w-full h-16 flex justify-end items-center px-4 py-2 border-b-[1px] border-white-400 dark:border-white-700">

            <div className="h-full gap-x-4 flex flex-row justify-end">
                <button className="text-midnight-950 dark:text-white-50 text-xl max-lg:text-3xl" onClick={handleDarkToggle}>
                    {darkToggle ? <FaSun /> : <FaMoon />}
                </button>
            </div>
        </div>
    );
};
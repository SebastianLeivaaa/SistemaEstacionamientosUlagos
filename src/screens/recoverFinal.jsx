import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoHome } from "react-icons/io5";

export const RecoverFinal = ({handleRecover}) => {
    return(
        <div className="flex flex-col px-4 gap-x-6 gap-y-8 max-xs:p-2">
            <h1 className="text-2xl font-bold text-center max-md:text-base text-black dark:text-white-50">RECUPERAR CONTRASEÑA</h1>
            <div className="w-full col-span-2">
                <section className="w-[100%] flex flex-col gap-y-8 px-2">
                    <div className="flex flex-col gap-y-8 items-center">
                        <FaCheckCircle className="text-[200px] text-blue-500"/>
                        <h1 className="text-sm sm:text-2xl font-bold text-black dark:text-white-50 text-center">¡SE HA CAMBIADO TU CONTRASEÑA EXITOSAMENTE!</h1>
                        <button onClick={handleRecover} className="text-white-50 mt-4 rounded-md bg-blue-600 hover:bg-blue-700 p-1.5 px-6 flex flex-row items-center gap-x-1 w-auto font-bold"><IoHome className="text-xl"/> VOLVER AL INICIO</button>
                    </div>
                </section>
            </div>
        </div>
    );
}
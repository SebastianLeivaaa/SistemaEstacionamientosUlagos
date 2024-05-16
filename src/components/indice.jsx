import React from "react"; 
import { FaCheck } from "react-icons/fa";


export const Indice = ( props ) => {

    return (
        <div className="w-full h-20 bg-blue-ribbon-600 flex items-center">
            <div className="w-full flex flex-row items-center p-6 justify-center">
                <div className="flex items-center">
                    <div className="md:pl-4">
                        <div className={`${props.fase >= 1 ? "bg-indice-50" : "bg-indice-100"} w-6 h-6 text-white-50 rounded-full flex items-center justify-center`}>
                            {props.fase <= 1 ? <h1 className="font-semibold">1</h1> : <FaCheck className="text-congress-blue-950" />}
                        </div>
                    </div>
                    <h1 className={`${props.fase == "1" ? "font-semibold" : ""} whitespace-nowrap text-white-50 px-1.5`}>Completar datos</h1>
                </div>
                <div className="hidden md:flex items-center">
                    <hr className="text-white-50 w-4 md:w-16" />
                    <div className="pl-4">
                        <div className={`${props.fase >= 2 ? "bg-indice-50" : "bg-indice-100"} w-6 h-6 text-white-50 rounded-full flex items-center justify-center`}>
                            {props.fase <= 2 ? <h1 className="font-semibold">2</h1> : <FaCheck className="text-congress-blue-950" />}
                        </div>
                    </div>
                    <h1 className={`${props.fase == "2" ? "font-semibold" : ""} whitespace-nowrap text-white-50 px-1.5`}>Crear clave</h1>
                    <hr className="text-white-50 w-4 md:w-16" />
                    <div className="pl-4">
                        <div className={`${props.fase >= 3 ? "bg-indice-50" : "bg-indice-100"} w-6 h-6 text-white-50 rounded-full flex items-center justify-center`}>
                            {props.fase <= 3 ? <h1 className="font-semibold">3</h1> : <FaCheck className="text-congress-blue-950" />}
                        </div>
                    </div>
                    <h1 className={`${props.fase == "3" ? "font-semibold" : ""} whitespace-nowrap text-white-50 px-1.5`}>Confirmar cuenta</h1>
                </div>
            </div>
        </div>
    );
};
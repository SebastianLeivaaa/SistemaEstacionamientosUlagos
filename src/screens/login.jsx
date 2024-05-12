import React from "react";
import { MdEmail } from "react-icons/md";
import { MdLock } from "react-icons/md";
import { MdLogin } from "react-icons/md";
import { PasswordInput } from "../components/passwordInput";

export const Login = () => {

    return (
        <div className="h-full w-full flex flex-col items-center justify-center gap-y-8 mt-8">
            <form className="flex flex-col items-center gap-y-8 w-full">
                <div className="w-full flex flex-row">
                    <input type="text" className="w-[90%] p-2 border-[0.5px] border-blue-ribbon-600 max-md:w-[85%] " placeholder="Correo Electrónico"/>
                    <div className="w-[10%] border-[0.5px] border-l-[0px] border-blue-ribbon-600 flex items-center justify-center max-md:w-[15%]">
                        <MdEmail className="text-blue-ribbon-600 text-2xl"/>
                    </div>
                </div>
                <div className="w-full flex flex-row">
                    <PasswordInput/>
                    <div className="w-[10%] border-[0.5px] border-l-[0px] border-blue-ribbon-600 flex items-center justify-center max-md:w-[15%]">
                        <MdLock className="text-blue-ribbon-600 text-2xl"/>
                    </div>
                </div>
                <button className="mt-8 w-full bg-blue-ribbon-600 font-bold text-white px-4 py-2 rounded-md text-lg hover:bg-blue-ribbon-700 flex flex-row items-center justify-center gap-x-2 max-md:text-base"><MdLogin className="text-3xl max-md:text-2xl"/> INGRESAR</button>
            </form>
            <button className="text-blue-ribbon-500 text-lg max-md:text-base">¿Olvidaste tu contraseña?</button>
        </div>
    );
}
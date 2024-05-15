import React, { useState } from 'react';
import { MdEmail } from "react-icons/md";
import { MdLock } from "react-icons/md";
import { MdLogin } from "react-icons/md";
import { PasswordInput } from "../components/passwordInput";

export const Login = () => {
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
        const response = await fetch('/api/sesion', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userEmail, password }),
        });

        if (!response.ok) {
            const { error } = await response.json();
            throw new Error(error);
        }

        const { token } = await response.json();
        localStorage.setItem('token', token);
        
        // Redireccionar al usuario a la página después del inicio de sesión exitoso
        window.location.href = '/user'; 
        } catch (error) {
        setError(error.message);
        }
    };

    return (
        <div className="h-full w-full flex flex-col items-center justify-center gap-y-8 mt-8">
            {error && <p>{error} {userEmail} {password}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-y-8 w-full">
                <div className="w-full flex flex-row">
                    <input type="text" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className="w-[90%] p-2 border-[0.5px] border-blue-ribbon-600 max-md:w-[85%] " placeholder="Correo Electrónico"/>
                    <div className="w-[10%] border-[0.5px] border-l-[0px] border-blue-ribbon-600 flex items-center justify-center max-md:w-[15%]">
                        <MdEmail className="text-blue-ribbon-600 text-2xl"/>
                    </div>
                </div>
                <div className="w-full flex flex-row">
                    <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <div className="w-[10%] border-[0.5px] border-l-[0px] border-blue-ribbon-600 flex items-center justify-center max-md:w-[15%]">
                        <MdLock className="text-blue-ribbon-600 text-2xl"/>
                    </div>
                </div>
                <button type="submit" className="mt-8 w-full bg-blue-ribbon-600 font-bold text-white-50 px-4 py-2 rounded-md text-lg hover:bg-blue-ribbon-700 flex flex-row items-center justify-center gap-x-2 max-md:text-base"><MdLogin className="text-3xl max-md:text-2xl"/> INGRESAR</button>
            </form>
            <button className="text-blue-ribbon-500 text-lg max-md:text-base">¿Olvidaste tu contraseña?</button>
        </div>
    );
}
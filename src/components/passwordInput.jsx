import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export const PasswordInput = (props) => {
    const [showPassword, setShowPassword] = useState(false); //Estado para mostrar y ocultar la clave

    //Controlador para cambiar el estado de la clave
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="relative w-[100%] max-md:w-[100%]">
            <input
                id={props.id}
                name={props.name}
                onChange={props.onChange}
                type={showPassword ? 'text' : 'password'}
                className="w-full p-2 border-[0.5px] border-blue-ribbon-600" 
                placeholder="Contraseña"
            />
            <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-transparent border-none cursor-pointer text-xl"
                onClick={handleTogglePassword}
            >
                {showPassword ? <FaEyeSlash className='text-blue-ribbon-600 text-2xl' /> : <FaEye className='text-blue-ribbon-600 text-2xl'/>}
            </button>
        </div>
    );
};
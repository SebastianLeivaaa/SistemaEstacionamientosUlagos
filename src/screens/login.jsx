import { useState } from 'react';
import { MdEmail, MdLock, MdLogin } from "react-icons/md";
import { PasswordInput } from "../components/passwordInput";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';


export const Login = () => {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [credentials, setCredencials] = useState({
        email: '',
        password: '',
        userDomain: '@alumnos.ulagos.cl'
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredencials({
            ...credentials,
            [e.target.name]: e.target.value 
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.post(
                'http://localhost:3090/api/sesion',
                { email: credentials.email.toLowerCase() + credentials.userDomain, password: credentials.password },
                { withCredentials: true }
            );
            if (res.data === "usuario") {
                navigate('/base-layout');
            } else {
                navigate('/base-layout2');
            }
        } catch (error) {
            setError("Credenciales incorrectas");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClick = () => {
        navigate('/recover');
    };

    return (
        <div className={`w-full h-full  flex flex-col items-center justify-center gap-y-20 mt-8 ${isLoading ? 'cursor-wait' : ''}`}>
            <form onSubmit={handleSubmit} className="h-[50%] flex flex-col justify-between items-center gap-y-8 w-full">
                <div className="w-full flex flex-row">
                    <div className="w-[95%] flex flex-row">
                        <input id="email" name="email" onChange={handleChange} type="text" className="w-full p-1 bg-gray-100 dark:bg-gray-700 text-black dark:text-white-50 border-[0.5px] border-midnight-700" placeholder="Usuario" />
                        <select id="userDomain" name="userDomain" className=" p-1 bg-gray-100 dark:bg-gray-700 text-black dark:text-white-50 border-[0.5px] border-midnight-70 w-1/2" onChange={handleChange}>
                            <option value="@alumnos.ulagos.cl">@alumnos.ulagos.cl</option>
                            <option value="@ulagos.cl">@ulagos.cl</option>
                        </select>
                    </div>
                    <div className="w-10 border border-blue-ribbon-600 flex items-center justify-center border-l-0">
                        <MdEmail className="text-blue-ribbon-600 text-2xl" />
                    </div>
                </div>
                <div className="w-full  flex flex-row">
                    <PasswordInput onChange={handleChange} name="password" />
                    <div className="w-[10%] border-[0.5px] border-l-[0px] border-blue-ribbon-600 flex items-center justify-center max-md:w-[15%]">
                        <MdLock className="text-blue-ribbon-600 text-2xl" />
                    </div>
                </div>
                {error && <p className='text-red-600'>{error}</p>}
                <button type="submit" className={`mt-9 w-full bg-midnight-700 font-bold text-white-50 px-3 py-3 rounded-md text-lg hover:bg-blue-ribbon-700 flex flex-row items-center justify-center gap-x-2 max-md:text-base ${isLoading ? 'cursor-wait' : ''}`} disabled={isLoading}>
                    {isLoading ? (<ClipLoader color="#FFFFFF" size={24}/>) : (<MdLogin className="text-3xl max-md:text-2xl" />)} INGRESAR
                </button>
            </form>
            <button onClick={handleClick} className="underline text-midnight-600 text-lg max-md:text-base">¿Olvidaste tu contraseña?</button>
        </div>
    );
};


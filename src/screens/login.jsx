import { useState } from 'react';
import { MdEmail, MdLock, MdLogin, MdOutlineRestartAlt } from "react-icons/md";
import { PasswordInput } from "../components/passwordInput";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

export const Login = ({ handleRecover }) => {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [customDomain, setCustomDomain] = useState(false);
    const [credentials, setCredencials] = useState({
        email: '',
        password: '',
        userDomain: '@alumnos.ulagos.cl'
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredencials({
            ...credentials,
            [name]: value
        });
    };

    const handleDomainChange = (e) => {
        let selectedDomain = e.target.value;

        if (selectedDomain === '@') {
            selectedDomain = '@';
            setCustomDomain(true);
        } else {
            setCustomDomain(false);
        }

        setCredencials({
            ...credentials,
            userDomain: selectedDomain
        });
    };

    const handleCustomDomainChange = (e) => {
        let customDomain = e.target.value;

        // Asegurarse de que siempre haya un '@' al inicio
        if (!customDomain.startsWith('@')) {
            customDomain = '@' + customDomain;
        }

        setCredencials({
            ...credentials,
            userDomain: customDomain
        });
    };

    const handleResetDomains = () => {
        setCustomDomain(false);
        setCredencials({
            ...credentials,
            userDomain: '@alumnos.ulagos.cl'
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.post(
                '/api/sesion',
                { email: credentials.email.toLowerCase() + credentials.userDomain, password: credentials.password },
                { withCredentials: true }
            );
            if (res.data === "usuario") {
                navigate('/base-layout');
            } else {
                navigate('/base-layout2');
            }
        } catch (error) {
            if (error.response.status === 401) {
                setError(error.response.data.error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`w-fit h-full flex flex-col items-center justify-center gap-y-10  ${isLoading ? 'cursor-wait' : ''}`}>
            <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-y-6 w-full">
                <div className="w-full flex flex-row">
                    <div className="w-[95%] flex flex-row">
                        <input id="email" name="email" onChange={handleChange} type="text" className="w-[50%] p-1 bg-gray-100 dark:bg-gray-700 text-black dark:text-white-50 border-[0.5px] border-midnight-700" placeholder="Usuario" />
                        {customDomain ? (
                            <input id="customDomain" name="customDomain" onChange={handleCustomDomainChange} value={credentials.userDomain} type="text" className="w-[50%] p-1 bg-gray-100 dark:bg-gray-700 text-black dark:text-white-50 border-[0.5px] border-midnight-700" />
                        ) : (
                            <select id="userDomain" name="userDomain" className="p-1 bg-gray-100 dark:bg-gray-700 text-black dark:text-white-50 border-[0.5px] border-midnight-700 w-1/2" onChange={handleDomainChange} value={credentials.userDomain}>
                                <option value="@alumnos.ulagos.cl">@alumnos.ulagos.cl</option>
                                <option value="@ulagos.cl">@ulagos.cl</option>
                                <option value="@">@</option>
                            </select>
                        )}
                    </div>
                    <div className="w-10 border border-blue-ribbon-600 flex items-center justify-center border-l-0">
                        <MdEmail className="text-blue-ribbon-600 text-2xl" />
                    </div>
                </div>
                <div className="w-full flex flex-row">
                    <PasswordInput onChange={handleChange} name="password" />
                    <div className="w-[10%] border-[0.5px] border-l-[0px] border-blue-ribbon-600 flex items-center justify-center max-md:w-[15%]">
                        <MdLock className="text-blue-ribbon-600 text-2xl" />
                    </div>
                </div>
                {error && <p className='text-red-600 dark:text-red-500'>{error}</p>}
                <div className='flex flex-col w-full gap-y-4'>
                    <button type="submit" className={`w-full bg-midnight-700 font-bold text-white-50 px-3 py-3 rounded-md text-lg hover:bg-blue-ribbon-700 flex flex-row items-center justify-center gap-x-2 max-md:text-base ${isLoading ? 'cursor-wait' : ''}`} disabled={isLoading}>
                        {isLoading ? (<ClipLoader color="#FFFFFF" size={24} />) : (<MdLogin className="text-3xl max-md:text-2xl" />)} INGRESAR
                    </button>
                    {customDomain && (
                        <button type="button" onClick={handleResetDomains} className="w-full bg-gray-800 dark:bg-gray-800 text-white-50 dark:text-white-50 font-bold px-3 py-3 rounded-md text-lg hover:bg-gray-900 flex flex-row items-center justify-center gap-x-2 max-md:text-base">
                            <MdOutlineRestartAlt className="text-3xl max-md:text-2xl"/>
                            Restablecer dominios
                        </button>
                    )}
                </div>
            </form>
            <div className='mt-6'>
                <button onClick={handleRecover} className="underline text-midnight-600 text-lg max-md:text-base">¿Olvidaste tu contraseña?</button>
            </div>
        </div>
    );
};

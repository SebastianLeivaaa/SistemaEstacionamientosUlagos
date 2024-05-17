import { useState} from 'react';
import { MdEmail, MdLock, MdLogin } from "react-icons/md";
import { PasswordInput } from "../components/passwordInput";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Login = () => {
    const [error, setError] = useState('');
    const [credentials, setCredencials] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredencials({
            ...credentials,
            [e.target.name]: e.target.value
        })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                '/api/sesion',
                { email: credentials.email, password: credentials.password },
                { withCredentials: true }
            );
            if(res.data==="usuario"){
                navigate('/user');
            }else{
                navigate('/guard');
            }
            
            
        } catch (error) {
            setError("Credenciales incorrectas");
        }
    };
    const handleClick = () => {
        navigate('/recover');
    };
    return (
        <div className="h-full w-full flex flex-col items-center justify-center gap-y-8 mt-8">
            
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-y-8 w-full">
                <div className="w-full flex flex-row">
                    <input name="email" type="email" onChange={ handleChange} className="w-[90%] p-2 border-[0.5px] border-blue-ribbon-600 max-md:w-[85%] " placeholder="Correo Electrónico"/>
                    <div className="w-[10%] border-[0.5px] border-l-[0px] border-blue-ribbon-600 flex items-center justify-center max-md:w-[15%]">
                        <MdEmail className="text-blue-ribbon-600 text-2xl"/>
                    </div>
                </div>
                
                <div className="w-full flex flex-row">
                    <PasswordInput   onChange={ handleChange} name="password"/>
                    <div className="w-[10%] border-[0.5px] border-l-[0px] border-blue-ribbon-600 flex items-center justify-center max-md:w-[15%]">
                        <MdLock className="text-blue-ribbon-600 text-2xl"/>
                    </div>
                </div>
                {error && <p className='text-red-600'>{error}</p>}
                <button type="submit" className="mt-8 w-full bg-blue-ribbon-600 font-bold text-white-50 px-4 py-2 rounded-md text-lg hover:bg-blue-ribbon-700 flex flex-row items-center justify-center gap-x-2 max-md:text-base"><MdLogin className="text-3xl max-md:text-2xl"/> INGRESAR</button>
            </form>
            <button onClick={handleClick} className="text-blue-ribbon-500 text-lg max-md:text-base">¿Olvidaste tu contraseña?</button>
        </div>
    );
}

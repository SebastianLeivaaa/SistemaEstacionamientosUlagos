import { useState} from 'react';
import { MdEmail, MdLock, MdLogin } from "react-icons/md";
import { PasswordInput } from "../components/passwordInput";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Login = () => {
    const [error, setError] = useState('');
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
        })
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                '/api/sesion',
                { email: credentials.email + credentials.userDomain , password: credentials.password },
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
                    <div className="w-[95%] flex flex-row border border-blue-ribbon-600 ">
                        <input id="email" name="email"  onChange={handleChange} type="Text" className="w-1/2 p-2 border-r border-blue-ribbon-600" placeholder="Usuario"/>
                        <select id="userDomain" name="userDomain" className="border-l  bg-white-50 w-1/2" onChange={handleChange}>
                            <option>@alumnos.ulagos.cl</option>
                            <option>@ulagos.cl</option>
                        </select>
                    </div>
                    <div className="w-10 border border-blue-ribbon-600 flex items-center justify-center border-l-0">
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
            <button onClick={handleClick} className="underline text-blue-ribbon-500 text-lg max-md:text-base">¿Olvidaste tu contraseña?</button>
        </div>
    );
}

import {useState} from "react";
import { useNavigate } from 'react-router-dom';
import Ulogo from "../assets/img/Ulogo.png";
import { Indice } from "../components/indice";
import { FaCheckCircle, FaCheck } from "react-icons/fa";
import { ClipLoader } from 'react-spinners';
import { PasswordInput } from "../components/passwordInput";
import { useLocation} from "react-router-dom";




export const SignInTwo = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const formData  = location.state.formData;
    const validationPasswordOne = /^.{8,}$/;
    const validationPasswordTwo = /[A-Z]/;
    const validationPasswordThree = /[a-z]/;
    const validationPasswordFour = /[0-9]/;
    const validationPasswordGeneral = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$/;

    const [isLoading, setIsLoading] = useState(false);

    const [passwordData, setPasswordData] = useState({
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({
            ...passwordData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {

            const response = await fetch('/api/send-email', {
                
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const responseData = await response.json();
                const { code, info } = responseData;
                if(info.accepted.length > 0){
                    navigate('/sign-in-three', { state:{ formData: formData, passwordData: passwordData, code: code} });
                }
            } else {
                console.error('Error al enviar el correo electrónico', response);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
        setIsLoading(false);
    };
    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <div className="bg-white-50 flex flex-col items-center p-12 gap-y-8 rounded-md max-md:w-[75%] max-md:px-4 max-md:py-8 max-h-[90%] overflow-y-scroll shadow-white-900 shadow-3xl">
                <img src={Ulogo} alt="Logo Ulagos"/>
                <h1 className="text-2xl font-bold text-center max-md:text-base">ESTACIONAMIENTOS ULAGOS</h1>
                <div className="flex flex-row justify-around w-full">
                    <button onClick={() => {navigate('/')}} className="bg-white-50 text-black px-4 py-2 rounded-md text-lg hover:bg-blue-ribbon-600 hover:text-white-50 max-md:text-base max-md:px-2" >Iniciar Sesión</button>
                    <button className="bg-blue-ribbon-600 text-white-50 px-4 py-2 rounded-md text-lg hover:bg-blue-ribbon-600 hover:text-white-50 max-md:text-base" disabled>Registrarse</button>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col p-4 gap-x-6 gap-y-8 bg-white-50 w-[100%] rounded-2xl">
                    <div className="w-full col-span-2">
                        <Indice
                            fase="2"
                        />
                    </div>
                    <h1 className="font-bold flex justify-start px-2 flex-col w-full col-span-2">CREE SU CONTRASEÑA</h1>
                    <div className="gap-y-1 flex flex-col px-2 ">
                        <label htmlFor="password">Contraseña</label>
                        <PasswordInput id='password' name='password' onChange={handleChange}/>
                    </div>
                    <div className="gap-y-1 flex flex-col px-2">
                        <label htmlFor="confirmPassword">Confirme contraseña</label>
                        <PasswordInput id='confirmPassword' name='confirmPassword' onChange={handleChange}/>
                    </div>
                    <div className="col-span-2 w-[100%] flex flex-col px-2">
                        <ul className="flex flex-col gap-y-2">
                            <li className="flex flex-row gap-x-2 items-end text-xl"><FaCheckCircle className={`h-full ${validationPasswordOne.test(passwordData.password) ? 'text-green-600' : 'text-gray-800'}`}/> <p className="text-base">Debe tener al menos 8 caracteres.</p></li>
                            <li className="flex flex-row gap-x-2 items-end text-xl"><FaCheckCircle className={`h-full ${validationPasswordTwo.test(passwordData.password) ? 'text-green-600' : 'text-gray-800'}`}/> <p className="text-base">Debe contener al menos una letra mayúscula.</p></li>
                            <li className="flex flex-row gap-x-2 items-end text-xl"><FaCheckCircle className={`h-full ${validationPasswordThree.test(passwordData.password) ? 'text-green-600' : 'text-gray-800'}`}/> <p className="text-base">Debe contener al menos una letra minúscula.</p></li>
                            <li className="flex flex-row gap-x-2 items-end text-xl"><FaCheckCircle className={`h-full ${validationPasswordFour.test(passwordData.password) ? 'text-green-600' : 'text-gray-800'}`}/> <p className="text-base">Debe contener al menos un número.</p></li>
                        </ul>
                    </div>
                    <div className="text-end flex w-[100%] col-span-2 items-end justify-end">
                        {validationPasswordGeneral.test(passwordData.password) && passwordData.password === passwordData.confirmPassword ? (
                            <button  onClick={handleSubmit} className="text-white-50 rounded-md bg-blue-600 hover:bg-blue-700 p-1.5 px-3 flex flex-row items-center gap-x-1 font-bold">{isLoading ? (<ClipLoader color="#FFFFFF" size={24}/>): (<FaCheck/>)} CREAR CONTRASEÑA</button>
                        ) : (
                            <button className="text-white-50 rounded-md bg-gray-300 p-1.5 px-3  flex flex-row items-center gap-x-1 font-bold" disabled><FaCheck/> CREAR CONTRASEÑA</button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}


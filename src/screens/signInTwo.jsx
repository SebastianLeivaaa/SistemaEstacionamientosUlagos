import {useState} from "react";
import { useNavigate } from 'react-router-dom';
import Ulogo from "../assets/img/logoParkingUlagos.png";
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

            const response = await fetch('http://localhost:3090/api/send-email', {
                
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
        <div className="h-screen w-screen flex grid-cols-2 items-center justify-center md:px-4 bg-midnight-950">
            <div className="scrollbar-hide bg-midnight-950 flex flex-col items-center p-10 gap-y-8 rounded-md max-md:w-[75%] max-md:h-[100%] max-xs:w-[85%] max-md:px-4 max-md:py-8 max-h-[100%] overflow-y-scroll shadow-black-900 shadow-3xl">
                <img src={Ulogo} className="w-1/4" alt="Logo Ulagos"/>
                <h1 className="text-2xl font-bold text-center text-white-50 max-md:text-base">ESTACIONAMIENTOS ULAGOS</h1>
                <div className="flex flex-row justify-around w-full">
                    <button onClick={() => {navigate('/')}} className="bg-white-50  text-black font-semibold  px-4 py-2 rounded-md text-lg hover:bg-blue-ribbon-600 hover:text-white-50 max-md:text-base max-md:px-2" >Iniciar Sesión</button>
                    <button className="bg-midnight-600  text-black font-semibold  px-4 py-2 rounded-md text-lg  max-md:text-base max-md:px-2" disabled>Registrarse</button>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col p-4 gap-x-6 gap-y-8 bg-midnight-950 w-[100%] rounded-2xl max-xs:p-0">
                    <div className="w-full col-span-2">
                        <Indice
                            fase="2"
                        />
                    </div>
                    <h1 className="font-bold text-white-50 flex justify-start px-2 flex-col w-full col-span-2">CREE SU CONTRASEÑA</h1>
                    <div className="gap-y-1 text-white-50 flex flex-col px-2 max-xs:px-0">
                        <label htmlFor="password">Contraseña</label>
                        <PasswordInput id='password' name='password' onChange={handleChange}/>
                    </div>
                    <div className="gap-y-1 text-white-50 flex flex-col px-2 max-xs:px-0">
                        <label htmlFor="confirmPassword">Confirme contraseña</label>
                        <PasswordInput id='confirmPassword' name='confirmPassword' onChange={handleChange}/>
                    </div>
                    <div className="col-span-2 w-[100%] flex flex-col px-2 max-xs:px-0">
                        <ul className="flex text-white-50 font-semibold flex-col gap-y-2">
                            <li className="flex flex-row gap-x-2 items-end text-xl max-xs:text-lg w-full max-xs:items-center"><FaCheckCircle className={` ${validationPasswordOne.test(passwordData.password) ? 'text-green-500' : 'text-gray-600'}`}/> <p className="text-base max-xs:text-xs">Debe tener al menos 8 caracteres.</p></li>
                            <li className="flex flex-row gap-x-2 items-end text-xl max-xs:text-lg w-full max-xs:items-center"><FaCheckCircle className={` ${validationPasswordTwo.test(passwordData.password) ? 'text-green-500' : 'text-gray-600'}`}/> <p className="text-base max-xs:text-xs">Debe contener al menos una letra mayúscula.</p></li>
                            <li className="flex flex-row gap-x-2 items-end text-xl max-xs:text-lg w-full max-xs:items-center"><FaCheckCircle className={` ${validationPasswordThree.test(passwordData.password) ? 'text-green-500' : 'text-gray-600'}`}/> <p className="text-base max-xs:text-xs">Debe contener al menos una letra minúscula.</p></li>
                            <li className="flex flex-row gap-x-2 items-end text-xl max-xs:text-lg w-full max-xs:items-center"><FaCheckCircle className={` ${validationPasswordFour.test(passwordData.password) ? 'text-green-500' : 'text-gray-600'}`}/> <p className="text-base max-xs:text-xs">Debe contener al menos un número.</p></li>
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


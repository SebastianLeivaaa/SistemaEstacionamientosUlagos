import {useState, useEffect, useRef} from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { Indice } from "../components/indice";
import Ulogo from "../assets/img/Ulogo.png";
import { HiOutlineMailOpen } from "react-icons/hi";
import { FaCheck } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { ClipLoader } from 'react-spinners';
import { IoIosMail } from "react-icons/io";
import { formatTime } from "../utils/formatTime";


export const SignInThree = () => {
    const location = useLocation();
    const formData = location.state.formData;
    const passwordData = location.state.passwordData;
    const [counter, setCounter] = useState(300); 
    const [inputValues, setInputValues] = useState(Array(6).fill(""));
    const [code, setCode] = useState(location.state.code);
    const [isMessageError, setIsMessageError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    
    useEffect(() => {
        const timer =
            counter > 0 && setInterval(() => setCounter(counter - 1), 1000);

        return () => clearInterval(timer);
    }, [counter]);


    const inputsRef = useRef([]);

    const handleChange = (index, event) => {
        const { value } = event.target;
        const newInputValues = [...inputValues];
        newInputValues[index] = value.toUpperCase();
        setInputValues(newInputValues);
    
        if (value === "") {
            const prevIndex = index - 1;
            if (prevIndex >= 0) {
                inputsRef.current[prevIndex].focus();
            }
        } else {
            const nextIndex = index + 1;
            if (nextIndex < inputsRef.current.length) {
                inputsRef.current[nextIndex].focus();
            }
        }
    };

    const handleSubmit = async (e) => {
        setIsLoading(true);
        let concatenatedCode = inputValues.join("");
        const combinedData = { ...formData, ...passwordData };
        e.preventDefault();
        if(concatenatedCode === code && counter > 0){
            setIsMessageError(false);
            try {
                //console.log('estoy aca')
                const response = await fetch('/api/register-user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(combinedData),
                });
                if (response.ok) {
                    navigate('/sign-in-final');
                } else {
                    console.log('Error al registrar el usuario', response);
                }
            } catch (error) {
                console.log('Error en la solicitud:', error);
            }
        } else{
            setIsMessageError(true);
        }
        setIsLoading(false);
    }
    
    const handleSubmitEmail = async (e) => {
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
                setCode(responseData.code)
                setCounter(300);
            } else {
                console.error('Error al enviar el correo electrónico', response);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
        setIsLoading(false);
    };

    return(
        <div className="h-screen w-screen flex items-center justify-center">
            <div className="bg-white-50 flex flex-col items-center p-12 gap-y-8 rounded-md max-md:w-[75%] max-md:px-4 max-md:py-8 h-[90%] max-h-[90%] overflow-y-scroll shadow-white-900 shadow-3xl">
                <img src={Ulogo} alt="Logo Ulagos"/>
                <h1 className="text-2xl font-bold text-center max-md:text-base">ESTACIONAMIENTOS ULAGOS</h1>
                <div className="flex flex-row justify-around w-full">
                    <button onClick={() => {navigate('/')}} className="bg-white-50 text-black px-4 py-2 rounded-md text-lg hover:bg-blue-ribbon-600 hover:text-white-50 max-md:text-base max-md:px-2">Iniciar Sesión</button>
                    <button className="bg-blue-ribbon-600 text-white-50 px-4 py-2 rounded-md text-lg hover:bg-blue-ribbon-600 hover:text-white-50 max-md:text-base" disabled>Registrarse</button>
                </div>
                <div className="w-full col-span-2">
                    <Indice
                        fase="3"
                    />
                </div>
                <div className="flex flex-col p-4 p gap-x-6 gap-y-4 bg-white-50 w-[100%] rounded-2xl">
                    <div className="flex flex-col w-full">
                        <h1 className="text-center text-xl font-bold max-xs:text-lg">Enviamos un mail de confirmación a </h1>
                        <h1 className="text-center text-xl font-bold max-xs:text-lg break-words whitespace-normal">{formData.userEmail}{formData.userDomain}</h1>
                    </div>
                    <div className="flex flex-col text-gray-950">
                        <p className="text-center text-xl font-semibold">Tiempo restante</p>
                        <p className="text-center text-lg font-semibold">{formatTime(counter)}</p>
                    </div>
                    <div className="text-7xl justify-center flex text-blue-500">
                        <HiOutlineMailOpen/>
                    </div>
                    {counter === 0 ? (
                        <h3 className="text-center text-red-700 flex flex-row gap-x-2 items-center justify-center text-base max-xs:flex-col"><IoIosWarning className="text-2xl max-xs:text-3xl"/> El código de confirmación ha expirado</h3>
                    ) : (
                        <h3 className="text-center">Código de confirmación</h3>
                    )}
                    <div className="flex flex-row gap-x-2 justify-center w-full max-xs:px-12 max-xs:gap-x-[4px]">
                        {[...Array(6)].map((_, index) => (
                            <input
                                ref={(el) => (inputsRef.current[index] = el)}
                                type="text"
                                key={index}
                                maxLength="1"
                                className="w-11 h-11 border-[1px] border-gray-400 text-center text-xl bg-gray-50"
                                onChange={(e) => handleChange(index, e)}
                                onInput={(e) => {
                                    e.target.value = e.target.value.toUpperCase();
                                }}
                                disabled={counter === 0}
                            />
                        ))}
                    </div>
                    {isMessageError && (
                        <h3 className="text-center text-red-700 flex flex-row gap-x-1 items-center justify-center max-xs:flex-col"><RxCross2 className="text-2xl max-xs:text-3xl"/> El código de verificación no es válido</h3>
                    )}
                    <div className="flex w-[100%] items-center mt-2 justify-center">
                        {counter > 0 ? (
                            <button onClick={handleSubmit} className="text-white-50 rounded-md bg-blue-600 hover:bg-blue-700 p-1.5 px-4 flex flex-row items-center gap-x-1 w-auto font-bold">{isLoading ? (<ClipLoader color="#FFFFFF" size={24}/>): (<FaCheck/>)} CONFIRMAR REGISTRO</button>
                        ) : (
                            <button onClick={handleSubmitEmail} className="text-white-50 rounded-md bg-blue-600 hover:bg-blue-700 p-1.5 px-4 flex flex-row items-center gap-x-1 w-auto font-bold">{isLoading ? (<ClipLoader color="#FFFFFF" size={24}/>): (<IoIosMail className="text-2xl"/>)} REENVIAR CODIGO</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
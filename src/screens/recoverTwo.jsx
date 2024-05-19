import React, {useState, useEffect, useRef} from "react";
import Ulogo from "../assets/img/Ulogo.png";
import { useNavigate, useLocation } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { HiOutlineMailOpen } from "react-icons/hi";
import { FaCheck } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { IoIosMail } from "react-icons/io";
import { formatTime } from "../utils/formatTime";





export const RecoverTwo = () =>{
    const navigate = useNavigate();
    const location = useLocation();
    const emailData = location.state.emailData;
    const [counter, setCounter] = useState(300); 
    const [inputValues, setInputValues] = useState(Array(6).fill(""));
    const [code, setCode] = useState(location.state.code);
    const [isMessageError, setIsMessageError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const handleBack = () => {
        navigate('/');
        };

    useEffect(() => {
        const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
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
        e.preventDefault();
        if(concatenatedCode === code && counter > 0){
            setIsMessageError(false);
            navigate('/recover-three', {state: {emailData: emailData}});
        } else{
            setIsMessageError(true);
        }
        setIsLoading(false);
      }

    const handleSubmitEmail = async (e) => {
        e.preventDefault();
        setIsMessageError(false);
        setIsLoading(true);

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailData),
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
      <div className="bg-white-50 flex flex-col items-center p-12 gap-y-8 rounded-md max-md:w-[75%] max-md:px-4 max-md:py-8 max-h-[90%] overflow-y-scroll shadow-white-900 shadow-3xl">
        <img src={Ulogo} alt="Logo Ulagos"/>
        <h1 className="text-2xl font-bold text-center max-md:text-base">RECUPERAR CONTRASEÑA</h1>
        <div className="flex flex-col p-4 p gap-x-6 gap-y-4 bg-white-50 w-[100%] rounded-2xl md:p-0 text-sm">
            <h1 className="text-center text-xl font-bold ">Enviamos un mail de verificación a {emailData.userEmail}{emailData.userDomain}</h1>
            <div className="flex flex-col text-gray-950">
                <p className="text-center text-xl font-semibold">Tiempo restante</p>
                <p className="text-center text-lg font-semibold">{formatTime(counter)}</p>
            </div>
            <div className="text-7xl justify-center flex text-blue-500">
                <HiOutlineMailOpen/>
            </div>
            {counter === 0 ? (
                <h3 className="text-center text-red-700 flex flex-row gap-x-2 items-center justify-center text-base"><IoIosWarning className="text-2xl"/> El código de confirmación ha expirado</h3>
            ) : (
                <h3 className="text-center">Código de verificación</h3>
            )}
            <div className="flex flex-row gap-x-2 justify-center">
                {[...Array(6)].map((_, index) => (
                    <input
                        ref={(el) => (inputsRef.current[index] = el)}
                        type="text"
                        key={index}
                        maxLength="1"
                        className="w-12 h-12 border-[1px] border-gray-400 text-center text-xl bg-gray-50"
                        onChange={(e) => handleChange(index, e)}
                        onInput={(e) => {
                            e.target.value = e.target.value.toUpperCase();
                        }}
                        disabled={counter === 0}
                    />
                ))}
            </div>
            {isMessageError && (
                <h3 className="text-center text-red-700 flex flex-row gap-x-1 items-center justify-center"><RxCross2 className="text-2xl"/> El código de verificación no es válido</h3>
            )}
            <div className="flex w-[100%] items-center mt-2 justify-center">
                {counter > 0 ? (
                    <button onClick={handleSubmit} className="text-white-50 rounded-md bg-blue-600 hover:bg-blue-700 p-1.5 px-4 flex flex-row items-center gap-x-1 w-auto font-bold">{isLoading ? (<ClipLoader color="#FFFFFF" size={24}/>): (<FaCheck/>)} CONFIRMAR REGISTRO</button>
                ) : (
                    <button onClick={handleSubmitEmail} className="text-white-50 rounded-md bg-blue-600 hover:bg-blue-700 p-1.5 px-4 flex flex-row items-center gap-x-1 w-auto font-bold">{isLoading ? (<ClipLoader color="#FFFFFF" size={24}/>): (<IoIosMail className="text-2xl"/>)} REENVIAR CODIGO</button>
                )}
            </div>
        </div>
        <button onClick={handleBack} className="font-bold text-blue-ribbon-600 underline">Volver al login</button>
      </div>
    </div>
  );
}
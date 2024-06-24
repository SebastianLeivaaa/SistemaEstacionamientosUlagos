import React, {useState} from 'react';
import { FaCheckCircle, FaCheck } from "react-icons/fa";
import { ClipLoader } from 'react-spinners';
import { PasswordInput } from "../components/passwordInput";
import { RecoverFinal } from './recoverFinal';

export const RecoverThree = ({emailData, handleRecover}) => {
    const validationPasswordOne = /^.{8,}$/;
    const validationPasswordTwo = /[A-Z]/;
    const validationPasswordThree = /[a-z]/;
    const validationPasswordFour = /[0-9]/;
    const validationPasswordGeneral = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$/;
    const [finalStepRecover, setFinalStepRecover] = useState(false);

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
        const combinedData = { ...emailData, ...passwordData };
        try {

            const response = await fetch('/api/update-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(combinedData),
            });
            if (response.ok) {
                setFinalStepRecover(true);
            } else {
                console.error('Error al enviar el correo electrónico', response);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
        setIsLoading(false);
    };
    
    return(
        <>
            {finalStepRecover ? (
                <RecoverFinal handleRecover={handleRecover}/>
            ) : (
                <div className="flex flex-col px-4 gap-x-6 gap-y-8 max-xs:p-2">
                    <h1 className="text-2xl font-bold text-center max-md:text-base text-black dark:text-white-50">RECUPERAR CONTRASEÑA</h1>
                    <form onSubmit={handleSubmit} className="flex flex-col px-4 overflow-y-auto gap-x-6 gap-y-8 max-xs:p-2 ">
                        <h1 className="font-bold flex justify-start flex-col w-full col-span-2 text-black dark:text-white-50">CREE SU NUEVA CONTRASEÑA</h1>
                        <div className="gap-y-1 flex flex-col w-[100%] max-xs:px-0 text-black dark:text-white-50">
                            <label htmlFor="password">Contraseña</label>
                            <PasswordInput id='password' name='password' onChange={handleChange}/>
                        </div>
                        <div className="gap-y-1 flex flex-col w-[100%] max-xs:px-0 text-black dark:text-white-50">
                            <label htmlFor="confirmPassword">Confirme contraseña</label>
                            <PasswordInput id='confirmPassword' name='confirmPassword' onChange={handleChange}/>
                        </div>
                        <div className="col-span-2 w-[100%] flex flex-col px-2 max-xs:px-0">
                            <ul className="flex flex-col gap-y-2 text-black dark:text-white-50">
                                <li className="flex flex-row gap-x-2 items-end text-xl max-xs:text-lg w-full max-xs:items-center"><FaCheckCircle className={`h-full ${validationPasswordOne.test(passwordData.password) ? 'text-green-600' : 'text-gray-800'}`}/> <p className="text-base max-xs:text-xs">Debe tener al menos 8 caracteres.</p></li>
                                <li className="flex flex-row gap-x-2 items-end text-xl max-xs:text-lg w-full max-xs:items-center"><FaCheckCircle className={`h-full ${validationPasswordTwo.test(passwordData.password) ? 'text-green-600' : 'text-gray-800'}`}/> <p className="text-base max-xs:text-xs">Debe contener al menos una letra mayúscula.</p></li>
                                <li className="flex flex-row gap-x-2 items-end text-xl max-xs:text-lg w-full max-xs:items-center"><FaCheckCircle className={`h-full ${validationPasswordThree.test(passwordData.password) ? 'text-green-600' : 'text-gray-800'}`}/> <p className="text-base max-xs:text-xs">Debe contener al menos una letra minúscula.</p></li>
                                <li className="flex flex-row gap-x-2 items-end text-xl max-xs:text-lg w-full max-xs:items-center"><FaCheckCircle className={`h-full ${validationPasswordFour.test(passwordData.password) ? 'text-green-600' : 'text-gray-800'}`}/> <p className="text-base max-xs:text-xs">Debe contener al menos un número.</p></li>
                            </ul>
                        </div>
                        <div className="text-end flex w-[100%] col-span-2 items-end justify-end">
                            {validationPasswordGeneral.test(passwordData.password) && passwordData.password === passwordData.confirmPassword ? (
                                <button  onClick={handleSubmit} className="text-white-50 rounded-md bg-blue-600 hover:bg-blue-700 p-1.5 px-3 flex flex-row items-center gap-x-1 font-bold text-sm sm:text-base">{isLoading ? (<ClipLoader color="#FFFFFF" size={24}/>): (<FaCheck/>)} CREAR CONTRASEÑA</button>
                            ) : (
                                <button className="text-white-50 rounded-md bg-gray-300 p-1.5 px-3  flex flex-row items-center gap-x-1 font-bold text-sm sm:text-base" disabled><FaCheck/> CREAR CONTRASEÑA</button>
                            )}
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
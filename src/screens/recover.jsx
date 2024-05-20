import React, {useState} from "react";
import Ulogo from "../assets/img/Ulogo.png";
import { useNavigate } from 'react-router-dom';
import { MdEmail } from "react-icons/md";
import { ClipLoader } from 'react-spinners';
import { BsSendFill } from "react-icons/bs";

export const Recover = () =>{
  const navigate = useNavigate();
  const [emailData, setEmailData] = useState({
    userEmail: '',
    userDomain: '@alumnos.ulagos.cl'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleBack = () => {
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmailData({
        ...emailData,
        [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/send-email-recover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      const responseData = await response.json();
    
      if (response.ok) {
        const { code, info } = responseData;
        if (info.accepted.length > 0) {
          navigate('/recover-two', { state: { emailData: emailData, code: code } });
        }
      } else {
        setError(responseData.message);
        console.error('Error al enviar el correo electrónico', responseData);
      }
    } catch (error) {
      setError('Error en la solicitud: ' + error.message);
      console.error('Error en la solicitud:', error);
    }
    setIsLoading(false);
  };
  return(
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="bg-white-50 flex flex-col items-center p-12 gap-y-8 rounded-md max-md:w-[75%] max-md:px-4 max-md:py-8 max-h-[90%] overflow-y-scroll shadow-white-900 shadow-3xl">
        <img src={Ulogo} alt="Logo Ulagos"/>
        <h1 className="text-2xl font-bold text-center max-md:text-base">RECUPERAR CONTRASEÑA</h1>
        <h1 className="text-2xl font-semibold text-center max-md:text-base">Ingrese su correo electrónico</h1>
        <div className="w-full flex flex-row">
        <div className="w-[90%] flex flex-row">
          <input id="userEmail" name="userEmail" maxLength="50" onChange={handleChange} value={emailData.userEmail} type="text" className="w-[50%] p-2 border-[0.5px] border-blue-ribbon-600 max-md:w-[85%] focus:outline-none " placeholder="Usuario"/>
          <select id="userDomain" name="userDomain" className="border-[0.5px] border-l-[0px] border-blue-ribbon-600 bg-white-50 w-[50%]" onChange={handleChange}>
            <option>@alumnos.ulagos.cl</option>
            <option>@ulagos.cl</option>
          </select>
        </div>
        <div className="w-[10%] border-[0.5px] border-l-[0px] border-blue-ribbon-600 flex items-center justify-center max-md:w-[15%]">
          <MdEmail className="text-blue-ribbon-600 text-2xl"/>
        </div>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button onClick={handleSubmit} className="mt-2 w-full bg-blue-ribbon-600 font-bold text-white-50 px-2 py-2 rounded-md text-lg hover:bg-blue-ribbon-700 flex flex-row items-center justify-center gap-x-2 max-md:text-base">{isLoading ? (<ClipLoader color="#FFFFFF" size={24}/>): (<BsSendFill/>)} Enviar código</button>
        <button onClick={handleBack} className="font-bold text-blue-ribbon-600 underline">Volver al login</button>
      </div>
    </div>
  );
}
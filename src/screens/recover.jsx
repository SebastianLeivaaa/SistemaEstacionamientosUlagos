import React, { useState } from "react";
import { MdEmail } from "react-icons/md";
import { ClipLoader } from 'react-spinners';
import { BsSendFill } from "react-icons/bs";
import { RecoverTwo } from "./recoverTwo";
import { MdOutlineRestartAlt } from "react-icons/md";


export const Recover = ({ handleRecover }) => {

  const [emailData, setEmailData] = useState({
    userEmail: '',
    userDomain: '@alumnos.ulagos.cl'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customDomain, setCustomDomain] = useState(false);
  const [secondStepRecover, setSecondStepRecover] = useState(false);
  const [code, setCode] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmailData({
      ...emailData,
      [name]: value
    });
    if (name === 'userDomain') {
      const newValue = value.startsWith('@') ? value : `@${value}`;
      setEmailData({
        ...emailData,
        userDomain: newValue
      });
      setCustomDomain(true);
    }
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
          setCode(code);
          setSecondStepRecover(true);
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

  const handleDomainChange = (e) => {
    const selectedDomain = e.target.value;
    setEmailData({
      ...emailData,
      userDomain: selectedDomain
    });


    if (selectedDomain === '@') {
      emailData.userDomain = '@';
      setCustomDomain(true);
    } else {
      setCustomDomain(false);
    }
  };

  const restoreDefaults = () => {
    setEmailData({
      userEmail: '',
      userDomain: '@alumnos.ulagos.cl'
    });
    setCustomDomain(false); 
  };

  return (
    <>
      {secondStepRecover ? (
        <RecoverTwo emailData={emailData} code={code} handleRecover={handleRecover} />
      ) : (
        <div className="flex flex-col px-4 gap-x-6 gap-y-8 max-xs:p-2">
          <h1 className="text-2xl font-bold text-center text-black dark:text-white-50 max-md:text-base">RECUPERAR CONTRASEÑA</h1>
          <h1 className="text-2xl font-bold text-center text-black dark:text-white-50 max-md:text-base">Ingrese su correo electrónico</h1>
          <div className="w-full flex flex-row">
            <div className="w-[90%] flex flex-row">
              <input
                id="userEmail"
                name="userEmail"
                maxLength="50"
                onChange={handleChange}
                value={emailData.userEmail}
                type="text"
                className="w-[50%] p-1 bg-gray-100 dark:bg-gray-700 text-black dark:text-white-50 border-[0.5px] border-midnight-700 focus:outline-none"
                placeholder="Usuario"
              />
              {customDomain ? (
                <input
                  id="customDomain"
                  name="userDomain"
                  maxLength="50"
                  onChange={handleChange}
                  value={emailData.userDomain}
                  type="text"
                  className="w-[50%] p-1 bg-gray-100 dark:bg-gray-700 text-black dark:text-white-50 border-[0.5px] border-midnight-700 focus:outline-none"
                  placeholder="Dominio personalizado"
                />
              ) : (
                <select
                  id="userDomain"
                  name="userDomain"
                  className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white-50 border-[0.5px] border-midnight-700 w-[50%]"
                  onChange={handleDomainChange}
                >
                  <option>@alumnos.ulagos.cl</option>
                  <option>@ulagos.cl</option>
                  <option>@</option>
                </select>
              )}
            </div>
            <div className="w-[10%] border-[0.5px] border-l-[0px] border-blue-ribbon-600 flex items-center justify-center max-md:w-[15%]">
              <MdEmail className="text-blue-ribbon-600 text-2xl" />
            </div>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex flex-col gap-y-4">
            <button
              onClick={handleSubmit}
              className="mt-2 w-full bg-blue-ribbon-600 font-bold text-white-50 px-2 py-2 rounded-md text-lg hover:bg-blue-ribbon-700 flex flex-row items-center justify-center gap-x-2 max-md:text-base"
            >
              {isLoading ? <ClipLoader color="#FFFFFF" size={24} /> : <BsSendFill />} Enviar código
            </button>
            {customDomain && (
              <button onClick={restoreDefaults} className="mt-2 w-full bg-gray-800 dark:bg-gray-800 text-white-50 dark:text-white-50 font-bold px-2 py-2 rounded-md text-lg hover:bg-gray-900 dark:hover:bg-gray-900 flex flex-row items-center justify-center gap-x-2 max-md:text-base">
                <MdOutlineRestartAlt className="text-3xl max-md:text-2xl"/>
                Restaurar predeterminados
              </button>
            )}
          </div>
          <button onClick={handleRecover} className="font-bold text-blue-ribbon-600 hover:text-blue-ribbon-700 underline mt-8">Volver al login</button>
        </div>
      )}
    </>
  );
};

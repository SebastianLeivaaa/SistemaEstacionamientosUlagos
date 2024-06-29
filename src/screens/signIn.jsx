import React, { useState, useRef, useEffect } from "react";
import Datos from "../components/datos";
import Indice from "../components/indice";
import SelectUser from "../components/selectUser";
import SelectDomain from "../components/selectDomain";
import Rut from "../components/rut";
import Phone from "../components/phone";
import { ClipLoader } from 'react-spinners';
import { MdKeyboardArrowRight } from "react-icons/md";
import { validateFormatPhone } from "../utils/validateFormatPhone";
import { validateRut } from "../utils/validateRut";
import { validateEmailFormat } from "../utils/validateEmailFormat";
import { useNavigate } from 'react-router-dom';
import { SignInTwo } from "./signInTwo";

export const SignIn = ({ handleLoginClick }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [secondStepSignIn, setSecondStepSignIn] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        userName: '',
        userLastNamePat: '',
        userLastNameMat: '',
        userRut: '',
        userEmail: '',
        userDomain: '@alumnos.ulagos.cl',
        userPhone: '',
        userType: 'Estudiante',
        vehiclePatente: '',
        vehicleMarca: null,
        vehicleModelo: null,
        vehicleYear: null,
        vehicleType: null,
        vehicleColor: null
    });

    // Refs for inputs
    const userNameRef = useRef(null);
    const userLastNamePatRef = useRef(null);
    const userLastNameMatRef = useRef(null);
    const userRutRef = useRef(null);
    const userEmailRef = useRef(null);
    const userPhoneRef = useRef(null);
    const vehiclePatenteRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "userType") {
            const newDomain = value === 'Estudiante' ? '@alumnos.ulagos.cl' : value === 'Profesor' ? '@ulagos.cl' : '';
            setFormData({
                ...formData,
                [name]: value,
                userDomain: newDomain,
                userEmail: '', // Reset email when changing user type
            });
        } else if (name === "userDomain") {
            // Check if the current value already starts with '@'
            const newValue = value.startsWith('@') ? value : `@${value}`;
            setFormData({
                ...formData,
                [name]: newValue,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const newErrors = {};
        if (formData.userName.trim() === '') {
            newErrors.userName = 'Por favor ingrese su nombre.';
        }
        if (formData.userLastNamePat.trim() === '') {
            newErrors.userLastNamePat = 'Por favor ingrese su apellido paterno.';
        }
        if (formData.userLastNameMat.trim() === '') {
            newErrors.userLastNameMat = 'Por favor ingrese su apellido materno.';
        }
        if (!validateRut(formData.userRut)) {
            newErrors.userRut = 'Ingrese un rut válido';
        }
        if (!validateFormatPhone(formData.userPhone)) {
            newErrors.userPhone = 'Ingrese un formato de telefono válido';
        }
        if (!validateEmailFormat(`${formData.userEmail}${formData.userDomain}`)) {
            newErrors.userEmail = "Ingrese un correo electrónico válido";
        }
        if (formData.vehiclePatente.trim() === '') {
            newErrors.vehiclePatente = 'Por favor ingrese la patente de su vehículo.';
        }

        if (Object.keys(newErrors).length === 0) {
            try {
                const response = await fetch('/api/query-user-exists', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    const responseData = await response.json();

                    if (responseData.infoRut.length > 0) {
                        newErrors.userRut = 'Este rut ya existe en nuestro sistema';
                    }

                    if (responseData.infoEmail.length > 0) {
                        newErrors.userEmail = 'Este correo electrónico ya esta vinculado a una cuenta';
                    }

                    if (responseData.infoPhone.length > 0) {
                        newErrors.userPhone = 'Este número telefónico ya esta vinculado a una cuenta';
                    }

                    setErrors(newErrors);

                    if (Object.keys(newErrors).length === 0) {
                        setSecondStepSignIn(true);
                    }
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        }

        setErrors(newErrors);
        setIsLoading(false);
    };

    // Scroll to first input with error on error change
    useEffect(() => {
        const scrollToError = () => {
            if (Object.keys(errors).length > 0) {
                if (errors.userName) userNameRef.current.scrollIntoView({ behavior: "smooth" });
                else if (errors.userLastNamePat) userLastNamePatRef.current.scrollIntoView({ behavior: "smooth" });
                else if (errors.userLastNameMat) userLastNameMatRef.current.scrollIntoView({ behavior: "smooth" });
                else if (errors.userRut) userRutRef.current.scrollIntoView({ behavior: "smooth" });
                else if (errors.userEmail) userEmailRef.current.scrollIntoView({ behavior: "smooth" });
                else if (errors.userPhone) userPhoneRef.current.scrollIntoView({ behavior: "smooth" });
                else if (errors.vehiclePatente) vehiclePatenteRef.current.scrollIntoView({ behavior: "smooth" });
            }
        };

        scrollToError();
    }, [errors]);

    return (
        <>
            {secondStepSignIn ? (
                <SignInTwo formData={formData} handleLoginClick={handleLoginClick} />
            ) : (
                <form className="w-full flex flex-col overflow-y-auto px-4" onSubmit={handleSubmit}>
                    <Indice fase="1" />
                    <h1 className="text-black dark:text-white-50 font-bold p-4 max-xs:px-0 w-[100%]">DATOS PERSONALES</h1>
                    <div className="text-black dark:text-white-50 font-semibold w-[100%] grid grid-cols-1 md:grid-cols-2 p-1 max-xs:px-0">
                        <div className=" w-full flex flex-col p-4 max-xs:px-0" ref={userNameRef}>
                            <h1 className="pb-3">Nombre(s)</h1>
                            <Datos
                                holder="Ingrese su nombre"
                                tipo="text"
                                id="userName"
                                name="userName"
                                maxLength="30"
                                onChange={handleChange}
                                value={formData.userName}
                            />
                            {errors.userName && (
                                <p className="text-red-500 text-sm">{errors.userName}</p>
                            )}
                        </div>
                        <div className="w-full flex flex-col p-4 max-xs:px-0" ref={userLastNamePatRef}>
                            <h1 className="pb-3">Apellido Paterno</h1>
                            <Datos
                                holder="Ingresa tu apellido paterno"
                                tipo="text"
                                id="userLastNamePat"
                                name="userLastNamePat"
                                maxLength="30"
                                onChange={handleChange}
                                value={formData.userLastNamePat}
                            />
                            {errors.userLastNamePat && (
                                <p className="text-red-500 text-sm">{errors.userLastNamePat}</p>
                            )}
                        </div>
                    </div>
                    <div className="text-black dark:text-white-50 font-semibold w-[100%] grid grid-cols-1 md:grid-cols-2 p-1 max-xs:px-0">
                        <div className="w-full flex flex-col p-4 max-xs:px-0" ref={userLastNameMatRef}>
                            <h1 className="pb-3">Apellido Materno</h1>
                            <Datos
                                holder="Ingresa tu apellido materno"
                                tipo="text"
                                id="userLastNameMat"
                                name="userLastNameMat"
                                maxLength="30"
                                onChange={handleChange}
                                value={formData.userLastNameMat}
                            />
                            {errors.userLastNameMat && (
                                <p className="text-red-500 text-sm">{errors.userLastNameMat}</p>
                            )}
                        </div>
                        <div className="w-full flex flex-col p-4 max-xs:px-0" ref={userRutRef}>
                            <h1 className="pb-3">RUT</h1>
                            <Rut
                                holder="Ej:20545267-1"
                                tipo="text"
                                id="userRut"
                                name="userRut"
                                maxLength="10"
                                onChange={handleChange}
                                value={formData.userRut}
                            />
                            {errors.userRut && (
                                <p className="text-red-500 text-sm">{errors.userRut}</p>
                            )}
                        </div>
                    </div>
                    <div className="text-black dark:text-white-50 font-semibold w-[100%] grid grid-cols-1 md:grid-cols-2 p-1 max-xs:px-0">
                        <div className="w-full flex flex-col p-4 max-xs:px-0">
                            <h1 className="pb-3">Tipo Usuario</h1>
                            <SelectUser
                                holder="Estudiante"
                                id="userType"
                                name="userType"
                                onChange={handleChange}
                                value={formData.userType}
                            />
                        </div>
                        <div className="w-full flex flex-col p-4 max-xs:px-0">
                            <h1 className="pb-3">Correo electrónico</h1>
                            <div className="flex flex-row w-[100%] max-md:w-[100%] gap-x-1" ref={userEmailRef}>
                                <Datos
                                    holder="Usuario"
                                    tipo="text"
                                    id="userEmail"
                                    name="userEmail"
                                    maxLength="50"
                                    onChange={handleChange}
                                    value={formData.userEmail}
                                    ref={userEmailRef}
                                />
                                {formData.userType === 'Externo' ? (
                                    <Datos
                                        holder="@dominio.com"
                                        tipo="text"
                                        id="userDomain"
                                        name="userDomain"
                                        maxLength="50"
                                        onChange={handleChange}
                                        value={formData.userDomain}
                                    />
                                ) : (
                                    <SelectDomain userType={formData.userType} onChange={handleChange} value={formData.userDomain} />
                                )}
                            </div>
                            {errors.userEmail && (
                                <p className="text-red-500 text-sm">{errors.userEmail}</p>
                            )}
                        </div>
                    </div>
                    <div className="text-black dark:text-white-50 font-semibold w-[100%] grid grid-cols-1 md:grid-cols-2 p-1 max-xs:px-0">
                        <div className="w-full flex flex-col p-4 max-xs:px-0" ref={userPhoneRef}>
                            <h1 className="pb-3">Télefono</h1>
                            <Phone
                                holder="Ej:958472045"
                                tipo="number"
                                id="userPhone"
                                name="userPhone"
                                maxLength="9"
                                onChange={handleChange}
                                value={formData.userPhone}
                            />
                            {errors.userPhone && (
                                <p className="text-red-500 text-sm">{errors.userPhone}</p>
                            )}
                        </div>
                    </div>
                    <h1 className="text-black dark:text-white-50 font-bold p-4 max-xs:px-0">DATOS VEHÍCULO</h1>
                    <div className="text-black dark:text-white-50 font-semibold w-[100%] grid grid-cols-1 md:grid-cols-2 p-1 max-xs:px-0">
                        <div className="w-full flex flex-col p-4 max-xs:px-0" ref={vehiclePatenteRef}>
                            <h1 className="pb-3">Patente</h1>
                            <Datos
                                holder="Ej:GGXX20"
                                tipo="text"
                                id="vehiclePatente"
                                name="vehiclePatente"
                                maxLength="6"
                                onChange={handleChange}
                                value={formData.vehiclePatente}
                            />
                            {errors.vehiclePatente && (
                                <p className="text-red-500 text-sm">{errors.vehiclePatente}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex w-[100%] rounded-md mt-10 items-center justify-center xl:justify-end lg:justify-end md:justify-end p-2">
                        <button type="submit" className="text-white-50 rounded-md bg-blue-ribbon-600 hover:bg-blue-ribbon-700 p-1.5 px-3 flex flex-row items-center gap-x-1 font-bold mr-4">
                            {isLoading ? (<ClipLoader color="#FFFFFF" size={24} />) : (<MdKeyboardArrowRight className="text-2xl" />)} CREE SU CONTRASEÑA
                        </button>
                    </div>
                </form>
            )}
        </>
    );
};

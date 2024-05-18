import {useState} from "react"; 
import Datos from "../components/datos"
import { Indice } from "../components/indice";
import SelectUser from "../components/selectUser";
import SelectVehicle from "../components/selectVehicle";
import SelectDomain from "../components/selectDomain";
import Rut from "../components/rut";
import Phone from "../components/phone";
import { ClipLoader } from 'react-spinners';
import { MdKeyboardArrowRight } from "react-icons/md";
import { validateFormatPhone } from "../utils/validateFormatPhone";
import { validateRut } from "../utils/validateRut";
import { validateEmailFormat } from "../utils/validateEmailFormat";
import { useNavigate } from 'react-router-dom';
import { validateYear } from "../utils/validateYear";

export const SignIn = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        userName: '',
        userLastNamePat: '',
        userLastNameMat: '',
        userRut: '',
        userEmail: '',
        userPhone: '',
        userType: 'Estudiante',
        userDomain: '@alumnos.ulagos.cl',
        vehiclePatente: '',
        vehicleMarca: '',
        vehicleModelo: '',
        vehicleYear: '',
        vehicleType: 'Automovil',
        vehicleColor: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "userType") {
            const newDomain = value === 'Estudiante' ? '@alumnos.ulagos.cl' : '@ulagos.cl';
            setFormData({
                ...formData,
                [name]: value,
                userDomain: newDomain
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const newErrors = {};
        if(formData.userName.trim() === ''){
            newErrors.userName = 'Por favor ingrese su nombre.';
        }
        if(formData.userLastNamePat.trim() === ''){
            newErrors.userLastNamePat = 'Por favor ingrese su apellido paterno.';
        }
        if(formData.userLastNameMat.trim() === ''){
            newErrors.userLastNameMat = 'Por favor ingrese su apellido materno.';
        }
        if(!validateRut(formData.userRut)){
            newErrors.userRut = 'Ingrese un rut válido';
        }
        if(!validateFormatPhone(formData.userPhone)){
            newErrors.userPhone = 'Ingrese un formato de telefono válido';
        }
        if(!validateEmailFormat(`${formData.userEmail}${formData.userDomain}`)){
            newErrors.userEmail = "Ingrese un correo electrónico válido";
        }
        if(!validateYear(formData.vehicleYear)){
            newErrors.vehicleYear ="Ingrese un año superior a 1970 o inferior a 2024";
        }
        if(formData.vehiclePatente.trim() === ''){
            newErrors.vehiclePatente = 'Por favor ingrese la patente de su vehículo.';
        }
        if(formData.vehicleMarca.trim() === ''){
            newErrors.vehicleMarca = 'Por favor ingrese la marca de su vehículo.';
        }
        if(formData.vehicleModelo.trim() === ''){
            newErrors.vehicleModelo = 'Por favor ingrese el modelo de su vehículo.';
        }
        if(formData.vehicleYear.trim() === ''){
            newErrors.vehicleYear = 'Por favor ingrese el año de su vehículo.';
        }
        if(formData.vehicleColor.trim() === ''){
            newErrors.vehicleColor = 'Por favor ingrese el color de su vehículo.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            try{
                const response = await fetch('/api/query-user-exists', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData),
                });

                if(response.ok){
                    const responseData = await response.json();

                    if(responseData.infoRut.length > 0){
                        newErrors.userRut = 'Este rut ya existe en nuestro sistema';
                    }
                    
                    if(responseData.infoEmail.length > 0){
                        newErrors.userEmail = 'Este correo electrónico ya esta vinculado a una cuenta';
                    }

                    if(responseData.infoPhone.length > 0){
                        newErrors.userPhone = 'Este número telefónico ya esta vinculado a una cuenta';
                    }

                    if (Object.keys(newErrors).length > 0) {
                        setErrors(newErrors);
                    } else {
                        navigate('/sign-in-two', { state:{ formData: formData} });
                    }
                }
            } catch (error){
                console.error('Error en la solicitud:', error);
            }
        }
        setIsLoading(false);
    }

    return (
        <form className="w-full flex flex-col" onSubmit={handleSubmit}>
            <Indice
            fase="1"
            />
            <h1 className="font-bold p-4">DATOS PERSONALES</h1>
            <div className="w-[100%] grid grid-cols-1 md:grid-cols-2 p-2">
                <div className="w-full flex flex-col ml-4">
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
                <div className="w-full flex flex-col ml-4">
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
            <div className="w-[100%] grid grid-cols-1 md:grid-cols-2 p-2">
                <div className="w-full flex flex-col ml-4">
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
                <div className="w-full flex flex-col ml-4">
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
            <div className="w-[100%] grid grid-cols-1 md:grid-cols-2 p-2">
                <div className="w-full flex flex-col ml-4">
                    <h1 className="pb-3">Tipo Usuario</h1>
                    <SelectUser
                        holder="Estudiante"
                        id="userType"
                        name="userType"
                        onChange={handleChange}
                        value={formData.userType}
                    />
                </div>
                <div className="w-full flex flex-col ml-4">
                    <h1 className="pb-3">Correo electronico</h1>
                    <div className="flex flex-row w-[90%] gap-x-1">
                        <Datos
                            holder="Usuario"
                            tipo="text"
                            id="userEñail"
                            name="userEmail"
                            maxLength="50"
                            onChange={handleChange}
                            value={formData.userEmail}
                        />
                        <SelectDomain userType={formData.userType} />
                    </div>
                    {errors.userEmail && (
                        <p className="text-red-500 text-sm">{errors.userEmail}</p>
                    )}
                </div>
            </div>
            <div className="w-[100%] grid grid-cols-1 md:grid-cols-2 p-2">
                <div className="w-full flex flex-col ml-4">
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
            <h1 className="font-bold p-4">DATOS VEHÍCULO</h1>
            <div className="w-[100%] grid grid-cols-1 md:grid-cols-2 p-2">
                <div className="w-full flex flex-col ml-4">
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
                <div className="w-full flex flex-col ml-4">
                    <h1 className="pb-3">Marca</h1>
                    <Datos
                        holder="Ej:Chevrolet"
                        tipo="text"
                        id="vehicleMarca"
                        name="vehicleMarca"
                        maxLength="30"
                        onChange={handleChange}
                        value={formData.vehicleMarca}
                    />
                    {errors.vehicleMarca && (
                        <p className="text-red-500 text-sm">{errors.vehicleMarca}</p>
                    )}
                </div>
            </div>
            <div className="w-[100%] grid grid-cols-1 md:grid-cols-2 p-2">
                <div className="w-full flex flex-col ml-4">
                    <h1 className="pb-3">Modelo</h1>
                    <Datos
                        holder="Ej:Sail"
                        tipo="text"
                        id="vehicleModelo"
                        name="vehicleModelo"
                        maxLength="30"
                        onChange={handleChange}
                        value={formData.vehicleModelo}
                    />
                    {errors.vehicleModelo && (
                            <p className="text-red-500 text-sm">{errors.vehicleModelo}</p>
                    )}
                </div>
                <div className="w-full flex flex-col ml-4">
                    <h1 className="pb-3">Año</h1>
                    <Datos
                        holder="Ej:2014"
                        tipo="number"
                        id="vehicleYear"
                        name="vehicleYear"
                        maxLength="4"
                        onChange={handleChange}
                        value={formData.vehicleYear}
                        
                    />
                    {errors.vehicleYear && (
                        <p className="text-red-500 text-sm">{errors.vehicleYear}</p>
                    )}
                </div>
            </div>
            <div className="w-[100%] grid grid-cols-1 md:grid-cols-2 p-2">
                <div className="w-full flex flex-col ml-4">
                    <h1 className="pb-3">Tipo vehículo</h1>
                    <SelectVehicle
                        holder="Automovil"
                        tipo="select"
                        id="vehicleType"
                        name="vehicleType"
                        onChange={handleChange}
                        value={formData.vehicleType}
                    />
                </div>
                <div className="w-full flex flex-col ml-4">
                    <h1 className="pb-3">Color</h1>
                    <Datos
                        holder="Ej:Azul"
                        tipo="text"
                        id="vehicleColor"
                        name="vehicleColor"
                        maxLength="20"
                        onChange={handleChange}
                        value={formData.vehicleColor}
                    />
                    {errors.vehicleColor && (
                        <p className="text-red-500 text-sm">{errors.vehicleColor}</p>
                    )}
                </div>
            </div>
            
            <div className="flex w-[100%] rounded-md mt-10 items-end justify-end p-2">
                <button type="submit" className="text-white-50 rounded-md bg-blue-ribbon-600 hover:bg-blue-ribbon-700 p-1.5 px-3 flex flex-row items-center gap-x-1 font-bold mr-4">{isLoading ? (<ClipLoader color="#FFFFFF" size={24}/>): (<MdKeyboardArrowRight className="text-2xl"/>)} CREE SU CONTRASEÑA </button>
            </div>
        </form>
    );
}
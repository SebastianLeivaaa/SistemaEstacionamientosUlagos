import {useEffect, useState} from "react"; 
import Ulogo from "../../assets/img/Ulogo.png";
import Chinquihue from "../../assets/img/Chinquihue.png";
import { LuHistory } from "react-icons/lu";
import { HiOutlineLogin } from "react-icons/hi";
import { LuParkingCircle } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


export const Guardmenu = () => {
    const [user, setUser] = useState({
        email: "",
        username: "",
    })
    const navigate = useNavigate();

    const getProfile = async () => {
        const response = await axios.get("/api/login", {withCredentials: true});
        setUser({
            email: response.data.email,
            username: response.data.username,
        });
    }
    useEffect(() => {
        getProfile();
    }, []);

    const logOut = async () => {
        const response = await axios.get("/api/logout", {withCredentials: true});
        console.log(response);
        navigate('/');
    }

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg">
            <div className="flex flex-col items-center p-8 gap-y-8 rounded-md max-md:w-[75%] max-md:px-4 max-md:py-8 bg-white-50">
                <div className="flex flex-row w-full justify-between">
                    <img src={Ulogo} alt="Logo Ulagos" className="w-44 h-auto"/>
                    <div className="flex flex-col items-start">
                        <h1 className="text-xl font-bold text-center max-md:text-base text-congress-blue-900">{user.username}</h1>
                        <button onClick={logOut} className="mt-4 w-full bg-white font-bold text-red-600  text-lg  flex flex-row items-center justify-center gap-x-1 max-md:text-base"><HiOutlineLogin className="text-3xl max-md:text-2xl"/> CERRAR SESIÓN</button>
                    </div>
                </div>
                <img src={Chinquihue} alt="Logo Ulagos" className="w-full  rounded-lg" />

                <div className="flex flex-col gap-y-4 md:flex-row justify-around w-full py-4">
                    <button onClick={null} className='bg-blue-ribbon-600 text-white px-4 py-4 rounded-md text-lg flex flex-row items-center justify-center font-bold'><LuParkingCircle className="text-2xl"/>ADMINISTRAR ESTACIONAMIENTO</button>
                    <button onClick={null} className='bg-blue-ribbon-600 text-white px-4 py-4 rounded-md text-lg flex flex-row items-center justify-center font-bold'><LuHistory className="text-2xl"/>HISTORIAL DE RESERVAS</button>
                    <button onClick={null} className='bg-blue-ribbon-600 text-white px-4 py-4 rounded-md text-lg font-bold'>✓ CONFIRMAR RESERVA</button>
                </div>
                <div className="h-full w-full bg-customGreen flex flex-col justify-center px-4 py-4 rounded-lg font-semibold">
                    <h1>• Todo conductor debe mostrar su cédula de identidad o licencia de conducir para validar su nombre y RUT.</h1>
                    <h1>• En caso de tener algún imprevisto con la patente, puede validarse con algún documento.</h1>
                    <h1>• Para liberar estacionamiento, se debe ingresar la patente del vehículo que va a retirarse.</h1>
                </div>
            </div>
        </div>
    );
}
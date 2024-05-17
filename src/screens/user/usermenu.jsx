import { useState, useEffect } from "react";
import Ulogo from "../../assets/img/Ulogo.png";
import Chinquihue from "../../assets/img/Chinquihue.png";
import { LuHistory } from "react-icons/lu";
import { HiOutlineLogin } from "react-icons/hi";
import { FaCarAlt } from "react-icons/fa";
import { FaMapMarked } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export const Usermenu = () => {
    const [user, setUser] = useState({
        email: "",
        username: "",
    })
    const navigate = useNavigate();

    const getProfile = async () => {
        try{
            const response = await axios.get("/api/login", {withCredentials: true});
            setUser({
                email: response.data.email,
                username: response.data.username,
            });
        }catch(error){
            navigate("/");
        }
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
                        <button onClick={logOut} className="mt-4 w-full bg-white font-bold text-red-600  text-lg  flex flex-row items-center justify-center gap-x-1 max-md:text-base"><HiOutlineLogin className="text-3xl max-md:text-2xl"/>CERRAR SESIÓN</button>
                    </div>
                </div>
                <img src={Chinquihue} alt="Logo Ulagos" className="w-[100%] flex rounded-lg" />

                <div className="flex flex-wrap justify-between w-[90%] md:flex-row">
                    <button className="w-[42%] bg-blue-ribbon-600 text-white-100 font-bold rounded-md p-4 text-lg flex flex-row items-center justify-center gap-x-6"><FaCarAlt className="text-2xl"/>RESERVAR ESTACIONAMIENTO</button>
                    <button className="w-[42%] bg-blue-ribbon-600 text-white-100 font-bold rounded-md p-4 text-lg flex flex-row items-center justify-center gap-x-6"><LuHistory className="text-2xl"/>MIS RESERVAS</button>
                </div>
                <div className="flex flex-wrap justify-between w-[90%]">
                    <button className="w-[42%] bg-blue-ribbon-600 text-white-100 font-bold rounded-md p-4 text-lg flex flex-row items-center justify-center gap-x-6"><FaMapMarked className="text-2xl"/>MAPA DE ESTACIONAMIENTO</button>
                    <button className="w-[42%] bg-blue-ribbon-600 text-white-100 font-bold rounded-md p-4 text-lg flex flex-row items-center justify-center gap-x-6"><FaCarAlt className="text-2xl"/>ACTUALIZAR DATOS DE VEHÍCULO</button>
                </div>
            </div>
        </div>
    );
}
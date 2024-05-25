import React, {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import { HiOutlineLogin } from "react-icons/hi";
import Ulogo from "../../assets/img/Ulogo.png";
import axios from "axios";

export const ReservationHistory = () => {

    const [user, setUser] = useState({
        email: "",
        userName: "",
        userLastNamePat: "",
        userLastNameMat: "",
    });
    const navigate = useNavigate();

    const logOut = async () => {
        const response = await axios.get("/api/logout", {withCredentials: true});
        navigate('/');
    };

    const getProfile = async () => {
        try{
            const response = await axios.get("/api/login", {withCredentials: true});
            setUser({
                email: response.data.email,
                userName: response.data.userName,
                userLastNamePat: response.data.userLastNamePat,
                userLastNameMat: response.data.userLastNameMat,
            });
        }catch(error){
            navigate("/");
        }
    };



    useEffect(() => {
        getProfile();
    }, []);

    return(
        <div className="w-screen min-h-screen flex items-center justify-center py-16">
            <div className="flex flex-col h-[800px] w-[50%] overflow-y-scroll p-8 gap-y-8 rounded-md max-md:w-[75%] max-md:px-4 max-md:py-8 bg-white-50 relative">
                <div className="flex flex-wrap sm:flex-row w-full justify-between">
                    <img src={Ulogo} alt="Logo Ulagos" className="px-5 w-full sm:w-60 h-auto" />
                    <div className="flex flex-col items-end justify-end">
                        <h1 className="text-lg font-bold text-center max-md:text-base text-congress-blue-900">{user.userName.toLocaleUpperCase()} {user.userLastNamePat.toLocaleUpperCase()} {user.userLastNameMat.toLocaleUpperCase()}</h1>
                        <button onClick={logOut} className="mt-4 bg-white font-bold text-red-600 text-lg flex flex-row items-center justify-center gap-x-1 max-md:text-base"><HiOutlineLogin className="text-3xl max-md:text-2xl" />CERRAR SESIÓN</button>
                    </div>
                </div>
                <div className='flex flex-col items-center gap-y-8'>
                    <h1 className='font-bold text-2xl mt-10'>TUS VEHÍCULOS</h1>
                </div>
            </div>
        </div>
    )
}
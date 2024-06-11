import { useState, useEffect } from "react";
import { HiOutlineLogin } from "react-icons/hi";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Ulogo from "../../assets/img/Ulogo.png";
import { ParkingMap } from "../../components/ParkingMap"; 

export const Reserve = () =>{
  const [user, setUser] = useState({
    email: "",
    userName: "",
    userLastNamePat: "",
    userLastNameMat: "",
})
const [parkingSpaces, setParkingSpaces] = useState(null);
const navigate = useNavigate();

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
}

const getParkingSpaces = async () => {
    try{
        const response = await axios.get("/api/parkingSpaces", {withCredentials: true});
        setParkingSpaces(response.data.total_libres);
    }catch(error){
        console.log(error);
    }
}
useEffect(() => {
    getProfile();
    getParkingSpaces();
    const interval = setInterval(() => {
        getParkingSpaces();
    }, 10000);

    return () => clearInterval(interval);
}, []);

const logOut = async () => {
    const response = await axios.get("/api/logout", {withCredentials: true});
    //console.log(response);
    navigate('/');
}

  return(
    <div className="min-h-screen w-screen flex items-center justify-center bg">
      <div className="flex flex-col items-center p-8 gap-y-8 rounded-md max-md:w-[75%] max-h-[50%] max-md:px-4 max-md:py-8 bg-white-50">
        <div className="flex flex-wrap lg:flex-row w-full justify-end sm:justify-between lg:justify-between">
            <img src={Ulogo} alt="Logo Ulagos" className="px-5 w-full sm:w-60 h-auto"/>
            <div className="flex flex-col items-end justify-end mt-4">
                <h1 className="text-lg font-bold text-center max-md:text-base text-congress-blue-900">{user.userName.toLocaleUpperCase()} {user.userLastNamePat.toLocaleUpperCase()} {user.userLastNameMat.toLocaleUpperCase()}</h1>
                <button onClick={logOut} className="mt-4 bg-white font-bold text-red-600  text-lg  flex flex-row items-center justify-center gap-x-1 max-md:text-base"><HiOutlineLogin className="text-3xl max-md:text-2xl"/>CERRAR SESIÓN</button>
            </div>
        </div>
        <div className="flex w-full justify-start">
        <h1 className="font-bold text-xl text-center">SELECCIONE UN ESTACIONAMIENTO:</h1>
        </div>
        <div className="border-bold border-red-700 border select-none flex items-center justify-center">
            <ParkingMap/>
        </div>
      </div> 
    </div>
  );
}
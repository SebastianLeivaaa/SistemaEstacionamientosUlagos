import React from "react";
import Ulogo from "../../assets/img/Ulogo.png";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { HiOutlineLogin } from "react-icons/hi";

export const Reservations = () =>{
  const [user, setUser] = useState({
    email: "",
    username: "",
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
          username: response.data.username,
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
      <div className="flex flex-col items-center p-8 gap-y-8 rounded-md max-md:w-[75%] max-md:px-4 max-md:py-8 bg-white-50">
        <div className="flex flex-wrap sm:flex-row w-full justify-between">
        <img src={Ulogo} alt="Logo Ulagos" className="px-5 w-full sm:w-60 h-auto"/>
        <div className="flex flex-col items-end justify-end mt-4">
          <h1 className="text-lg font-bold text-center max-md:text-base text-congress-blue-900">{user.username.toLocaleUpperCase()} {user.userLastNamePat.toLocaleUpperCase()} {user.userLastNameMat.toLocaleUpperCase()}</h1>
          <button onClick={logOut} className="mt-4 bg-white font-bold text-red-600  text-lg  flex flex-row items-center justify-center gap-x-1 max-md:text-base"><HiOutlineLogin className="text-3xl max-md:text-2xl"/>CERRAR SESIÓN</button>
        </div>
        </div>
        <div className="grid  w-full p-10 border-red-600 border justify-center">
          <h1 className="font-bold text-xl">MIS RESERVAS</h1>
        </div>

      </div>
    </div>
  );
}
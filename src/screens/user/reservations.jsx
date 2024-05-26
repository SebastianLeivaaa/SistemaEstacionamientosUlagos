import React from "react";
import Ulogo from "../../assets/img/Ulogo.png";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { HiOutlineLogin } from "react-icons/hi";
import { CurrentReservation } from "../../components/currentRevervation";
import { RecordReservationData } from "../../components/recordReservationData";
import { LuCalendarClock } from "react-icons/lu";

export const Reservations = () =>{
  const [user, setUser] = useState({
    email: "",
    userName: "",
    userLastNamePat: "",
    userLastNameMat: "",
    userRut: "",
})
const navigate = useNavigate();
const [current, setCurrent] = useState(true); 
const [recordReservation, setRecordReservation] = useState([]);
const [currentReservation, setCurrentReservation] = useState([]);

const getRecordReservation = async (userRut) => {
  try {
      const response = await axios.post('/api/get-record-reservation', { userRut }, { withCredentials: true });
      setRecordReservation(response.data);
  } catch (error) {
      console.log(error);
  }
};

const getCurrentReservation = async (userRut) => {
  try {
      const response = await axios.post('/api/get-current-reservation', { userRut }, { withCredentials: true });
      setCurrentReservation(response.data);
  } catch (error) {
      console.log(error);
  }

}

const handleCurrentClick = () => {
  setCurrent(true);
}

const handleRecordClick = () => {
  setCurrent(false);
}

const getProfile = async () => {
  try{
      const response = await axios.get("/api/login", {withCredentials: true});
      setUser({
          email: response.data.email,
          userName: response.data.userName,
          userLastNamePat: response.data.userLastNamePat,
          userLastNameMat: response.data.userLastNameMat,
          userRut: response.data.userRut,
      });
      return response.data.userRut;
  }catch(error){
      navigate("/");
  }
}

const fetchProfileAndReservations = async () => {
  const userRut = await getProfile();
  if (userRut) {
      await getRecordReservation(userRut);
      await getCurrentReservation(userRut);
  }
};

useEffect(() => {
  fetchProfileAndReservations();
}, []);

const logOut = async () => {
  const response = await axios.get("/api/logout", {withCredentials: true});
  //console.log(response);
  navigate('/');
}

  return(
    <div className="min-h-screen w-screen flex items-center justify-center py-16">
      <div className="flex flex-col w-[50%] h-[800px] overflow-scroll items-center p-8 gap-y-8 rounded-md max-md:w-[75%] max-md:px-4 max-md:py-8 bg-white-50">
        <div className="flex flex-wrap justify-end xl:flex-wrap lg:flex-wrap md:flex-wrap sm:flex-wrap xl:justify-between lg:justify-end md:justify-end sm:justify-end w-full ">
          <img src={Ulogo} alt="Logo Ulagos" className="px-5 w-full xl:w-1/2 lg:w-full md:w-full sm:w-full"/>
         <div className="flex flex-col items-end justify-end mt-4">
            <h1 className="text-lg font-bold text-center max-md:text-base text-congress-blue-900">{user.userName.toLocaleUpperCase()} {user.userLastNamePat.toLocaleUpperCase()} {user.userLastNameMat.toLocaleUpperCase()}</h1>
            <button onClick={logOut} className="mt-4 bg-white font-bold text-red-600  text-lg  flex flex-row items-center justify-center gap-x-1 max-md:text-base"><HiOutlineLogin className="text-3xl max-md:text-2xl"/>CERRAR SESIÓN</button>
          </div>
        </div>
        <div className="w-full flex justify-center mt-8">
          <h1 className="font-bold text-2xl">MIS RESERVAS</h1>
        </div>
        <div className="flex flex-row justify-around w-full">
          <button onClick={handleCurrentClick} className={`${current ? 'bg-blue-ribbon-600 text-white-50' : 'bg-white-50 text-black'}  px-8 py-2 rounded-md text-base font-semibold hover:bg-blue-ribbon-600 hover:text-white-50 max-md:text-sm max-md:px-2`} disabled={current}>VIGENTES</button>
          <button onClick={handleRecordClick} className={`${!current ? 'bg-blue-ribbon-600 text-white-50' : 'bg-white-50 text-black'} px-8 py-2 rounded-md text-base font-semibold hover:bg-blue-ribbon-600 hover:text-white-50 max-md:text-sm`} disabled={!current}>HISTORIAL</button>
        </div>
        <div className={` ${current ? 'w-[100%]' : 'w-[60%]'} p-8 flex flex-col gap-y-12 max-md:w-[100%] max-md:p-0 items-center justify-center`}>
          {current ? (
            currentReservation.length === 0 ? (
              <div className="flex flex-col items-center gap-y-8">
                <LuCalendarClock className="text-9xl text-gray-700"/>
                <h1 className="text-2xl font-bold text-center text-gray-700">No tienes reservas vigentes</h1>
              </div>
            ) : (
              <CurrentReservation userRut={user.userRut} patente={currentReservation[0].rese_vehi_patente} fecha={currentReservation[0].rese_fecha} numeroEstacionamiento={currentReservation[0].esta_numero} horaInicio={currentReservation[0].rese_hora_inicio} refreshReservations={fetchProfileAndReservations}/> 
            )
          )
          : (
            recordReservation.length === 0 ? (
              <div className="flex flex-col items-center gap-y-8">
                <LuCalendarClock className="text-9xl text-gray-700"/>
                <h1 className="text-2xl font-bold text-center text-gray-700">No tienes reservas en tu historial</h1>
              </div>
            ) : (
              recordReservation.map((record, index) => (
                <RecordReservationData patente={record.rese_vehi_patente} firstRecord={index === 0} fecha={record.rese_fecha} horaLlegada={record.rese_hora_llegada} horaSalida={record.rese_hora_salida} numeroEstacionamiento={record.esta_numero} index={index}/>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
}
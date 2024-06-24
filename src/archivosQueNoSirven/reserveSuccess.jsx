import { useState, useEffect } from "react";
import { HiOutlineLogin } from "react-icons/hi";
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';
import Ulogo from "../../assets/img/Ulogo.png";
import { FaCheckCircle } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { FaTrashAlt } from "react-icons/fa";
import { BsQuestionCircle } from "react-icons/bs";
import { FaCheck } from "react-icons/fa";
import { ClipLoader } from 'react-spinners';
import { FaX } from "react-icons/fa6";
import { BsXCircle } from "react-icons/bs";
import { formatDateTwo } from "../utils/formatDateTwo";
import { BsCheckCircle } from "react-icons/bs";



export const ReserveSuccess = (props) =>{
  const [user, setUser] = useState({
    email: "",
    userName: "",
    userLastNamePat: "",
    userLastNameMat: "",
    userRut: "",
  });

  const location = useLocation();
  const navigate = useNavigate();
  const numParking = location.state.parking;
  const timeReservation = location.state.timeReservation;
  const vehiclePatent = location.state.vehiclePatent;
  const [showConfirmation, setShowConfirmation] = useState(false);


  const getProfile = async () => {
    try {
      const response = await axios.get("/api/login", {withCredentials: true});
      setUser({
        email: response.data.email,
        userName: response.data.userName,
        userLastNamePat: response.data.userLastNamePat,
        userLastNameMat: response.data.userLastNameMat,
        userRut: response.data.userRut,
      });
      return response.data.userRut;
    } catch (error) {
      navigate("/");
    }
  }

const handleModal = () => {
    setShowConfirmation(!showConfirmation);
}

  useEffect(() => {
    getProfile();
  }, []);

  const logOut = async () => {
    const response = await axios.get("/api/logout", {withCredentials: true});
    navigate('/');
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg">
      {showConfirmation && (<div className="fixed inset-0 bg-black opacity-50 z-50"></div>)}
      <div className="flex flex-col items-center p-8 gap-y-8 rounded-md max-md:w-[75%] max-h-[50%] max-md:px-4 max-md:py-8 bg-white-50 relative">
        <div className="flex flex-wrap lg:flex-row w-full justify-end sm:justify-between lg:justify-between">
          <img src={Ulogo} alt="Logo Ulagos" className="px-5 w-full sm:w-60 h-auto"/>
          <div className="flex flex-col items-end justify-end mt-4">
            <h1 className="text-lg font-bold text-center max-md:text-base text-congress-blue-900">
              {user.userName.toLocaleUpperCase()} {user.userLastNamePat.toLocaleUpperCase()} {user.userLastNameMat.toLocaleUpperCase()}
            </h1>
            <button onClick={logOut} className="mt-4 bg-white font-bold text-red-600 text-lg flex flex-row items-center justify-center gap-x-1 max-md:text-base">
              <HiOutlineLogin className="text-3xl max-md:text-2xl"/>CERRAR SESIÓN
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <FaCheckCircle className="text-[200px] text-blue-500"/>
          <h2 className="text-2xl font-bold text-center mt-4 text-congress-blue-900">¡Reserva Exitosa!</h2>
          <p className="text-center mt-4 text-gray-700 text-lg font-bold max-md:text-base">
            Para hacer válida tu reserva, por favor presenta tu código QR o proporciona tu RUT al guardia de seguridad al llegar.
          </p>
          <p className="text-center mt-4 text-gray-700 max-md:text-sm">
            Recuerda que debes llegar antes del horario máximo de llegada para validar tu reserva. Si no llegas a tiempo, tu reserva se cancelará automáticamente.
          </p>
          <div className="flex flex-row items-center justify-between w-full max-md:flex-col max-md:gap-y-4 mt-16 max-md:mt-4">
            <div className="flex flex-col gap-y-1 font-semibold max-md:text-center">
              <p className="text-lg max-md:text-base">Patente vehículo: {vehiclePatent}</p>
              <p className="text-lg max-md:text-base">N° Estacionamiento: {numParking}</p>
              <p className="text-lg max-md:text-base">Fecha: {formatDateTwo(timeReservation.fecha)}</p>
              <p className="text-lg max-md:text-base">Horario máximo de llegada: {timeReservation.hora_llegada}</p>
            </div>
            <div className="flex flex-col gap-y-4">
              <button type="button" onClick={() => navigate('/user')} className="mr-6 flex flex-row max-md:text-sm p-3 bg-blue-ribbon-600 hover:bg-blue-ribbon-700 rounded-md font-bold w-[100%] max-md:w-full text-white-50 items-center justify-center gap-x-2">
                <IoHome className="text-xl"/> VOLVER AL MENÚ PRINCIPAL
              </button>
              <button type="button" onClick={handleModal} className="mr-6 flex flex-row max-md:text-sm p-3 bg-red-500 hover:bg-red-600 rounded-md font-bold w-[100%] max-md:w-full text-white-50 items-center justify-center gap-x-2">
                <FaTrashAlt className="text-xl"/> CANCELAR RESERVA
              </button>
            </div>
          </div>
        </div>
        {showConfirmation && <ModalDeleteReservation userRut={user.userRut} handleModal={handleModal}/>}
      </div> 
    </div>
  );
}

const ModalDeleteReservation = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const deleteReservation = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/delete-reservation', { userRut: props.userRut }, { withCredentials: true });
      if (response.status === 200) {
        setSuccess(true); // Cambia a true si la eliminación es exitosa
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
      console.log(error);
    }
    setIsLoading(false);
  }

  return (
    <div className="fixed z-50 flex flex-col items-center justify-center inset-0 m-auto w-fit h-fit bg-white-50 border-[1px] border-black rounded-lg p-8 gap-y-6">
      {error ? (
        <>
          <BsXCircle className='text-9xl text-red-500'/>
          <h1 className='text-center text-xl'>Ha ocurrido un error al intentar cancelar la reserva</h1>
          <div className='flex flex-row justify-center items-center gap-x-4 mt-4'>
            <button onClick={props.handleModal} className='bg-red-500 text-white-50 font-bold p-1.5 px-3 rounded-lg items-center flex flex-row gap-x-1'><FaTimes/> Cerrar</button>
          </div>
        </>
      ) : (
        success ? (
          <>
            <BsCheckCircle className='text-9xl text-green-600'/>
            <h1 className='text-center text-xl'>¡Reserva cancelada exitosamente!</h1>
            <button type="button" onClick={() => navigate('/user')} className="flex flex-row max-md:text-sm p-3 bg-blue-ribbon-600 hover:bg-blue-ribbon-700 rounded-md font-bold w-[100%] max-md:w-full text-white-50 items-center justify-center gap-x-2">
              <IoHome className="text-xl"/> VOLVER AL MENÚ PRINCIPAL
            </button>
          </>
        ) : (
          <>
            <BsQuestionCircle className='text-9xl text-red-500'/>
            <h1 className='text-center text-xl'>¿Estás seguro que deseas cancelar tu reserva?</h1>
            <div className='flex flex-row justify-center items-center gap-x-12 mt-4'>
              <button onClick={deleteReservation} className='bg-green-700 text-white-50 font-bold p-1.5 px-3 rounded-lg items-center flex flex-row gap-x-1'> {isLoading ? (<ClipLoader color="#FFFFFF" size={24}/>) : (<FaCheck/>)} Sí</button>
              <button onClick={props.handleModal} className='bg-red-500 text-white-50 font-bold p-1.5 px-3 rounded-lg items-center flex flex-row gap-x-1'><FaX/> No</button>
            </div>
          </>
        )
      )}
    </div>
  );
}


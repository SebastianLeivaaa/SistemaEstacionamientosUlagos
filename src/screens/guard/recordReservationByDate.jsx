import React, {useState, useEffect} from "react";
import { useLocation } from 'react-router-dom';
import { HiOutlineLogin } from "react-icons/hi";
import Ulogo from "../../assets/img/Ulogo.png";
import axios from "axios";
import { RecordReservationDataGuard } from "../../components/recordReservationDataGuard";
import { formatDateTwo } from "../../utils/formatDateTwo";
import { useNavigate } from 'react-router-dom';



export const RecordReservationByDate = (props) => {
    const [user, setUser] = useState({
        email: "",
        userName: "",
        userLastNamePat: "",
        userLastNameMat: "",
    });

    const location = useLocation();
    const recordReservation = location.state?.recordReservation;
    const navigate = useNavigate();
    const logOut = async () => {
        const response = await axios.get("/api/logout", { withCredentials: true });
        navigate('/');
    }

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
    return (
        <div className="w-screen min-h-screen flex items-center justify-center py-16">
            <div className="flex flex-col h-[800px] w-[50%] overflow-y-scroll p-8 gap-y-8 rounded-md max-md:w-[75%] max-md:px-4 max-md:py-8 bg-white-50 relative">
                <div className="flex flex-wrap sm:flex-row w-full justify-between">
                    <img src={Ulogo} alt="Logo Ulagos" className="px-5 w-full sm:w-60 h-auto" />
                    <div className="flex flex-col items-end justify-end max-sm:w-full max-sm:justify-center max-sm:items-center">
                        <h1 className="text-lg font-bold text-center max-md:text-base text-congress-blue-900">{user.userName.toLocaleUpperCase()} {user.userLastNamePat.toLocaleUpperCase()} {user.userLastNameMat.toLocaleUpperCase()}</h1>
                        <button onClick={logOut} className="mt-4 bg-white font-bold text-red-600 text-lg flex flex-row items-center justify-center gap-x-1 max-md:text-base"><HiOutlineLogin className="text-3xl max-md:text-2xl" />CERRAR SESIÓN</button>
                    </div>
                </div>
                <div className='flex flex-col items-center justify-center gap-y-4'>
                    <h1 className='font-bold text-2xl mt-10 text-center'>HISTORIAL DE RESERVAS</h1>
                    <h2 className='text-xl flex flex-row gap-x-1 text-center'>Resultados para la fecha {formatDateTwo(recordReservation[0].rese_fecha)}</h2>
                </div>
                <div className='p-8 w-[100%] flex flex-col gap-y-12 max-md:w-[100%] max-md:p-0 items-center justify-center'>
                    {recordReservation.map((record, index) => (
                        <RecordReservationDataGuard 
                            key={index} 
                            patente={record.rese_vehi_patente}
                            fecha={record.rese_fecha}
                            rut={record.rese_usua_rut}
                            nombre={record.usua_nombre}
                            apellidoPat={record.usua_apellido_paterno}
                            apellidoMat={record.usua_apellido_materno}
                            horaLlegada={record.rese_hora_llegada}
                            horaSalida={record.rese_hora_salida}
                            numeroEstacionamiento={record.esta_numero}
                            tipo={record.usua_tipo}
                            firstRecord={index === 0}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
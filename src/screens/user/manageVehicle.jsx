import React, { useState, useEffect} from 'react';
import Ulogo from "../../assets/img/Ulogo.png";
import { HiOutlineLogin } from "react-icons/hi";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { VehicleData } from '../../components/vehicleData';
import { IoIosArrowDropleft } from "react-icons/io";
import { IoIosArrowDropright } from "react-icons/io";


export const ManageVehicle = () => {

    const [user, setUser] = useState({
        email: "",
        userName: "",
        userLastNamePat: "",
        userLastNameMat: "",
        userRut: "",
    })
    const [vehicles, setVehicles] = useState([]);

    const [startIndex, setStartIndex] = useState(0);
    const itemsPerView = 3;

    const handlePrevClick = () => {
        setStartIndex((prevIndex) => Math.max(prevIndex - itemsPerView, 0));
    };

    const handleNextClick = () => {
        setStartIndex((prevIndex) => Math.min(prevIndex + itemsPerView, vehicles.length - itemsPerView));
    };

    const visibleVehicles = vehicles.slice(startIndex, startIndex + itemsPerView);

    const navigate = useNavigate();

    const logOut = async () => {
        const response = await axios.get("http://localhost:3090/api/logout", {withCredentials: true});
        //console.log(response);
        navigate('/');
    }

    const getProfile = async () => {
        try{
            const response = await axios.get("http://localhost:3090/api/login", {withCredentials: true});
            setUser({
                email: response.data.email,
                userName: response.data.username,
                userLastNamePat: response.data.userLastNamePat,
                userLastNameMat: response.data.userLastNameMat,
                userRut: response.data.userRut,
            });
            return response.data.userRut;
        }catch(error){
            navigate("/");
        }
    }

    const getVehicles = async (userRut) => {
        try {
          const response = await axios.post('http://localhost:3090/api/getVehicles', { userRut }, { withCredentials: true });
          setVehicles(response.data);
        } catch (error) {
          console.log(error);
        }
    }      

    useEffect(() => {
        const fetchProfileAndVehicles = async () => {
            const userRut = await getProfile();
            if (userRut) {
                await getVehicles(userRut);
            }
        };

        fetchProfileAndVehicles();
    }, []);

    return(
        <div className="min-h-screen w-screen flex items-center justify-center">
            <div className="flex flex-col min-w-[50%] max-w-[75%] p-8 gap-y-8 rounded-md max-md:w-[75%] max-md:px-4 max-md:py-8 bg-white-50 relative">
                <div className="flex flex-wrap sm:flex-row w-full justify-between">
                    <img src={Ulogo} alt="Logo Ulagos" className="px-5 w-full sm:w-44 h-auto"/>
                    <div className="flex flex-col items-end justify-end">
                        <h1 className="text-lg font-bold text-center max-md:text-base text-congress-blue-900">{user.userName.toLocaleUpperCase()} {user.userLastNamePat.toLocaleUpperCase()} {user.userLastNameMat.toLocaleUpperCase()}</h1>
                        <button onClick={logOut} className="mt-4 bg-white font-bold text-red-600  text-lg  flex flex-row items-center justify-center gap-x-1 max-md:text-base"><HiOutlineLogin className="text-3xl max-md:text-2xl"/>CERRAR SESIÓN</button>
                    </div>
                </div>
                <h1 className='font-bold text-2xl mt-10'>DATOS VEHÍCULO</h1>
                <div className='flex flex-row items-center gap-x-12'>
                <button onClick={handlePrevClick} disabled={startIndex === 0}>
                    <IoIosArrowDropleft className='text-2xl'/>
                </button>
                <div className="items-center gap-x-12 overflow-hidden">
                    <div className='carousel-track ease-in-out transition-transform flex flex-row gap-x-12' style={{ transform: `translateX(-${(startIndex / itemsPerView) * 100}%)` }}>
                        {visibleVehicles.length > 0 ? (
                            visibleVehicles.map((vehicle, index) => (
                                <VehicleData
                                    key={index}
                                    patente={vehicle.vehi_patente}
                                    marca={vehicle.vehi_marca}
                                    modelo={vehicle.vehi_modelo}
                                    anio={vehicle.vehi_anio}
                                    color={vehicle.vehi_color}
                                    tipo={vehicle.vehi_tipo}
                                    estado={vehicle.regi_estado}
                                    rut={vehicle.regi_usua_rut}
                                    index={index + 1 + startIndex}
                                />
                        )   )
                        ) : (
                            <p>No se encontraron vehículos.</p>
                        )}
                    </div>
                </div>
                <button onClick={handleNextClick} disabled={startIndex + itemsPerView >= vehicles.length}>
                    <IoIosArrowDropright className='text-2xl'/>
                </button>
                </div>
            </div>
        </div>
    )
}
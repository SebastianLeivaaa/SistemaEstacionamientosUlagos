import React, {useState} from "react";
import { IoHome } from "react-icons/io5";
import { IoSearch } from "react-icons/io5"
import { useNavigate } from 'react-router-dom';;
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { TiWarning } from "react-icons/ti";
import { formatDateTwo } from "../utils/formatDateTwo";



export const SearchByDate = () => {

    const [formData, setFormData] = useState({
        date: '',
    });

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        setMessage(null);
        const newErrors = {};
        if(formData.date < minDate || formData.date >= today){
            newErrors.date = `Por favor, ingrese una fecha entre ${formatDateTwo(minDate)} y ${formatDateTwo(today)}`;
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        }else{
            try {
                const response = await axios.post("/api/get-record-reservation-by-date", formData, { withCredentials: true });
                console.log(response.data)
                navigate('/record-reservation-by-date', { state: { recordReservation: response.data } } )
            }catch(error){
                setMessage({ text: error.response?.data?.message || 'Error al buscar el historial' });
            }
        }
        setIsLoading(false);
    }

    const today = new Date().toISOString().split('T')[0];
    const minDate = '2024-01-01';


    return (
        <div className="flex flex-col w-full gap-y-8">
            <div className="flex flex-col gap-y-4 max-md:gap-y-2">
                <label className="text-xl max-md:text-lg">Fecha</label>
                <input
                    type='date'
                    id='date'
                    onChange={handleChange}
                    value={formData.date}
                    maxLength='6'
                    name='date'
                    className='w-[50%] max-md:w-[100%] p-1 border-[0.5px] border-blue-ribbon-600'
                    placeholder='DD/MM/AAAA'
                    max={today}
                    min={minDate}
                />
                {errors.date && (
                    <p className='text-red-600 text-base max-md:text-center'>{errors.date}</p>
                )}
            </div>
            {message && (
                <div className="flex flex-row gap-x-2 justify-center items-center max-md:flex-col">
                    <TiWarning className="text-2xl text-red-600"/>
                    <p className='text-red-600 text-base max-md:text-center'>{message.text}</p>
                </div>
            )}
            <div className="flex flex-row justify-around mt-16 max-md:flex-col max-md:gap-y-4 max-md:mt-0">
                <button className='mr-6 flex flex-row max-md:text-sm p-3 bg-blue-ribbon-600 hover:bg-blue-ribbon-700 rounded-md font-bold w-fit max-md:w-full text-white-50 items-center justify-center gap-x-2 '>
                    <IoHome className="text-2xl"/> VOLVER AL MENU PRINCIPAL
                </button>
                <button onClick={handleSubmit} className='flex flex-row p-3 max-md:text-sm bg-blue-ribbon-600 hover:bg-blue-ribbon-700 rounded-md font-bold w-fit max-md:w-full text-white-50 items-center justify-center gap-x-2 '>
                    {isLoading ? (<ClipLoader color="#FFFFFF" size={24}/>) : (<IoSearch className="text-2xl"/>)}  CONSULTAR
                </button>
            </div>
        </div>
    )
}
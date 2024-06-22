import React, { useState, useEffect } from "react";
import { CurrentReservation } from "./components/currentReservation";
import { RecordReservationData } from "./components/recordReservationData";
import { LuCalendarClock } from "react-icons/lu";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";
import axios from "axios";  

export const MyReservations = ({ user }) => {
  const [recordReservation, setRecordReservation] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 9;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = recordReservation.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(recordReservation.length / recordsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getRecordReservation = async (userRut) => {
    try {
      const response = await axios.post('http://localhost:3090/api/get-record-reservation', { userRut }, { withCredentials: true });
      setRecordReservation(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRecordReservation(user.userRut);
  }, []);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 7) {
      // Si hay 7 páginas o menos, muéstralas todas
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Si hay más de 7 páginas, aplica la lógica de truncamiento
      if (currentPage <= 4) {
        pageNumbers.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage > 4 && currentPage < totalPages - 3) {
        pageNumbers.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      } else {
        pageNumbers.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      }
    }
    return pageNumbers.map((number, index) =>
      number === "..." ? (
        <li key={index} className="w-full h-full">
          <span className="p-2 px-3 w-full h-full items-end flex text-black dark:text-white-50 text-lg">...</span>
        </li>
      ) : (
        <li key={index} className="w-full h-full">
          <button
            onClick={() => paginate(number)}
            className={`p-2 w-[40px] h-[40px] rounded-md border-[1px] border-gray-600 ${
              currentPage === number ? "bg-midnight-700 text-white-50" : "bg-white-50"
            }`}
            disabled={currentPage === number}
          >
            {number}
          </button>
        </li>
      )
    );
  };

  return (
    <div className="w-full h-full flex flex-col px-4 xl:px-60 m-auto items-center grow max-md:px-2 gap-y-4 overflow-y-scroll">
      <CurrentReservation user={user} />
      <div className="dark:bg-midnight-950 bg-white-50 shadow-3xl contrast-[95%] mb-8 rounded-md p-8 max-md:p-4 w-full flex flex-col gap-y-8 max-md:gap-y-4">
        <h1 className="dark:text-white-50 text-black font-bold text-2xl flex flex-row gap-x-2 items-center"><FaFileAlt className="text-2xl text-black dark:text-white-50"/> Historial de reservas</h1>
        <div className="grid grid-cols-3 max-md:grid-cols-1 items-center justify-center w-full gap-6">
          {currentRecords.length === 0 ? (
            <div className="flex flex-col max-md:flex-row gap-x-2 items-center col-span-3 gap-y-8 w-full justify-center">
              <LuCalendarClock className="text-9xl text-gray-700 dark:text-white-50"/>
              <h1 className="text-center text-2xl max-md:text-xl font-bold text-black dark:text-white-50">No tienes una reserva vigente</h1>
            </div>
          ) : (
            currentRecords.map((record, index) => (
              <RecordReservationData
                key={index}
                patente={record.rese_vehi_patente}
                fecha={record.rese_fecha}
                horaLlegada={record.rese_hora_llegada}
                fechaSalida={record.rese_fecha_salida}
                horaSalida={record.rese_hora_salida}
                numeroEstacionamiento={record.esta_numero}
              />
            ))
          )}
        </div>
        {currentRecords.length > 0 && (
          <div className="flex justify-center mt-4">
            <ul className="flex flex-row gap-x-2 max-md:gap-x-1">
              <button
                onClick={() => paginate(currentPage - 1)}
                className={`text-black dark:text-white-50 w-full h-full`}
                disabled={currentPage === 1}
              >
                <MdKeyboardArrowLeft className={`text-2xl ${currentPage === 1 ? "text-gray-500" : " dark:text-white-50 text-black"}`} />
              </button>
              {renderPageNumbers()}
              <button
                onClick={() => paginate(currentPage + 1)}
                className={`text-black dark:text-white-50 w-full h-full`}
                disabled={currentPage === totalPages}
              >
                <MdKeyboardArrowRight className={`text-2xl ${currentPage === totalPages ? "text-gray-500" : " dark:text-white-50 text-black"}`} />
              </button>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

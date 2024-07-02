import React, { useState, useEffect} from "react";
import { FaSearch } from "react-icons/fa";
import { FaFileAlt } from "react-icons/fa";
import { SearchByPatent } from "../../components/searchByPatent";
import { SearchByRut } from "../../components/searchByRut";
import { SearchByDate } from "../../components/searchByDate";
import { RecordReservationDataGuard } from "./components/recordReservationDataGuard";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { formatDateTwo } from "../../utils/formatDateTwo";


export const History = () => {

  const [current, setCurrent] = useState('patente');
  const [recordReservation, setRecordReservation] = useState([]);
  const [resultFor, setResultFor] = useState('null');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 9;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = recordReservation.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(recordReservation.length / recordsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePatenteClick = () => {
    setCurrent('patente');
  }


  const handleRutClick = () => {
     setCurrent('rut');
  }

  const handleDateClick = () => {
      setCurrent('fecha');
  }

  const updateRecordReservation = (data) => {
    setRecordReservation(data);
  }

  const handleResultFor = (data) => {
    setResultFor(data);
  }
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

useEffect(() => {
  setCurrentPage(1);
}, [recordReservation]);

  return (
    <div className="w-full h-full flex flex-col px-4 2xl:px-32 pt-8 m-auto items-center max-md:px-2 gap-y-4 overflow-y-scroll">
      <div className="dark:bg-midnight-950 bg-white-50 shadow-3xl contrast-[95%] rounded-md p-8 max-md:p-4 w-full flex flex-col gap-y-8 max-md:gap-y-4 text-white-50">
        <h1 className="dark:text-white-50 text-black font-bold text-2xl flex flex-row gap-x-2 items-center"><FaSearch className="text-3xl text-black dark:text-white-50" /> Buscar por</h1>
        <div className="flex flex-row gap-x-8 w-full justify-start max-lg:grid max-lg:grid-cols-3 max-md:grid-cols-3 max-lg:gap-x-2 max-md:gap-x-2 gap-y-3">
          <button onClick={handlePatenteClick} className={`${current === 'patente' ? 'bg-midnight-700' : 'hover:bg-midnight-800 hover:text-white-50 text-black dark:text-white-50'} flex flex-col p-2 py-4 max-md:py-2 rounded-md w-full h-full justify-center items-center max-md:gap-y-0`} disabled={current === 'patente'}>
            <h1 className="text-xl font-bold text-center max-lg:text-base max-sm:text-xs">Patente</h1>
          </button>
          <button onClick={handleRutClick} className={`${current === 'rut' ? 'bg-midnight-700' : 'hover:bg-midnight-800 hover:text-white-50 text-black dark:text-white-50'} flex flex-col p-2 py-4 max-md:py-2 rounded-md w-full h-full justify-center items-center max-md:gap-y-0`} disabled={current === 'rut'}>
            <h1 className="text-xl font-bold text-center max-lg:text-base max-sm:text-xs">Rut</h1>
          </button>
          <button onClick={handleDateClick} className={`${current === 'fecha' ? 'bg-midnight-700' : 'hover:bg-midnight-800 hover:text-white-50 text-black dark:text-white-50'} flex flex-col p-2 py-4 max-md:py-2 rounded-md w-full h-full justify-center items-center max-md:gap-y-0`} disabled={current === 'fecha'}>
            <h1 className="text-xl font-bold text-center max-lg:text-base max-sm:text-xs">Fecha</h1>
          </button>
        </div>
        {current === 'patente' ? (
            <SearchByPatent updateRecordReservation={updateRecordReservation} handleResultFor={handleResultFor}/>
          ) : current === 'rut' ? (
              <SearchByRut updateRecordReservation={updateRecordReservation} handleResultFor={handleResultFor}/>
          ) : (
              <SearchByDate updateRecordReservation={updateRecordReservation} handleResultFor={handleResultFor}/>
        )}
      </div>
      <div className="dark:bg-midnight-950 bg-white-50 shadow-3xl contrast-[95%] mb-8 rounded-md p-8 max-md:p-4 w-full h-full flex flex-col gap-y-8 max-md:gap-y-4">
        <h1 className="dark:text-white-50 text-black font-bold text-2xl flex flex-row gap-x-2 items-center"><FaFileAlt className="text-3xl text-black dark:text-white-50" /> Historial de reservas</h1>
        {resultFor === 'patente' ? (
          <h2 className="dark:text-white-50 text-black font-bold text-xl flex flex-row gap-x-2 items-center text-center justify-center">Resultados para patente {recordReservation[0].rese_vehi_patente}</h2>
        ) : resultFor === 'rut' ? (
          <h2 className="dark:text-white-50 text-black font-bold text-xl flex flex-row gap-x-2 items-center text-center justify-center">Resultados para RUT {recordReservation[0].rese_usua_rut}</h2>
        ) : resultFor === 'fecha' ? (
          <h2 className="dark:text-white-50 text-black font-bold text-xl flex flex-row gap-x-2 items-center text-center justify-center">Resultados para la fecha {formatDateTwo(recordReservation[0].rese_fecha)}</h2>
        ) : null}
         <div className="grid grid-cols-3 max-md:grid-cols-1 items-center justify-center w-full gap-6">
          {currentRecords.map((record) => (
            <RecordReservationDataGuard 
              patente={record.rese_vehi_patente}
              fecha={record.rese_fecha}
              rut={record.rese_usua_rut}
              nombre={record.usua_nombre}
              apellidoPat={record.usua_apellido_paterno}
              apellidoMat={record.usua_apellido_materno}
              horaLlegada={record.rese_hora_llegada}
              horaSalida={record.rese_hora_salida}
              fechaSalida={record.rese_fecha_salida}
              numeroEstacionamiento={record.esta_numero}
              tipo={record.usua_tipo}
            />
          ))}
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

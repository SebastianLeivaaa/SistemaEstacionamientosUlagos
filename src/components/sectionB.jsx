import React, {useState, useEffect} from "react";
import { VehicleSVG } from "./vehicleSVG";
import axios from "axios";



export const SectionB = (props) => {

    const [dataSection, setDataSection] = useState([]);

    const getDataSection = async (sectionId) => {
        try {
          const response = await axios.post("/api/get-data-section", { sectionId }, { withCredentials: true });
          const data = response.data;
          setDataSection(data);
            } catch (error) {
          console.log(error);
        }
      };

    useEffect(() => {
        getDataSection(props.sectionId);
    }, [props.sectionId]);

    const getColorForStatus = (estado) => {
        switch (estado) {
          case 'LIBRE':
            return '#0082ff';
          case 'OCUPADO':
            return 'red';
          case 'RESERVADO':
            return '#36b139';
          case 'NO DISPONIBLE':
            return 'gray';
          default:
            return 'black'; 
        }
      };

      return (
        <div className="flex flex-col w-full items-center">
          <ul className="grid grid-cols-9 w-fit gap-y-4">
            {dataSection.map((parking, index) => (
              <React.Fragment key={parking.esta_id}>
                {index === 25 && (
                  <div className="col-span-9 bg-white-900 py-6">
                    <div className="h-full border-dashed border-t-2 border-gray-200 w-full"></div>
                  </div>
                )}
                <li className="flex flex-col gap-y-1 justify-center">
                    <span className="text-center">{parking.esta_numero}{parking.esta_tipo === 'DISCAPACITADOS' && ('*')}</span>
                    <div className="flex flex-row justify-center">
                        <button 
                            className={`flex flex-col items-center w-fit bg-white ${parking.esta_estado !== 'LIBRE' ? "hover:opacity-100" : "hover:opacity-75"}`}
                            onClick={() => handleParkingClick(parking)}
                            disabled={parking.esta_estado !== 'LIBRE'}
                        >
                            <VehicleSVG height="50" width="50" fillColor={getColorForStatus(parking.esta_estado)}/>
                        </button>
                        <div className='w-[1px] h-full bg-black'></div>
                    </div>
                </li>
              </React.Fragment>
            ))}
          </ul>
          <div className="mt-4 text-center text-gray-600">
            Representación visual de dos filas físicas de estacionamientos
          </div>
        </div>
      );
      
};
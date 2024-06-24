import React, {useState, useEffect} from "react";
import { VehicleSVG } from "./vehicleSVG";
import axios from "axios";
import { getColorForStatus } from "../utils/colorForStatus";
import { ModalSelectedParking } from "./modalSelectedParking";
import { ModalSelectedParkingGuard } from "./modalSelectedParkingGuard";





export const SectionB = (props) => {

    const [dataSection, setDataSection] = useState([]);
    const [isGuard, setIsGuard] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedParking, setSelectedParking] = useState([]);


    const getDataSection = async (sectionId) => {
        try {
          const response = await axios.post("/api/get-data-section", { sectionId }, { withCredentials: true });
          const data = response.data;
          setDataSection(data);
            } catch (error) {
          console.log(error);
        }
      };

      const handleParkingSelected = (parking) => {
        setSelectedParking(parking);
        if (props.guard === "guard") {
          setIsGuard(true);
          setShowModal(false);
          
        } else {
            setIsGuard(false);
            setShowModal(true);
        }
      };
  
      const closeModal = () => {
        setShowModal(false);
        setIsGuard(false);
      };

    useEffect(() => {
        getDataSection(props.sectionId);
    }, [props.sectionId]);

      return (
        <>
          {showModal && (<div className="fixed inset-0 bg-black opacity-50 z-30"></div>)}
          {isGuard && (<div className="fixed inset-0 bg-black opacity-50 z-30"></div>)}
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
                    <span className="text-center text-black dark:text-white-50">{parking.esta_numero}{parking.esta_tipo === 'DISCAPACITADOS' && ('*')}</span>
                    <div className="flex flex-row justify-center">
                      <button 
                         className={`flex flex-col items-center w-fit bg-white ${parking.esta_estado !== 'LIBRE' ? "hover:opacity-100" : "hover:opacity-75"}`}
                        onClick={() => handleParkingSelected(parking)}
                        disabled={parking.esta_estado !== 'LIBRE'}
                      >
                        <VehicleSVG height="50" width="50" fillColor={getColorForStatus(parking.esta_estado)}/>
                      </button>
                      <div className='w-[1px] h-full bg-black dark:bg-white-50'></div>
                    </div>
                  </li>
                </React.Fragment>
              ))}
            </ul>
            <div className="mt-4 text-center text-gray-600 dark:text-gray-400">
              Representación visual de dos filas físicas de estacionamientos
            </div>
          </div>
          {showModal && <ModalSelectedParking parking={selectedParking} closeModal={closeModal} handleCurrentPage={props.handleCurrentPage} infoUser={props.infoUser} infoVehicleActive={props.infoVehicleActive}/>}
          {isGuard && <ModalSelectedParkingGuard parking={selectedParking} closeModal={closeModal} onCloseSection={props.onCloseSection}  handleCurrentPage={props.handleCurrentPage} user={props.user}/>}
        </>
      );
      
};
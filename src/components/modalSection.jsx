import React from 'react';
import { SectionA } from "./sectionA";
import { SectionB } from "./sectionB";
import { SectionC } from "./sectionC";
import { SectionD } from "./sectionD";
import { SectionE } from "./sectionE";
import { ParkingMapSection } from './ParkingMapSection';
import { VehicleSVG } from './vehicleSVG';
import { FaAsterisk } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

export const ModalSection = ({ area, onClose, infoUser, infoVehicleActive }) => {

    const getSectionCurrent = (section, sectionId) => {
      switch (section) {
        case 'SECCIÓN A':
          return <SectionA sectionId={sectionId} infoUser={infoUser} infoVehicleActive={infoVehicleActive}/>;
        case 'SECCIÓN B':
          return <SectionB sectionId={sectionId} infoUser={infoUser} infoVehicleActive={infoVehicleActive}/>;
        case 'SECCIÓN C':
          return <SectionC sectionId={sectionId} infoUser={infoUser} infoVehicleActive={infoVehicleActive}/>;
        case 'SECCIÓN D':
          return <SectionD sectionId={sectionId} infoUser={infoUser} infoVehicleActive={infoVehicleActive}/>;
        case 'SECCIÓN E':
          return <SectionE sectionId={sectionId} infoUser={infoUser} infoVehicleActive={infoVehicleActive}/>;
        default:
          return null; 
      }
    };
  
    return (
      <div className="fixed inset-0 flex items-center justify-center h-screen">
        <div className="bg-white-200 p-4 rounded shadow-lg w-fit max-md:w-[85%] flex flex-col gap-y-8 items-center max-md:max-h-[90%] min-h-[75%] max-h-[75%] overflow-y-scroll relative">
          <button onClick={onClose} className="absolute top-0 right-0 p-2"><RxCross2 className='text-2xl'/></button>
          <div className='flex flex-col gap-y-0'>
            <h2 className="text-lg font-bold text-center">{area.name}</h2>
            <div className='flex items-center w-full justify-center'>
              <ParkingMapSection nameSection={area.name}/>
            </div>
          </div>
          <h1 className='text-xl text-center max-md:text-lg'>
            Selecciona tu lugar de estacionamiento
          </h1>
          <li className='flex flex-wrap gap-x-2 gap-y-2 items-center w-full justify-center'>
            <ul className='flex flex-row gap-x-0'>
              <VehicleSVG height="25" width="25" fillColor="#0082ff"/>
              <span className='max-xs:text-sm'>Disponible</span>
            </ul>
            <ul className='flex flex-row gap-x-0'>
              <VehicleSVG height="25" width="25" fillColor="#36b139"/>
              <span className='max-xs:text-sm'>Reservado</span>
            </ul>
            <ul className='flex flex-row gap-x-0'>
              <VehicleSVG height="25" width="25" fillColor="red"/>
              <span className='max-xs:text-sm'>Ocupado</span>
            </ul>
            <ul className='flex flex-row gap-x-0'>
              <VehicleSVG height="25" width="25" fillColor="gray"/>
              <span className='max-xs:text-sm'>No disponible</span>
            </ul>
            <ul className='flex flex-row items-center gap-x-1.5'>
              <FaAsterisk className='text-xs'/>
              <span className='max-xs:text-sm'>Discapacitados</span>
            </ul>
            <ul className='flex flex-row gap-x-1.5 items-center'>
              <div className="bg-white-900 py-2.5 h-[25px] w-[25px] rounded-full">
                <div className="h-full border-dashed border-t-2 border-gray-200 w-full"></div>
              </div>
              <span className='max-xs:text-sm'>Camino</span>
            </ul>
          </li>
          <div className="flex items-center mb-2 relative">
            {getSectionCurrent(area.name, area.sectionId)}
          </div>
        </div>
      </div>
  
    );
  };
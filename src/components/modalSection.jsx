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

export const ModalSection = ({ area, onClose, handleCurrentPage, infoUser, darkToggle, vehicleActive, guard, user }) => {

    const getSectionCurrent = (section, sectionId) => {
      switch (section) {
        case 'SECCIÓN A':
          return <SectionA sectionId={sectionId} infoUser={infoUser} infoVehicleActive={vehicleActive} handleCurrentPage={handleCurrentPage} guard={guard} user={user} onCloseSection={onClose}/>;
        case 'SECCIÓN B':
          return <SectionB sectionId={sectionId} infoUser={infoUser} infoVehicleActive={vehicleActive} handleCurrentPage={handleCurrentPage} guard={guard} user={user} onCloseSection={onClose}/>;
        case 'SECCIÓN C':
          return <SectionC sectionId={sectionId} infoUser={infoUser} infoVehicleActive={vehicleActive} handleCurrentPage={handleCurrentPage} guard={guard} user={user} onCloseSection={onClose}/>;
        case 'SECCIÓN D':
          return <SectionD sectionId={sectionId} infoUser={infoUser} infoVehicleActive={vehicleActive} handleCurrentPage={handleCurrentPage} guard={guard} user={user} onCloseSection={onClose}/>;
        case 'SECCIÓN E':
          return <SectionE sectionId={sectionId} infoUser={infoUser} infoVehicleActive={vehicleActive} handleCurrentPage={handleCurrentPage} guard={guard} user={user} onCloseSection={onClose}/>;
        default:
          return null; 
      }
    };
  
    return (
      <div className="fixed z-50 flex flex-col items-center inset-0 m-auto w-[45%] max-2xl:w-fit max-md:p-4 h-[80%] overflow-y-scroll max-xs:w-[95%] bg-white-50 dark:bg-midnight-950 border-[1px] border-black rounded-lg p-4 gap-y-6">
        <div className='sticky w-full top-0 justify-end flex'>
          <button onClick={onClose} className="p-0 flex justify-end items-end"><RxCross2 className='text-2xl text-black dark:text-white-50'/></button>
        </div>
        <div className='flex flex-col gap-y-2'>
          <h2 className="text-xl font-bold text-center text-black dark:text-white-50">{area.name}</h2>
          <div className='flex items-center w-full justify-center h-full'>
            <ParkingMapSection nameSection={area.name} darkToggle={darkToggle}/>
          </div>
        </div>
        <h1 className='text-xl text-center max-md:text-lg text-black dark:text-white-50'>
          Selecciona tu lugar de estacionamiento
        </h1>
        <li className='flex flex-wrap gap-x-2 gap-y-2 items-center w-full justify-center'>
          <ul className='flex flex-row gap-x-0'>
            <VehicleSVG height="25" width="25" fillColor="#0082ff"/>
            <span className='max-xs:text-sm text-black dark:text-white-50'>Disponible</span>
          </ul>
          <ul className='flex flex-row gap-x-0'>
            <VehicleSVG height="25" width="25" fillColor="#36b139"/>
            <span className='max-xs:text-sm text-black dark:text-white-50'>Reservado</span>
          </ul>
          <ul className='flex flex-row gap-x-0'>
            <VehicleSVG height="25" width="25" fillColor="red"/>
            <span className='max-xs:text-sm text-black dark:text-white-50'>Ocupado</span>
          </ul>
          <ul className='flex flex-row gap-x-0'>
            <VehicleSVG height="25" width="25" fillColor="gray"/>
            <span className='max-xs:text-sm text-black dark:text-white-50'>No disponible</span>
          </ul>
          <ul className='flex flex-row items-center gap-x-1.5'>
            <FaAsterisk className='text-xs text-black dark:text-white-50'/>
            <span className='max-xs:text-sm text-black dark:text-white-50'>Discapacitados</span>
          </ul>
          <ul className='flex flex-row gap-x-1.5 items-center'>
            <div className="bg-white-900 py-2.5 h-[25px] w-[25px] rounded-full">
              <div className="h-full border-dashed border-t-2 border-gray-200 w-full"></div>
            </div>
            <span className='max-xs:text-sm text-black dark:text-white-50'>Camino</span>
          </ul>
        </li>
        <div className="flex items-center mb-2 relative">
          {getSectionCurrent(area.name, area.sectionId)}
        </div>
      </div>
    );
  };
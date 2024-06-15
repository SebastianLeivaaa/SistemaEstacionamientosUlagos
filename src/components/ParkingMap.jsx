import React, { useEffect, useState, useRef } from 'react';
import Mapa from "../assets/img/Map.png";
import imageMapResize from "../utils/mageMapResizer.min";
import axios from "axios";
import { SectionA } from "./sectionA";
import { SectionB } from "./sectionB";
import { ParkingMapSection } from './ParkingMapSection';
import { VehicleSVG } from './vehicleSVG';
import { FaAsterisk } from "react-icons/fa";


const Modal = ({ area, onClose }) => {

  const getSectionCurrent = (section, sectionId) => {
    switch (section) {
      case 'SECCIÓN A':
        return <SectionA sectionId={sectionId}/>;
      case 'SECCIÓN B':
        return <SectionB sectionId={sectionId}/>;
      case 'RESERVADO':
        return '#36b139';
      case 'NO DISPONIBLE':
        return 'gray';
      default:
        return 'black'; 
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-white-200 p-4 rounded shadow-lg w-fit max-md:w-[85%] flex flex-col gap-y-8 items-center">
        <div className='flex flex-col gap-y-0'>
          <h2 className="text-lg font-bold mb-2 text-center">{area.name}</h2>
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
        <div className="flex items-center mb-2">
          {getSectionCurrent(area.name, area.sectionId)}
        </div>
        <button onClick={onClose} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white-50 rounded w-fit">Cerrar</button>
      </div>
    </div>

  );
};

export const ParkingMap = () => {
  const [hoveredArea, setHoveredArea] = useState(null);
  const [scaledAreas, setScaledAreas] = useState([]);
  const [areas, setAreas] = useState([
    { name: 'SECCIÓN A', coords: '401,386,407,432,550,416,667,433,666,382,577,369,516,369', shape: 'poly', parkigsAvailables: null, capacityLimit: null},
    { name: 'SECCIÓN B', coords: '303,133,332,390,400,384,398,331,375,332,360,201,375,199,370,137,348,137', shape: 'poly', parkigsAvailables: null, capacityLimit: null},
    { name: 'SECCIÓN C', coords: '103,428,336,408,340,450,114,476', shape: 'poly', parkigsAvailables: null, capacityLimit: null},
    { name: 'SECCIÓN D', coords: '37,365,99,364,103,429,55,434,37,417', shape: 'poly', parkigsAvailables: null, capacityLimit: null},
    { name: 'SECCIÓN E', coords: '43,573,82,571,98,641,106,642,107,687,131,685,133,709,143,711,146,760,61,764', shape: 'poly', parkigsAvailables: null, capacityLimit: null},
  ]);
  const mapRef = useRef(null);
  const imgRef = useRef(null);
  const [selectedArea, setSelectedArea] = useState(null);

  const handleClick = (area) => {
    setSelectedArea(area);
  };

  const closeModal = () => {
    setSelectedArea(null);
  };

  const getParkingsAvailablesBySection = async () => {
    try {
      const response = await axios.get("http://localhost:3090/api/get-parkings-availables-by-section", { withCredentials: true });
      const data = response.data;
      console.log(data);

      // Actualizar las áreas con la cantidad de estacionamientos disponibles
      const updatedAreas = areas.map(area => {
        const matchedSection = data.find(section => section.secc_nombre === area.name);
        return matchedSection ? { ...area, parkigsAvailables: parseInt(matchedSection.cantidad_estacionamientos_disponibles, 10), sectionId: matchedSection.esta_secc_id, capacityLimit: parseInt(matchedSection.secc_capacidad, 10) } : area;
      });
      setAreas(updatedAreas);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMouseEnter = (area) => {
    setHoveredArea(area);
  };

  const handleMouseLeave = () => {
    setHoveredArea(null);
  };

  const parseCoords = (coords) => {
    return coords.split(',').map(Number);
  };

  useEffect(() => {
    getParkingsAvailablesBySection();
  }, [areas]);

  useEffect(() => {
    handleClick();
  }, []);

  useEffect(() => {
    const handleImageLoad = () => {
      updateScaledAreas();
      imageMapResize();
    };
  
    if (imgRef.current && !imgRef.current.complete) {
      imgRef.current.addEventListener('load', handleImageLoad);
    } else {
      handleImageLoad();
    }
  
    return () => {
      if (imgRef.current) {
        imgRef.current.removeEventListener('load', handleImageLoad);
      }
    };
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updateScaledAreas);
    return () => {
      window.removeEventListener('resize', updateScaledAreas);
    };
  }, []);

  useEffect(() => {
    updateScaledAreas();
  }, [imgRef.current, mapRef.current, areas]);

  const updateScaledAreas = () => {
    if (!mapRef.current || !imgRef.current) return;

    const img = imgRef.current;
    const r = {
      width: img.width / img.naturalWidth,
      height: img.height / img.naturalHeight,
    };

    const newScaledAreas = areas.map(area => {
      const coords = parseCoords(area.coords).map((coord, index) => {
        return index % 2 === 0 ? coord * r.width : coord * r.height;
      });
      return { ...area, scaledCoords: coords };
    });

    setScaledAreas(newScaledAreas);
  };

  return (
    <div className="relative w-[75%] max-sm:w-[100%]">
      <img
        ref={imgRef}
        src={Mapa}
        alt="Mapa interactivo"
        className="w-[100%] h-auto"
        useMap="#parking-map"
      />
      <map name="parking-map" ref={mapRef}>
        {areas.map((area, index) => {
          const coords = parseCoords(area.coords);
          return (
            <area
              key={index}
              shape={area.shape}
              coords={coords.join(',')}
              alt={area.name}
              onMouseEnter={() => handleMouseEnter(area.name)}
              onMouseLeave={handleMouseLeave}
              className='cursor-pointer outline-none'
              tabIndex="0"
            />
          );
        })}
      </map>
      <svg className="absolute top-0 left-0 w-full h-full" viewBox={`0 0 ${imgRef.current?.width || 0} ${imgRef.current?.height || 0}`}>
        {scaledAreas.map((area, index) => (
          <polygon
            key={index}
            points={area.scaledCoords.join(',')}
            id={area.parkigsAvailables}
            className={`${area.parkigsAvailables > area.capacityLimit * 0.25 ? 'fill-green-500' : 'fill-red-500'} hover:fill-blue-500 ${hoveredArea === area.name ? 'opacity-75' : 'opacity-50'}`}
            onClick={() => handleClick(area)}
          />
        ))}
      </svg>
      {selectedArea && <Modal area={selectedArea} onClose={closeModal} />}
    </div>
  );
};
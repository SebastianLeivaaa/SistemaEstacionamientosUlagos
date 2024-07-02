import React, { useEffect, useState, useRef } from 'react';
import Mapa from "../assets/img/Map.png";
import Mapa2 from "../assets/img/Map2.png";
import imageMapResize from "../utils/mageMapResizer.min";
import axios from "axios";
import { ModalSection } from "./modalSection";
import { MdLocalParking } from "react-icons/md";


export const ParkingMap = (props) => {
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
  const [infoPosition, setInfoPosition] = useState({ top: 0, left: 0 });

  const handleClick = (area) => {
    setSelectedArea(area);
  };

  const closeModal = () => {
    setSelectedArea(null);
  };

  const getParkingsAvailablesBySection = async () => {
    try {
      const response = await axios.get("/api/get-parkings-availables-by-section", { withCredentials: true });
      const data = response.data;

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

  useEffect(() => {
    updateScaledAreas();
  }, [props.onToggleMenu, props.handleToggleMenu]);

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

  const handleMouseMove = (event) => {
    if (!mapRef.current) return;

    const rect = mapRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Ajustar la posición del div de información basado en el área sobre la cual se está haciendo hover
    if (hoveredArea) {
      const areaIndex = areas.findIndex(area => area.name === hoveredArea.name);
      const scaledArea = scaledAreas[areaIndex];
      const infoTop = y - 20; // Ajustar según necesites
      const infoLeft = x - 20; // Ajustar según necesites
      setInfoPosition({ top: infoTop, left: infoLeft });
    }
  };

  return (
    <>
      {selectedArea && (<div className="fixed inset-0 bg-black opacity-50 z-50"></div>)}
      <div className="dark:bg-midnight-950 bg-white-50 shadow-3xl justify-start items-center contrast-[95%] rounded-md p-8 max-md:p-4 w-full h-fit flex flex-col gap-y-8 max-md:gap-y-4">
        <h1 className="dark:text-white-50 text-black font-bold text-2xl flex flex-row gap-x-2 items-center w-full justify-start"><MdLocalParking className="text-4xl text-black dark:text-white-50"/> Reservar estacionamiento</h1>
        <h2 className="dark:text-white-50 text-black font-bold text-xl flex flex-row gap-x-2 items-center">Seleccione una sección</h2>
        <div className="relative max-w-[560px] max-md:w-[75%] max-sm:w-[100%]" onMouseMove={handleMouseMove}>
          {props.darkToggle ? (
            <img
              ref={imgRef}
              src={Mapa2}
              alt="Mapa interactivo"
              className="w-[100%] h-[100%]"
              useMap="#parking-map"
            />
          ) : (
            <img
              ref={imgRef}
              src={Mapa}
              alt="Mapa interactivo"
              className="w-[100%] h-[100%]"
              useMap="#parking-map"
            />
          )}
          <map name="parking-map" ref={mapRef}>
            {areas.map((area, index) => {
              const coords = parseCoords(area.coords);
              return (
                <area
                  key={index}
                  shape={area.shape}
                  coords={coords.join(',')}
                  alt={area.name}
                  className='cursor-pointer outline-none'
                  tabIndex="0"
                  onMouseEnter={() => handleMouseEnter(area)}
                  onMouseLeave={handleMouseLeave}
                />
              );
            })}
          </map>
          <svg className="absolute top-0 left-0 w-full h-full" viewBox={`0 0 ${imgRef.current?.width || 0} ${imgRef.current?.height || 0}`}>
            {scaledAreas.map((area, index) => (
              <polygon
                key={index}
                points={area.scaledCoords.join(',')}
                onMouseEnter={() => handleMouseEnter(area)}
                onMouseLeave={handleMouseLeave}
                id={area.parkigsAvailables}
                className={`${area.parkigsAvailables === 0 
                  ? 'fill-red-600 hover:fill-red-700' 
                  : area.parkigsAvailables < area.capacityLimit * 0.25 
                    ? 'fill-yellow-500 hover:fill-yellow-600 cursor-pointer' 
                    : 'fill-green-500 hover:fill-green-600 cursor-pointer'}`}
                onClick={() => {if(area.parkigsAvailables > 0) handleClick(area)}}
              />
            ))}
          </svg>
          {hoveredArea && (
            <div className='relative top-0 left-0 w-full h-full z-20 max-xs:top-2'>
              <div 
                className={`bg-white-50 dark:bg-midnight-950 shadow-3xl dark:shadow-midnight-900 shadow-white-400 text-black dark:text-white-50 rounded-md`}
                style={{
                  position: 'absolute',
                  top: `${infoPosition.top + 25}px`,
                  left: `${infoPosition.left}px`,
                  padding: '10px',
                  zIndex: 9999,
                  pointerEvents: hoveredArea ? 'auto' : 'none',
                }}
              >
                <p className='max-sm:text-sm'>{hoveredArea && hoveredArea.name}</p>
                <p className='max-sm:text-sm'>{hoveredArea && `Parking disponibles: ${hoveredArea.parkigsAvailables}`}</p>
                <p className='max-sm:text-sm'>{hoveredArea && `Capacidad: ${hoveredArea.capacityLimit}`}</p>
              </div>
            </div>
          )}
        </div>
        <ul className="flex flex-wrap gap-y-4 max-lg:items-start max-xs:text-sm gap-x-6 w-full justify-center items-center">
          <li className="flex flex-row gap-x-1 items-center">
            <span className="bg-green-500 w-5 h-5"></span>
            <span className="text-black dark:text-white-50">Disponibles</span>
          </li>
          <li className="flex flex-row gap-x-1 items-center">
            <span className="bg-yellow-500 w-5 h-5"></span>
            <span className="text-black dark:text-white-50">Pocos disponibles</span>
          </li>
          <li className="flex flex-row gap-x-1 items-center">
            <span className="bg-red-600 w-5 h-5"></span>
            <span className="text-black dark:text-white-50">Agotados</span>
          </li>
        </ul>
      </div>
      {selectedArea && <ModalSection area={selectedArea} onClose={closeModal} handleCurrentPage={props.handleCurrentPage} infoUser={props.infoUser} vehicleActive={props.vehicleActive} infoVehicleActive={props.infoVehicleActive} darkToggle={props.darkToggle} />}
    </>
  );
};

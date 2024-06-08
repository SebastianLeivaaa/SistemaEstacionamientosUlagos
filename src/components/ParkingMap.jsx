import React, { useEffect, useState, useRef } from 'react';
import Mapa from "../assets/img/Map.png";
import imageMapResize from "../utils/mageMapResizer.min";

const Modal = ({ area, onClose }) => {
  return (
    <div className=" fixed inset-0 flex items-center justify-center">
      <div className=" bg-white-200 p-4 rounded shadow-lg">
        <h2 className="text-lg font-bold mb-2">{area.name}</h2>
        <p>Información sobre {area.name}</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Cerrar</button>
      </div>
    </div>
  );
};

export const ParkingMap = () => {
  const [hoveredArea, setHoveredArea] = useState(null);
  const [scaledAreas, setScaledAreas] = useState([{ name: 'Zona A', scaledCoords: [401,386,407,432,550,416,667,433,666,382,577,369,516,369], shape: 'poly' },
  { name: 'Zona B', scaledCoords: [303,133,332,390,400,384,398,331,375,332,360,201,375,199,370,137,348,137], shape: 'poly' },
  { name: 'Zona C', scaledCoords: [103,428,336,408,340,450,114,476], shape: 'poly' },
  { name: 'Zona D', scaledCoords: [37,365,99,364,103,429,55,434,37,417], shape: 'poly' },
  { name: 'Zona E', scaledCoords: [43,573,82,571,98,641,106,642,107,687,131,685,133,709,143,711,146,760,61,764], shape: 'poly' }]);
  const [selectedArea, setSelectedArea] = useState(null);
  const mapRef = useRef(null);
  const imgRef = useRef(null);

  const areas = [
    { name: 'Zona A', coords: '401,386,407,432,550,416,667,433,666,382,577,369,516,369', shape: 'poly' },
    { name: 'Zona B', coords: '303,133,332,390,400,384,398,331,375,332,360,201,375,199,370,137,348,137', shape: 'poly' },
    { name: 'Zona C', coords: '103,428,336,408,340,450,114,476', shape: 'poly' },
    { name: 'Zona D', coords: '37,365,99,364,103,429,55,434,37,417', shape: 'poly' },
    { name: 'Zona E', coords: '43,573,82,571,98,641,106,642,107,687,131,685,133,709,143,711,146,760,61,764', shape: 'poly' },
  ];

  const handleMouseEnter = (area) => {
    setHoveredArea(area);
  };

  const handleMouseLeave = () => {
    setHoveredArea(null);
  };

  const handleClick = (area) => {
    setSelectedArea(area);
  };

  const closeModal = () => {
    setSelectedArea(null);
  };

  const parseCoords = (coords) => {
    return coords.split(',').map(Number);
  };

  useEffect(() => {
    console.log(scaledAreas)
    imageMapResize();
    updateScaledAreas();
  }, []);
  
  useEffect(() => {
    window.addEventListener('resize', updateScaledAreas);
    return () => {
      window.removeEventListener('resize', updateScaledAreas);
    };
  }, []);
  
  useEffect(() => {
    updateScaledAreas();
  }, [imgRef.current, mapRef.current]);

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
    <div className="relative">
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
              className='outline-none cursor-pointer'
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
            className={`fill-white-50 hover:fill-blue-500 ${hoveredArea === area.name ? 'opacity-75' : 'opacity-50'}`}
            onMouseEnter={() => handleMouseEnter(area.name)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(area)}
          />
        ))}
      </svg>
      {selectedArea && <Modal area={selectedArea} onClose={closeModal} />}
    </div>
  );
};

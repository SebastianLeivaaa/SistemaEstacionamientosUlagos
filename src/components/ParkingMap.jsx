import React, { useEffect, useState, useRef } from 'react';
import Mapa from "../assets/img/Map.png";
import imageMapResize from "../utils/mageMapResizer.min";

export const ParkingMap = () => {
  const [hoveredArea, setHoveredArea] = useState(null);
  const [scaledAreas, setScaledAreas] = useState([]);
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

  const parseCoords = (coords) => {
    return coords.split(',').map(Number);
  };

  useEffect(() => {
    imageMapResize();
    updateScaledAreas();

    window.addEventListener('resize', updateScaledAreas);
    return () => {
      window.removeEventListener('resize', updateScaledAreas);
    };
  }, []);

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
            className={`fill-white-50 hover:fill-blue-500 ${hoveredArea === area.name ? 'opacity-75' : 'opacity-50'}`}
          />
        ))}
      </svg>
    </div>
  );
};

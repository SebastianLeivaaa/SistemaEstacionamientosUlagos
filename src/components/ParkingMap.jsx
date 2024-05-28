import React, { useState } from 'react';
import Mapa from "../assets/img/Map.png";

export const ParkingMap = () => {
  const [hoveredArea, setHoveredArea] = useState(null);

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

  return (
    <div className="relative">
      <img src={Mapa} alt="Mapa interactivo" className="w-[100%] h-auto" />

      {areas.map((area, index) => {
        const coords = parseCoords(area.coords);
        const polygonPoints = coords.reduce((acc, point, index) => {
          if (index % 2 === 0) {
            return acc + `${point},`;
          } else {
            return acc + `${point} `;
          }
        }, "").trim();

        return (
          <svg
            key={index}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          >
            <polygon
              points={polygonPoints}
              fill={hoveredArea === area.name ? 'rgba(255,0,0,0.5)' : 'transparent'}
              onMouseEnter={() => handleMouseEnter(area.name)}
              onMouseLeave={handleMouseLeave}
              className="pointer-events-auto cursor-pointer focus:outline-none"
              tabIndex="0" // Para que el elemento pueda recibir el foco y aplicar el outline
            />
          </svg>
        );
      })}
    </div>
  );
};

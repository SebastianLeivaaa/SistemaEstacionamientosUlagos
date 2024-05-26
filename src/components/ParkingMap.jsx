import React from 'react';

const parkingSpots =[
  { id: 1, top: '50%', left: '50%'},
  { id: 2, top: '70px', left: '10%'},
  { id: 3, top: '2px', left: '300px'}
]
export const ParkingMap = (props) =>{

  return (
    <div className="relative w-full h-auto">

      {parkingSpots.map(spot => (
        <button
          key={spot.id}
          className="relative bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center transform transition-transform hover:scale-125"
          style={{ top: spot.top, left: spot.left }}
        >
          {spot.id}
        </button>
      ))}
    </div>
  );

}
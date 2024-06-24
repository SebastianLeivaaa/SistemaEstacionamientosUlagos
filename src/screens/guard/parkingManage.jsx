import React from "react";
import { ReleaseParking } from "./components/releaseParking";
import { Capacity } from "./components/capacity";
import { ParkingMapGuard } from "../../components/parkingMapGuard";
// import { Statistics } from "./components/stat";

export const ParkingManage = ({ user, darkToggle }) => {;

  return (
    <div className="relative w-full flex flex-col pt-60 max-sm:pt-24 max-md:pt-24 px-4 2xl:px-60 items-center justify-center max-md:px-2 gap-y-4 overflow-y-scroll">
      <div className="w-full h-full grid grid-cols-2 max-md:grid-cols-1 gap-x-4 gap-y-4 max-md:pt-24">
        <ReleaseParking user={user} />
        <Capacity />
      </div>
      <ParkingMapGuard guard="guard" darkToggle={darkToggle} user={user}/>   
    </div>
  );
};

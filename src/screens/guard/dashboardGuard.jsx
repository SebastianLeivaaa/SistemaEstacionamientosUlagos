import React from "react";
import { ParkingAvailability } from "./components/parkingAvailability";
import { QuickAccess } from "./components/quickAccess";
import { Advice } from "./components/advice";
import { Statistics } from "./components/statistics";

export const DashboardGuard = ({ user, handleCurrentPage }) => {;

  return (
    <div className="w-full h-full flex flex-col px-4 2xl:px-60 pt-8 m-auto items-center max-md:px-2 gap-y-4 overflow-y-scroll">
      
      <ParkingAvailability user={user} />
      <QuickAccess handleCurrentPage={handleCurrentPage} />
      <Advice />
      <Statistics />
    </div>
  );
};

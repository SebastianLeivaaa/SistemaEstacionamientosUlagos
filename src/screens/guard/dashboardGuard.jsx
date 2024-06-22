import React from "react";
import { CurrentReservation } from "./components/currentReservation";
import { QuickAccess } from "./components/quickAccess";
import { Advice } from "./components/advice";
import { Statistics } from "./components/stat";

export const DashboardGuard = ({ user, handleCurrentPage }) => {;

  return (
    <div className="w-full h-full flex flex-col px-4 xl:px-60 m-auto items-center grow max-md:px-2 gap-y-4 overflow-y-scroll">
      
      <CurrentReservation user={user} />
      <QuickAccess handleCurrentPage={handleCurrentPage} />
      <Advice />
      <Statistics />
    </div>
  );
};

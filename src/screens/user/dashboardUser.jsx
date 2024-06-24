import React from "react";
import { CurrentReservation } from "./components/currentReservation";
import { QuickAccess } from "./components/quickAccess";
import { AlertParkingAvailables } from "./components/alertParkingAvailables";
import { UserStatistics } from "./components/userStatistics";

export const DashboardUser = ({ user, handleCurrentPage }) => {;

  return (
    <div className="w-full h-full flex flex-col px-4 2xl:px-60 pt-8 m-auto items-center max-md:px-2 gap-y-4 overflow-y-scroll">
      <CurrentReservation user={user} />
      <QuickAccess handleCurrentPage={handleCurrentPage} />
      <AlertParkingAvailables />
      <UserStatistics user={user} />
    </div>
  );
};

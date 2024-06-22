import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SideBar } from "./sideBar";
import { TopBar } from "./topBar";
import axios from "axios";
import { DashboardGuard } from "./dashboardGuard";
import { ParkingManage } from "./parkingManage";
import { History } from "./history";
import { ConfirmmReservation } from "./confirmmReservation";

export const BaseLayout2 = () => {
  const [onToggleMenu, setOnToggleMenu] = useState(window.innerWidth >= 1024);
  const [currentPage, setCurrentPage] = useState('/dashboard-guard');
  const [user, setUser] = useState({
    email: "",
    userName: "",
    userRut: "",
    userLastNamePat: "",
    userLastNameMat: "",
  });
  const [darkToggle, setDarkToggle] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  const navigate = useNavigate();

  const handleToggleMenu = () => {
    setOnToggleMenu(!onToggleMenu);
  };

  const handleDarkToggle = () => {
    setDarkToggle(!darkToggle);
  };

  const handleCurrentPage = (page) => {
    setCurrentPage(page);
  }

  const getProfile = async () => {
    try {
      const response = await axios.get("http://localhost:3090/api/login", {
        withCredentials: true,
      });
      setUser({
        email: response.data.email,
        userName: response.data.userName,
        userRut: response.data.userRut,
        userLastNamePat: response.data.userLastNamePat,
        userLastNameMat: response.data.userLastNameMat,
      });
    } catch (error) {
      navigate("/");
    }
  };

  const getCurrentPage = (currentPage) => {
    switch(currentPage){
        case '/dashboard-guard':
            return <DashboardGuard user={user} handleCurrentPage={handleCurrentPage}/>;
        case '/parking-manage':
            return <ParkingManage user={user}/>;
        case '/reservations-history':
            return <History user={user}/>;
            case '/confirm-reservation':
            return <ConfirmmReservation user={user}/>;
        default:
            return 'Dashboard';
    };
  };

  useEffect(() => {
    getProfile();
    const interval = setInterval(() => {
        getProfile();
    }, 10000);

    return () => clearInterval(interval);
}, []);

  useEffect(() => {
    if (darkToggle) {
        document.documentElement.classList.add("dark");
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem('theme', 'light');
    }
  }, [darkToggle]);

  return (
    <>
      <SideBar
        onToggleMenu={onToggleMenu}
        handleToggleMenu={handleToggleMenu}
        userName={user.userName}
        userLastNamePat={user.userLastNamePat}
        userLastNameMat={user.userLastNameMat}
        userEmail={user.email}
        handleCurrentPage={handleCurrentPage}
        currentPage={currentPage}
      />
      <div
        className={`w-[100%] h-screen transition-all duration-300 ease-in-out max-lg:pl-0 gap-y-6 max-md:gap-y-4 flex flex-col bg-white-50  dark:bg-midnight-950 ${
          onToggleMenu ? "pl-[256px]" : "pl-[0%]"
        }`}
      >
        <TopBar handleToggleMenu={handleToggleMenu} handleDarkToggle={handleDarkToggle} darkToggle={darkToggle}/>
        {getCurrentPage(currentPage)}
      </div>
    </>
  );
};


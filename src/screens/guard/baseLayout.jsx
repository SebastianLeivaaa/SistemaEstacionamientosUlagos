import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SideBar } from "./sideBar";
import { TopBar } from "./topBar";
import axios from "axios";
import { DashboardGuard } from "./dashboardGuard";
import { ParkingManage } from "./parkingManage";
import { History } from "./history";
import { ConfirmmReservation } from "./confirmmReservation";
import { TiWarning } from "react-icons/ti";
import { FaCheck } from "react-icons/fa";
import { FaX } from "react-icons/fa6";


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

  const [expirationTime, setExpirationTime] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1);
    return now;
  });

  const [darkToggle, setDarkToggle] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });
  const [showModal, setShowModal] = useState(false);

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
      const response = await axios.get("/api/login", {
        withCredentials: true,
      });
      if (!response.data.IsGuard) {
        navigate("/");
      } else{
        setUser({
          email: response.data.email,
          userName: response.data.userName,
          userRut: response.data.userRut,
          userLastNamePat: response.data.userLastNamePat,
          userLastNameMat: response.data.userLastNameMat,
        });
        setExpirationTime(response.data.expires);
      }
    } catch (error) {
      navigate('/');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post(
            '/api/refresh-sesion',
            { email: user.email },
            { withCredentials: true }
        );
        setShowModal(false)
        setExpirationTime(res.data)
        
    } catch (error) {
        
    } finally {
        
    }
  };

  const getCurrentPage = (currentPage) => {
    switch(currentPage){
        case '/dashboard-guard':
            return <DashboardGuard user={user} handleCurrentPage={handleCurrentPage}/>;
        case '/parking-manage':
            return <ParkingManage user={user} darkToggle={darkToggle}/>;
        case '/reservations-history':
            return <History/>;
            case '/confirm-reservation':
            return <ConfirmmReservation user={user}/>;
        default:
            return 'Dashboard';
    };
  };

  useEffect(() => {

    if(showModal){
      return ;
    }

    getProfile();
    const interval = setInterval(() => {
        getProfile();
    }, 10000);

    return () => clearInterval(interval);
}, [showModal]);

  useEffect(() => {
    if (darkToggle) {
        document.documentElement.classList.add("dark");
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem('theme', 'light');
    }
  }, [darkToggle]);

  useEffect(() => {
    const interval = setInterval(() => {

      const currentTime = new Date();
      let newDateFromISO = new Date(expirationTime);
  
      if (newDateFromISO <= currentTime) {
        setShowModal(true);
      }
      
    }, 1000);
  
    return () => clearInterval(interval);
  }, [expirationTime]);

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
        className={`w-[100%] h-screen transition-all duration-300 ease-in-out gap-y-0 max-md:gap-y-0 flex flex-col bg-white-50  dark:bg-midnight-950 ${
          onToggleMenu ? "2xl:pl-[256px]" : "pl-[0%]"
        }`}
      >
        {(showModal)  && (<div className="fixed inset-0 bg-black opacity-50 z-30"></div>)}
        <TopBar handleToggleMenu={handleToggleMenu} handleDarkToggle={handleDarkToggle} darkToggle={darkToggle}/>
        {getCurrentPage(currentPage)}
        {(showModal) && (
          <div className="fixed z-50 flex flex-col items-center inset-0 m-auto w-fit max-2xl:w-fit max-md:p-4 h-fit max-xs:max-w-[95%] bg-white-50 dark:bg-midnight-950 border-[1px] border-black rounded-lg p-4 gap-y-6">
            <p className='text-yellow-500 justify-center text-lg flex flex-row items-center gap-x-2'><TiWarning className='text-9xl'/></p>
            <h1 className='text-center text-xl text-black dark:text-white-50 max-md:text-lg'>
                Se ha expirado su sesión.
                ¿Desea extender la sesión?
            </h1>
            <div className='flex flex-row justify-center items-center gap-x-4 mt-4 max-xs:mt-2'>
                <button onClick={handleSubmit} className='bg-green-700 text-white-50 font-bold p-1.5 px-3 rounded-lg items-center flex flex-row gap-x-1'><FaCheck/> Si</button>
                <button onClick={() => {navigate("/")}}  className='bg-red-500 text-white-50 font-bold p-1.5 px-3 rounded-lg items-center flex flex-row gap-x-1'><FaX/> No</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};


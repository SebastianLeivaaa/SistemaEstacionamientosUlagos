import React, {useState, useEffect} from "react";
import { VehicleSVG } from "./vehicleSVG";
import axios from "axios";


export const SectionA = (props) => {

    const [dataSection, setDataSection] = useState(null);

    const getDataSection = async (sectionId) => {
        try {
          const response = await axios.post("/api/get-data-section", { sectionId }, { withCredentials: true });
          const data = response.data;
          setDataSection(data);
            } catch (error) {
          console.log(error);
        }
      };

    useEffect(() => {
        getDataSection(props.sectionId);
    }, []);

    return(
        <div className="flex flex-col w-full">
            <ul className="flex flex-row">
                <li className="flex flex-col gap-y-2">
                    <span className="text-center">1</span>
                    <div className="flex flex-row">
                        <VehicleSVG height="50" width="50" fillColor="blue"/>
                        <div className='w-[1px] h-full bg-black'></div>
                    </div>
                </li>
                <li className="flex flex-col gap-y-2">
                    <span className="text-center">2</span>
                    <div className="flex flex-row">
                        <VehicleSVG height="50" width="50" fillColor="blue"/>
                        <div className='w-[1px] h-full bg-black'></div>
                    </div>
                </li>
                <li className="flex flex-col gap-y-2">
                    <span className="text-center">3</span>
                    <div className="flex flex-row">
                        <VehicleSVG height="50" width="50" fillColor="blue"/>
                        <div className='w-[1px] h-full bg-black'></div>
                    </div>
                </li>
                <li className="flex flex-col gap-y-2">
                    <span className="text-center">4</span>
                    <div className="flex flex-row">
                        <VehicleSVG height="50" width="50" fillColor="blue"/>
                        <div className='w-[1px] h-full bg-black'></div>
                    </div>
                </li>
                <li className="flex flex-col gap-y-2">
                    <span className="text-center">5</span>
                    <div className="flex flex-row">
                        <VehicleSVG height="50" width="50" fillColor="blue"/>
                        <div className='w-[1px] h-full bg-black'></div>
                    </div>
                </li>
                <li className="flex flex-col gap-y-2">
                    <span className="text-center">6</span>
                    <div className="flex flex-row">
                        <VehicleSVG height="50" width="50" fillColor="blue"/>
                        <div className='w-[1px] h-full bg-black'></div>
                    </div>
                </li>
                <li className="flex flex-col gap-y-2">
                    <span className="text-center">7</span>
                    <div className="flex flex-row">
                        <VehicleSVG height="50" width="50" fillColor="blue"/>
                        <div className='w-[1px] h-full bg-black'></div>
                    </div>
                </li>
                <li className="flex flex-col gap-y-2">
                    <span className="text-center">8</span>
                    <div className="flex flex-row">
                        <VehicleSVG height="50" width="50" fillColor="blue"/>
                        <div className='w-[1px] h-full bg-black'></div>
                    </div>
                </li>
                <li className="flex flex-col gap-y-2">
                    <span className="text-center">9</span>
                    <div className="flex flex-row">
                        <VehicleSVG height="50" width="50" fillColor="blue"/>
                        <div className='w-[1px] h-full bg-black'></div>
                    </div>
                </li>
                <li className="flex flex-col gap-y-2">
                    <span className="text-center">10</span>
                    <div className="flex flex-row">
                        <VehicleSVG height="50" width="50" fillColor="blue"/>
                        <div className='w-[1px] h-full bg-black'></div>
                    </div>
                </li>
                <li className="flex flex-col gap-y-2">
                    <span className="text-center">11</span>
                    <div className="flex flex-row">
                        <VehicleSVG height="50" width="50" fillColor="blue"/>
                        <div className='w-[1px] h-full bg-black'></div>
                    </div>
                </li>
                <li className="flex flex-col gap-y-2">
                    <span className="text-center">12</span>
                    <div className="flex flex-row">
                        <VehicleSVG height="50" width="50" fillColor="blue"/>
                        <div className='w-[1px] h-full bg-black'></div>
                    </div>
                </li>
                <li className="flex flex-col gap-y-2">
                    <span className="text-center">13</span>
                    <div className="flex flex-row">
                        <VehicleSVG height="50" width="50" fillColor="blue"/>
                        <div className='w-[1px] h-full bg-black'></div>
                    </div>
                </li>
                <li className="flex flex-col gap-y-2">
                    <span className="text-center">14</span>
                    <div className="flex flex-row">
                        <VehicleSVG height="50" width="50" fillColor="blue"/>
                        <div className='w-[1px] h-full bg-black'></div>
                    </div>
                </li>
                <li className="flex flex-col gap-y-2">
                    <span className="text-center">15</span>
                    <div className="flex flex-row">
                        <VehicleSVG height="50" width="50" fillColor="blue"/>
                        <div className='w-[1px] h-full bg-black'></div>
                    </div>
                </li>
                <li className="flex flex-col gap-y-2">
                    <span className="text-center">16</span>
                    <div className="flex flex-row">
                        <VehicleSVG height="50" width="50" fillColor="blue"/>
                        <div className='w-[1px] h-full bg-black'></div>
                    </div>
                </li>
                <li className="flex flex-col gap-y-2">
                    <span className="text-center">17</span>
                    <div className="flex flex-row">
                        <VehicleSVG height="50" width="50" fillColor="blue"/>
                        <div className='w-[1px] h-full bg-black'></div>
                    </div>
                </li>
                <li className="flex flex-col gap-y-2">
                    <span className="text-center">18</span>
                    <div className="flex flex-row">
                        <VehicleSVG height="50" width="50" fillColor="blue"/>
                        <div className='w-[1px] h-full bg-black'></div>
                    </div>
                </li>
                <li className="flex flex-col gap-y-2">
                    <span className="text-center">19</span>
                    <div className="flex flex-row">
                        <VehicleSVG height="50" width="50" fillColor="blue"/>
                        <div className='w-[1px] h-full bg-black'></div>
                    </div>
                </li>
                <li className="flex flex-col gap-y-2">
                    <span className="text-center">20</span>
                    <div className="flex flex-row">
                        <VehicleSVG height="50" width="50" fillColor="blue"/>
                        <div className='w-[1px] h-full bg-black'></div>
                    </div>
                </li>
                <li className="flex flex-col gap-y-2">
                    <span className="text-center">21</span>
                    <div className="flex flex-row">
                        <VehicleSVG height="50" width="50" fillColor="blue"/>
                        <div className='w-[1px] h-full bg-black'></div>
                    </div>
                </li>
                <li className="flex flex-col gap-y-2">
                    <span className="text-center">22</span>
                    <div className="flex flex-row">
                        <VehicleSVG height="50" width="50" fillColor="blue"/>
                        <div className='w-[1px] h-full bg-black'></div>
                    </div>
                </li>
                <li className="flex flex-col gap-y-2">
                    <span className="text-center">23</span>
                    <div className="flex flex-row">
                        <VehicleSVG height="50" width="50" fillColor="blue"/>
                        <div className='w-[1px] h-full bg-black'></div>
                    </div>
                </li>
                <li className="flex flex-col gap-y-2">
                    <span className="text-center">24</span>
                    <div className="flex flex-row">
                        <VehicleSVG height="50" width="50" fillColor="blue"/>
                        <div className='w-[1px] h-full bg-black'></div>
                    </div>
                </li>
                <li className="flex flex-col gap-y-2">
                    <span className="text-center">25</span>
                    <div className="flex flex-row">
                        <VehicleSVG height="50" width="50" fillColor="blue"/>
                        <div className='w-[1px] h-full bg-black'></div>
                    </div>
                </li>
                <li className="flex flex-col gap-y-2">
                    <span className="text-center">26</span>
                    <div className="flex flex-row">
                        <VehicleSVG height="50" width="50" fillColor="blue"/>
                        <div className='w-[1px] h-full bg-black'></div>
                    </div>
                </li>
                <li className="flex flex-col gap-y-2">
                    <span className="text-center">27</span>
                    <div className="flex flex-row">
                        <VehicleSVG height="50" width="50" fillColor="blue"/>
                    </div>
                </li>
            </ul>
        </div>

    );
};
import React from 'react';
import axios from "axios";
import { MdFolderOpen } from "react-icons/md";


export const Advice = () => {

    return(
        <div className="dark:bg-midnight-950 bg-white-50 shadow-3xl  contrast-[95%] rounded-md p-8 max-md:p-4 w-full flex flex-col gap-y-8 max-md:gap-y-4">
            <h1 className="dark:text-white-50 text-black font-bold text-2xl flex flex-row gap-x-2 items-center"><MdFolderOpen className="text-3xl text-black dark:text-white-50"/> Recomendaciones</h1>
            <div className="h-full w-full bg-customGreen flex flex-col justify-center px-4 py-4 rounded-lg font-semibold max-xs:gap-y-4">
                <h1 className="max-xs:text-xs">• Todo conductor debe mostrar su cédula de identidad o licencia de conducir para validar su nombre y RUT.</h1>
                <h1 className="max-xs:text-xs">• En caso de tener algún imprevisto con la patente, puede validarse con algún documento.</h1>
                <h1 className="max-xs:text-xs">• Para liberar estacionamiento, se debe ingresar la patente del vehículo que va a retirarse.</h1>
            </div>
        </div>
    );
}
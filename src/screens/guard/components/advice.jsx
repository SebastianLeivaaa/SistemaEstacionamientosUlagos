import React from 'react';
import { MdFolderOpen } from "react-icons/md";


export const Advice = () => {

    return(
        <div className="dark:bg-midnight-950 bg-white-50 shadow-3xl  contrast-[95%] rounded-md p-8 max-md:p-4 w-full flex flex-col gap-y-8 max-md:gap-y-4">
            <h1 className="dark:text-white-50 text-black font-bold text-2xl flex flex-row gap-x-2 items-center"><MdFolderOpen className="text-3xl text-black dark:text-white-50"/> Recomendaciones</h1>
            <ul className="flex flex-col justify-start w-full">
                <li className="text-black dark:text-white-50 text-lg font-semibold max-md:text-base max-xs:text-sm">
                    • Todo conductor debe mostrar su código QR o entregar su RUT para validar la reserva.
                </li>
                <li className="text-black dark:text-white-50 text-lg font-semibold max-md:text-base max-xs:text-sm">
                    • En caso de tener algún imprevisto con la patente, puede validarse con algún documento.
                </li>
                <li className="text-black dark:text-white-50 text-lg font-semibold max-md:text-base max-xs:text-sm">
                    • Para liberar estacionamiento, se debe ingresar la patente del vehículo que va a retirarse.
                </li>
            </ul>
        </div>
    );
}
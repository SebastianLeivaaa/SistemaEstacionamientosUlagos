import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { Indice } from "../components/indice";


export const SignInFinal = ( {handleLoginClick} ) => {
    return(
        
            <div className="flex flex-col px-4 overflow-y-auto gap-x-6 gap-y-8 max-xs:p-2">
                <div className="w-full col-span-2">
                    <Indice
                        fase="4"
                    />
                    <section className="mt-16 w-[100%] flex flex-col gap-y-8 px-24 max-xs:px-0 max-md:px-8">
                        <div className="flex flex-col gap-y-8 items-center w-full">
                            <FaCheckCircle className="text-[200px] text-blue-500"/>
                            <h1 className="text-2xl font-bold text-black dark:text-white-50 text-center max-xs:text-lg">¡TE HAS REGISTRADO EXITOSAMENTE!</h1>
                            <button onClick={handleLoginClick} className="text-white-50 mt-4 rounded-md bg-blue-600 hover:bg-blue-700 p-1.5 px-6 flex flex-row items-center gap-x-1 w-auto font-bold"><IoHome className="text-xl"/> VOLVER AL LOGIN</button>
                        </div>
                    </section>
                </div>
            </div>
    );
}
import React from "react"; 

export const Indice = () => {

    return (
        <div class="w-full h-20 bg-blue-ribbon-600 flex items-center">
            <div class="w-full flex flex-row items-center p-6 justify-center">
                <div class="flex items-center">
                    <div class="md:pl-4">
                        <div class="w-6 h-6 text-white-50 bg-indice-50 rounded-full flex items-center justify-center"> <h1 class="font-semibold">1</h1></div>
                    </div>
                    <h1 class="text-white-50 whitespace-nowrap font-semibold px-1.5"> Completar datos</h1>
                </div>
                <div class="hidden md:flex items-center">
                    <hr class="text-white-50 w-4 md:w-16" />
                    <div class="pl-4">
                        <div class="w-6 h-6 text-white-50 bg-indice-100 rounded-full flex items-center justify-center"> <h1 class="font-semibold">2</h1></div>
                    </div>
                    <h1 class="text-white-50 whitespace-nowrap px-1.5">Crear clave</h1>
                    <hr class="text-white-50 w-4 md:w-16" />
                    <div class="pl-4">
                        <div class="w-6 h-6 text-white-50 bg-indice-100 rounded-full flex items-center justify-center"> <h1 class="font-semibold">3</h1></div>
                    </div>
                    <h1 class="text-white-50 whitespace-nowrap px-1.5">Confirmar cuenta</h1>
                </div>
            </div>
        </div>
    );
};
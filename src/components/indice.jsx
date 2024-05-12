import { useState } from 'react';

export const Indice = () => {

    return (
        <div class="w-full h-20 bg-blue-ribbon-600 flex items-center">
            <div class="w-full flex flex-row items-center justify-center">
                <div class="flex items-center">
                    <div class="md:pl-4">
                        <div class="w-6 h-6 text-white bg-indice-50 rounded-full flex items-center justify-center"> <h1 class="font-semibold">1</h1></div>
                    </div>
                    <h1 class="text-white whitespace-nowrap font-semibold px-4"> Completar datos</h1>
                </div>
                <div class="hidden md:flex items-center">
                    <hr class="text-white w-4 md:w-16" />
                    <div class="px-4">
                        <div class="w-6 h-6 text-white bg-indice-100 rounded-full flex items-center justify-center"> <h1 class="font-semibold">2</h1></div>
                    </div>
                    <div class="px-4">
                        <h1 class="text-white whitespace-nowrap">Crear clave</h1>
                    </div>
                    <hr class="text-white w-4 md:w-16" />
                    <div class="px-4">
                        <div class="w-6 h-6 text-white bg-indice-100 rounded-full flex items-center justify-center"> <h1 class="font-semibold">3</h1></div>
                    </div>
                    <h1 class="text-white whitespace-nowrap pr-4">Confirmar cuenta</h1>
                </div>
            </div>
        </div>
    );
};
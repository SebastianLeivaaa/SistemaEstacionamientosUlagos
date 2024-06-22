import React from "react";

export const Avatar = ( {name, lastName} ) => {

    const initialName = name.charAt(0).toUpperCase();
    const initialLastName = lastName.charAt(0).toUpperCase();
    const initials = initialName + initialLastName;

    return(
        <div className="w-12 h-12 rounded-full bg-midnight-700 dark:bg-midnight-500 flex items-center justify-center">
            <h1 className="text-black-rock-200 font-bold text-white-50 dark:text-black text-2xl">{initials}</h1>
        </div>
    );
};
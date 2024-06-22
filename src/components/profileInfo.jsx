import React from "react";
import { Avatar } from "./avatar";

export const ProfileInfo = ({name, lastNamePat, lastNameMat, email}) => {

    const fullName = `${name} ${lastNamePat} ${lastNameMat}`
    ;
    

    return(
        <div className="w-full flex flex-col gap-y-2 justify-center items-center">
            <Avatar name={name} lastName={lastNamePat} />
            <div className="w-full flex flex-col text-xs dark:text-white-50 text-black justify-center items-center gap-y-0.5">
                <p className="break-all text-center">{fullName}</p>
                <p className="break-all text-center">{email}</p>
            </div>
        </div>
    );
};
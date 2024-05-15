import React from 'react';
import { Routes, Route } from "react-router-dom";
import { Main } from './screens/main'
import { Menu } from './screens/guard/menu'
import { SignInTwo } from './screens/signInTwo';
import { SignInThree } from './screens/signInThree';
import { Usermenu } from './screens/user/usermenu';

import { SignInFinal } from './screens/signInFinal';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Main/>}/>
        <Route path="/sign-in-two" element={<SignInTwo/>}/>
        <Route path="/sign-in-three" element={<SignInThree/>}/>
        <Route path="/user" element={<Usermenu/>}/>
        <Route path="/sign-in-final" element={<SignInFinal/>}/>
      </Routes>
    </>
  )
}

export default App

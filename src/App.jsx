import React from 'react';
import { Routes, Route } from "react-router-dom";
import { Main } from './screens/main'
import { Menu } from './screens/guard/menu'
import { SignInTwo } from './screens/signInTwo';
import { SignInThree } from './screens/signInThree';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Main/>}/>
        <Route path="/sign-in-two" element={<SignInTwo/>}/>
        <Route path="/sign-in-three" element={<SignInThree/>}/>
      </Routes>
    </>
  )
}

export default App

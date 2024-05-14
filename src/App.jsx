import React from 'react';
import { Routes, Route } from "react-router-dom";
import { Main } from './screens/main'
import { Menu } from './screens/guard/menu'
import { SignInTwo } from './screens/signInTwo';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Main/>}/>
        <Route path="/sign-in-two" element={<SignInTwo/>}/>
      </Routes>
    </>
  )
}

export default App

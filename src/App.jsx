
import { Routes, Route } from "react-router-dom";
import { Main } from './screens/main'
import { BaseLayout } from "./screens/user/baseLayout";
import { BaseLayout2 } from "./screens/guard/baseLayout";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Main/>}/>
        <Route path="/base-layout" element={<BaseLayout/>}/>
        <Route path="/base-layout2" element={<BaseLayout2/>}/>
      </Routes>
    </>
  )
}

export default App

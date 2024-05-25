
import { Routes, Route } from "react-router-dom";
import { Main } from './screens/main'
import { Guardmenu } from './screens/guard/guardmenu'
import { SignInTwo } from './screens/signInTwo';
import { SignInThree } from './screens/signInThree';
import { Usermenu } from './screens/user/usermenu';
import { SignInFinal } from './screens/signInFinal';
import { Recover } from "./screens/recover";
import { RecoverTwo } from "./screens/recoverTwo";
import { RecoverThree } from "./screens/recoverThree";
import { RecoverFinal } from "./screens/recoverFinal";
import { ManageVehicle } from "./screens/user/manageVehicle";
import { Reservations } from "./screens/user/reservations";
import { ReservationHistory } from "./screens/guard/reservationHistory";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Main/>}/>
        <Route path="/recover" element={<Recover/>}/>
        <Route path="/recover-two" element={<RecoverTwo/>}/>
        <Route path="/recover-three" element={<RecoverThree/>}/>
        <Route path="/recover-final" element={<RecoverFinal/>}/>
        <Route path="/sign-in-two" element={<SignInTwo/>}/>
        <Route path="/sign-in-three" element={<SignInThree/>}/>
        <Route path="/sign-in-final" element={<SignInFinal/>}/>
        <Route path="/user" element={<Usermenu/>}/>
        <Route path="/guard" element={<Guardmenu/>}/>
        <Route path="/manage-vehicle" element={<ManageVehicle/>}/>
        <Route path="/reservations" element={<Reservations/>}/>
        <Route path="/reservation-history" element={<ReservationHistory/>}/>
      </Routes>
    </>
  )
}

export default App

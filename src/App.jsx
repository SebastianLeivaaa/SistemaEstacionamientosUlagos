
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
import { RecordReservationByPatente } from "./screens/guard/recordReservationByPatente";
import { RecordReservationByRut } from "./screens/guard/recordReservationByRut";
import { RecordReservationByDate } from "./screens/guard/recordReservationByDate";
import { MainGuard } from "./screens/guard/mainGuard";
import { Release } from "./screens/guard/release"
import { ConfirmReservation } from "./screens/guard/confirmReservation";
import { Reserve } from "./screens/user/reserve"
import { ConfirmReservationFinal } from "./components/confirmReservationFinal";

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
        <Route path="/guardmanage" element={<MainGuard/>}/>
        <Route path="/release" element={<Release/>}/>
        <Route path="/manage-vehicle" element={<ManageVehicle/>}/>
        <Route path="/reservations" element={<Reservations/>}/>
        <Route path="/reservation-history" element={<ReservationHistory/>}/>
        <Route path="/record-reservation-by-patente" element={<RecordReservationByPatente/>}/>
        <Route path="/record-reservation-by-rut" element={<RecordReservationByRut/>}/>
        <Route path="/record-reservation-by-date" element={<RecordReservationByDate/>}/>
        <Route path="/confirm-reservation" element={<ConfirmReservation/>}/>
        <Route path="/confirm-reservation-final" element={<ConfirmReservationFinal/>}/>
        <Route path="/user-reserve" element={<Reserve/>}/>
      </Routes>
    </>
  )
}

export default App

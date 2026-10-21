import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Canchas from "./pages/Canchas";
import Reserva from "./pages/Reserva";
import MisReservas from "./pages/MisReservas";
import ConfirmarReserva from "./pages/ConfirmarReserva";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/canchas" element={<Canchas />} />
        <Route path="/reserva" element={<Reserva />} />
        <Route path="/mis-reservas" element={<MisReservas />} />
        <Route path="/confirmar-reserva" element={<ConfirmarReserva />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

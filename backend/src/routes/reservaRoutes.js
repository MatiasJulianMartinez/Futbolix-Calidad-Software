const express = require("express");

const {
  listarCanchas,
  listarCanchasDestacadas,
  crearReserva,
  listarReservas,
} = require("../controllers/reservaController");

const router = express.Router();

router.get("/canchas/destacadas", listarCanchasDestacadas);

router.get("/canchas", listarCanchas);

router.get("/reservas", listarReservas);

router.post("/reservas", crearReserva);

module.exports = router;

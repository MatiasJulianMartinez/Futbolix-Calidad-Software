const canchaModel = require("../models/canchaModel");
const reservaModel = require("../models/reservaModel");

const {
  validarHorario,
  calcularPrecioReserva,
} = require("../services/reservaService");

async function listarCanchas(req, res) {
  try {
    const canchas = await canchaModel.obtenerCanchas();

    res.json(canchas);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al obtener las canchas",
    });
  }
}

async function listarCanchasDestacadas(req, res) {
  try {
    const canchas = await canchaModel.obtenerCanchasDestacadas();

    res.json(canchas);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al obtener las canchas destacadas",
    });
  }
}

async function listarReservas(req, res) {
  try {
    const reservas = await reservaModel.obtenerReservas();

    res.json(reservas);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al obtener las reservas",
    });
  }
}

async function crearReserva(req, res) {
  try {
    const { canchaId, fecha, hora, cantidadHoras } = req.body;

    if (!canchaId || !fecha || hora === undefined || !cantidadHoras) {
      return res.status(400).json({
        mensaje: "Faltan datos para realizar la reserva",
      });
    }

    const cancha = await canchaModel.obtenerCanchaPorId(canchaId);

    if (!cancha) {
      return res.status(404).json({
        mensaje: "La cancha seleccionada no existe",
      });
    }

    const horaNumero = Number(String(hora).split(":")[0]);

    const cantidadHorasNumero = Number(cantidadHoras);

    if (!validarHorario(horaNumero)) {
      return res.status(400).json({
        mensaje: "El horario seleccionado no es válido",
      });
    }

    if (cantidadHorasNumero <= 0) {
      return res.status(400).json({
        mensaje: "La cantidad de horas no es válida",
      });
    }

    const existeConflicto = await reservaModel.existeConflictoReserva(
      canchaId,
      fecha,
      horaNumero,
      cantidadHorasNumero,
    );

    if (existeConflicto) {
      return res.status(409).json({
        mensaje: "La cancha ya se encuentra reservada para ese horario",
      });
    }

    const precioTotal = calcularPrecioReserva(
      cantidadHorasNumero,
      Number(cancha.precio_hora),
    );

    if (precioTotal === null) {
      return res.status(400).json({
        mensaje: "No se pudo calcular el precio de la reserva",
      });
    }

    const reserva = await reservaModel.crearReserva(
      canchaId,
      fecha,
      horaNumero,
      cantidadHorasNumero,
      precioTotal,
    );

    return res.status(201).json({
      mensaje: "Reserva realizada correctamente",
      reserva,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: "Error al realizar la reserva",
    });
  }
}

module.exports = {
  listarCanchas,
  listarCanchasDestacadas,
  listarReservas,
  crearReserva,
};

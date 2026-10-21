const { getDatabase } = require("../config/database");

async function crearReserva(canchaId, fecha, hora, cantidadHoras, precioTotal) {
  const db = getDatabase();

  const resultado = await db.run(
    `
        INSERT INTO reservas (
            cancha_id,
            fecha,
            hora,
            cantidad_horas,
            precio_total
        )
        VALUES (?, ?, ?, ?, ?)
        `,
    [canchaId, fecha, hora, cantidadHoras, precioTotal],
  );

  return {
    id: resultado.lastID,
    canchaId,
    fecha,
    hora,
    cantidadHoras,
    precioTotal,
  };
}

async function obtenerReservas() {
  const db = getDatabase();

  return await db.all(`
        SELECT
            reservas.id,
            reservas.cancha_id,
            canchas.nombre AS cancha,
            reservas.fecha,
            reservas.hora,
            reservas.cantidad_horas,
            reservas.precio_total
        FROM reservas
        INNER JOIN canchas
            ON reservas.cancha_id = canchas.id
        ORDER BY reservas.id DESC
    `);
}

async function existeConflictoReserva(canchaId, fecha, hora, cantidadHoras) {
  const db = getDatabase();

  const reserva = await db.get(
    `
        SELECT id
        FROM reservas
        WHERE cancha_id = ?
          AND fecha = ?
          AND ? < (hora + cantidad_horas)
          AND (? + ?) > hora
        LIMIT 1
        `,
    [canchaId, fecha, hora, hora, cantidadHoras],
  );

  return Boolean(reserva);
}

module.exports = {
  crearReserva,
  obtenerReservas,
  existeConflictoReserva,
};

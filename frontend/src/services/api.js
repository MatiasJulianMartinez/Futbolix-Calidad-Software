const API_URL = "http://localhost:3000/api";

export async function obtenerCanchas() {
  const respuesta = await fetch(`${API_URL}/canchas`);

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener las canchas");
  }

  return await respuesta.json();
}

export async function obtenerCanchasDestacadas() {
  const respuesta = await fetch(`${API_URL}/canchas/destacadas`);

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener las canchas destacadas");
  }

  return await respuesta.json();
}

export async function obtenerReservas() {
  const respuesta = await fetch(`${API_URL}/reservas`);

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener las reservas");
  }

  return await respuesta.json();
}

export async function crearReserva(reserva) {
  const respuesta = await fetch(`${API_URL}/reservas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reserva),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.mensaje);
  }

  return datos;
}

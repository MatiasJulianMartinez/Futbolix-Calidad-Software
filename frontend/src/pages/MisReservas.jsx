import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import { obtenerCanchas, obtenerReservas } from "../services/api";

function MisReservas() {
  const navigate = useNavigate();

  const [reservas, setReservas] = useState([]);
  const [canchas, setCanchas] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [reservaSeleccionadaId, setReservaSeleccionadaId] = useState(null);

  useEffect(() => {
    async function cargarDatos() {
      try {
        setCargando(true);
        setError("");

        const [datosReservas, datosCanchas] = await Promise.all([
          obtenerReservas(),
          obtenerCanchas(),
        ]);

        setReservas(datosReservas);
        setCanchas(datosCanchas);

        if (datosReservas.length > 0) {
          setReservaSeleccionadaId(datosReservas[0].id);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, []);

  const reservasCompletas = useMemo(() => {
    return reservas.map((reserva) => {
      const cancha = canchas.find(
        (item) => Number(item.id) === Number(reserva.cancha_id),
      );

      return {
        ...reserva,
        datosCancha: cancha,
      };
    });
  }, [reservas, canchas]);

  const reservaSeleccionada = reservasCompletas.find(
    (reserva) => Number(reserva.id) === Number(reservaSeleccionadaId),
  );

  if (cargando) {
    return (
      <div className="min-h-screen bg-background text-on-surface">
        <Navbar />

        <div className="flex min-h-[500px] flex-col items-center justify-center gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">
            progress_activity
          </span>

          <p>Cargando reservas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-on-surface">
        <Navbar />

        <main className="mx-auto max-w-4xl px-4 py-20">
          <div className="rounded-xl border border-error/40 bg-error/10 p-8 text-center">
            <span className="material-symbols-outlined text-5xl text-error">
              error
            </span>

            <h1 className="mt-3 font-display text-xl font-bold">
              No se pudieron cargar las reservas
            </h1>

            <p className="mt-2 text-sm text-on-surface-variant">{error}</p>

            <button
              type="button"
              onClick={() => navigate("/canchas")}
              className="mt-6 rounded-lg bg-primary px-5 py-2.5 font-semibold text-on-primary"
            >
              Ver canchas
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8 lg:px-12">
        {/* ENCABEZADO */}
        <div className="mb-8">
          <span className="font-label text-xs uppercase tracking-wider text-primary">
            Tus partidos
          </span>

          <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">
            Mis Reservas
          </h1>

          <p className="mt-2 text-sm text-on-surface-variant">
            Consultá las canchas que reservaste y los datos de cada partido.
          </p>
        </div>

        {reservasCompletas.length === 0 ? (
          <EstadoVacio onBuscar={() => navigate("/canchas")} />
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
            {/* LISTADO */}
            <section className="flex flex-col gap-4">
              {reservasCompletas.map((reserva) => {
                const cancha = reserva.datosCancha;

                const seleccionada = reserva.id === reservaSeleccionadaId;

                const estado = obtenerEstadoReserva(reserva);

                return (
                  <button
                    key={reserva.id}
                    type="button"
                    onClick={() => setReservaSeleccionadaId(reserva.id)}
                    className={`overflow-hidden rounded-xl border text-left transition ${
                      seleccionada
                        ? "border-primary bg-surface-high"
                        : "border-outline-variant bg-surface-low hover:border-primary/50"
                    }`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr]">
                      <div className="relative h-44 overflow-hidden sm:h-full">
                        {cancha?.imagen ? (
                          <img
                            src={cancha.imagen}
                            alt={cancha.nombre}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full min-h-44 items-center justify-center bg-surface-highest">
                            <span className="material-symbols-outlined text-5xl text-on-surface-variant">
                              sports_soccer
                            </span>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                      </div>

                      <div className="flex flex-col justify-between gap-5 p-5">
                        <div>
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="font-label text-[10px] uppercase tracking-wider text-primary">
                                Reserva #{reserva.id}
                              </p>

                              <h2 className="mt-1 font-display text-xl font-bold">
                                {cancha?.nombre || reserva.cancha}
                              </h2>
                            </div>

                            <EstadoBadge estado={estado} />
                          </div>

                          <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                            <Dato
                              icono="calendar_month"
                              texto={formatearFecha(reserva.fecha)}
                            />

                            <Dato
                              icono="schedule"
                              texto={`${formatearHora(
                                reserva.hora,
                              )} - ${obtenerHoraFinal(
                                reserva.hora,
                                reserva.cantidad_horas,
                              )}`}
                            />

                            <Dato
                              icono="location_on"
                              texto={cancha?.ubicacion || "Corrientes Capital"}
                            />

                            <Dato
                              icono="payments"
                              texto={`$${Number(
                                reserva.precio_total,
                              ).toLocaleString("es-AR")}`}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-outline-variant pt-4">
                          <span className="text-xs text-on-surface-variant">
                            {reserva.cantidad_horas}{" "}
                            {Number(reserva.cantidad_horas) === 1
                              ? "hora"
                              : "horas"}
                          </span>

                          <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                            Ver detalle
                            <span className="material-symbols-outlined text-lg">
                              arrow_forward
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </section>

            {/* DETALLE */}
            {reservaSeleccionada && (
              <DetalleReserva
                reserva={reservaSeleccionada}
                onNuevaReserva={() => navigate("/canchas")}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function DetalleReserva({ reserva, onNuevaReserva }) {
  const cancha = reserva.datosCancha;

  const estado = obtenerEstadoReserva(reserva);

  return (
    <aside className="h-fit overflow-hidden rounded-xl border border-outline-variant bg-surface-low lg:sticky lg:top-24">
      {cancha?.imagen && (
        <div className="relative h-44 overflow-hidden">
          <img
            src={cancha.imagen}
            alt={cancha.nombre}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

          <div className="absolute bottom-3 left-4">
            <EstadoBadge estado={estado} />
          </div>
        </div>
      )}

      <div className="p-5">
        <p className="font-label text-[10px] uppercase tracking-wider text-primary">
          Detalle de la reserva
        </p>

        <h2 className="mt-2 font-display text-2xl font-bold">
          {cancha?.nombre || reserva.cancha}
        </h2>

        <p className="mt-1 flex items-center gap-1 text-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-lg">location_on</span>

          {cancha?.ubicacion || "Corrientes Capital"}
        </p>

        <div className="mt-6 flex flex-col gap-4">
          <Detalle
            icono="calendar_month"
            titulo="Fecha"
            texto={formatearFechaCompleta(reserva.fecha)}
          />

          <Detalle
            icono="schedule"
            titulo="Horario"
            texto={`${formatearHora(reserva.hora)} - ${obtenerHoraFinal(
              reserva.hora,
              reserva.cantidad_horas,
            )}`}
          />

          <Detalle
            icono="sports_soccer"
            titulo="Cancha"
            texto={
              cancha
                ? `${cancha.tipo} · ${cancha.superficie}`
                : "Sin información"
            }
          />

          <Detalle
            icono="payments"
            titulo="Total"
            texto={`$${Number(reserva.precio_total).toLocaleString("es-AR")}`}
          />
        </div>

        {cancha?.servicio && (
          <div className="mt-5 flex items-start gap-2 rounded-lg bg-surface-highest/60 p-3">
            <span className="material-symbols-outlined text-lg text-primary">
              check_circle
            </span>

            <p className="text-xs text-on-surface-variant">{cancha.servicio}</p>
          </div>
        )}

        <button
          type="button"
          onClick={onNuevaReserva}
          className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary font-semibold text-on-primary transition hover:bg-primary-light"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          Nueva reserva
        </button>
      </div>
    </aside>
  );
}

function EstadoBadge({ estado }) {
  const futura = estado === "Próxima";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        futura
          ? "bg-primary/10 text-primary"
          : "bg-surface-highest text-on-surface-variant"
      }`}
    >
      {estado}
    </span>
  );
}

function Dato({ icono, texto }) {
  return (
    <div className="flex items-center gap-2 text-on-surface-variant">
      <span className="material-symbols-outlined text-lg text-primary">
        {icono}
      </span>

      <span>{texto}</span>
    </div>
  );
}

function Detalle({ icono, titulo, texto }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <span className="material-symbols-outlined">{icono}</span>
      </div>

      <div>
        <p className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant">
          {titulo}
        </p>

        <p className="mt-1 text-sm font-semibold capitalize">{texto}</p>
      </div>
    </div>
  );
}

function EstadoVacio({ onBuscar }) {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-low px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <span className="material-symbols-outlined text-4xl">event_busy</span>
      </div>

      <h2 className="mt-5 font-display text-2xl font-bold">
        Todavía no tenés reservas
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-on-surface-variant">
        Buscá una cancha, elegí un horario disponible y tu reserva va a aparecer
        acá.
      </p>

      <button
        type="button"
        onClick={onBuscar}
        className="mt-6 rounded-lg bg-primary px-6 py-3 font-semibold text-on-primary transition hover:bg-primary-light"
      >
        Buscar canchas
      </button>
    </div>
  );
}

function obtenerEstadoReserva(reserva) {
  const [año, mes, dia] = reserva.fecha.split("-").map(Number);

  const fechaReserva = new Date(año, mes - 1, dia, Number(reserva.hora));

  return fechaReserva >= new Date() ? "Próxima" : "Finalizada";
}

function formatearFecha(fecha) {
  const [año, mes, dia] = fecha.split("-").map(Number);

  return new Date(año, mes - 1, dia).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatearFechaCompleta(fecha) {
  const [año, mes, dia] = fecha.split("-").map(Number);

  return new Date(año, mes - 1, dia).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatearHora(hora) {
  return `${String(Number(hora)).padStart(2, "0")}:00`;
}

function obtenerHoraFinal(hora, cantidadHoras) {
  const final = (Number(hora) + Number(cantidadHoras)) % 24;

  return `${String(final).padStart(2, "0")}:00`;
}

export default MisReservas;

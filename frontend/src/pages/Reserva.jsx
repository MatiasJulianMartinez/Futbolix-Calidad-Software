import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Navbar from "../components/Navbar";

import { obtenerCanchas, obtenerReservas } from "../services/api";

function Reserva() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const canchaId = Number(searchParams.get("canchaId"));

  const hoy = useMemo(() => new Date(), []);

  const fechaInicial = searchParams.get("fecha") || formatearFechaInput(hoy);

  const horaInicial = searchParams.get("hora") || "";

  const [canchas, setCanchas] = useState([]);
  const [reservas, setReservas] = useState([]);

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState("");

  const [fechaSeleccionada, setFechaSeleccionada] = useState(fechaInicial);

  const [horaSeleccionada, setHoraSeleccionada] = useState(horaInicial);

  const [mesVisible, setMesVisible] = useState(() => {
    const fecha = convertirFecha(fechaInicial);

    return new Date(fecha.getFullYear(), fecha.getMonth(), 1);
  });

  useEffect(() => {
    async function cargarDatos() {
      try {
        setCargando(true);
        setError("");

        const [datosCanchas, datosReservas] = await Promise.all([
          obtenerCanchas(),
          obtenerReservas(),
        ]);

        setCanchas(datosCanchas);
        setReservas(datosReservas);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, []);

  const cancha = canchas.find((item) => Number(item.id) === canchaId);

  const horarios = [18, 19, 20, 21, 22, 23];

  const horariosOcupados = useMemo(() => {
    const ocupados = [];

    reservas
      .filter(
        (reserva) =>
          Number(reserva.cancha_id) === canchaId &&
          reserva.fecha === fechaSeleccionada,
      )
      .forEach((reserva) => {
        const horaInicio = Number(reserva.hora);

        const cantidadHoras = Number(reserva.cantidad_horas);

        for (let i = 0; i < cantidadHoras; i += 1) {
          ocupados.push(horaInicio + i);
        }
      });

    return ocupados;
  }, [reservas, canchaId, fechaSeleccionada]);

  useEffect(() => {
    if (!horaSeleccionada) {
      return;
    }

    const horaNumero = Number(horaSeleccionada.split(":")[0]);

    if (horariosOcupados.includes(horaNumero)) {
      setHoraSeleccionada("");
    }
  }, [horariosOcupados, horaSeleccionada]);

  function esHorarioOcupado(hora) {
    return horariosOcupados.includes(hora);
  }

  function seleccionarHorario(hora) {
    if (esHorarioOcupado(hora)) {
      return;
    }

    setHoraSeleccionada(`${hora}:00`);
  }

  function seleccionarFecha(fecha) {
    const fechaFormateada = formatearFechaInput(fecha);

    setFechaSeleccionada(fechaFormateada);

    setHoraSeleccionada("");
  }

  function cambiarMes(cantidad) {
    const nuevoMes = new Date(
      mesVisible.getFullYear(),
      mesVisible.getMonth() + cantidad,
      1,
    );

    if (esMesAnterior(nuevoMes, hoy)) {
      return;
    }

    setMesVisible(nuevoMes);
  }

  function continuar() {
    if (!cancha || !fechaSeleccionada || !horaSeleccionada) {
      return;
    }

    const horaNumero = Number(horaSeleccionada.split(":")[0]);

    if (esHorarioOcupado(horaNumero)) {
      setHoraSeleccionada("");
      return;
    }

    const parametros = new URLSearchParams({
      canchaId: String(cancha.id),
      fecha: fechaSeleccionada,
      hora: horaSeleccionada,
      cantidadHoras: "1",
    });

    navigate(`/confirmar-reserva?${parametros.toString()}`);
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-background text-on-surface">
        <Navbar />

        <div className="flex min-h-[500px] flex-col items-center justify-center gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">
            progress_activity
          </span>

          <p>Cargando disponibilidad...</p>
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

            <h1 className="mt-3 font-display text-xl font-bold text-error">
              No se pudo cargar la disponibilidad
            </h1>

            <p className="mt-2 text-sm text-on-surface-variant">{error}</p>

            <button
              type="button"
              onClick={() => navigate("/canchas")}
              className="mt-6 rounded-lg bg-primary px-5 py-2.5 font-semibold text-on-primary"
            >
              Volver a canchas
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!cancha) {
    return (
      <div className="min-h-screen bg-background text-on-surface">
        <Navbar />

        <main className="mx-auto max-w-4xl px-4 py-20 text-center">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant">
            search_off
          </span>

          <h1 className="mt-4 font-display text-2xl font-bold">
            Cancha no encontrada
          </h1>

          <p className="mt-2 text-on-surface-variant">
            La cancha seleccionada no existe.
          </p>

          <button
            type="button"
            onClick={() => navigate("/canchas")}
            className="mt-6 rounded-lg bg-primary px-6 py-3 font-semibold text-on-primary"
          >
            Volver a canchas
          </button>
        </main>
      </div>
    );
  }

  const diasCalendario = generarDiasMes(mesVisible);

  const mesAnteriorBloqueado = esMesActual(mesVisible, hoy);

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 lg:px-12">
        <button
          type="button"
          onClick={() => navigate("/canchas")}
          className="mb-6 flex items-center gap-1 text-sm font-semibold text-on-surface-variant transition hover:text-primary"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Volver a canchas
        </button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          <div className="flex min-w-0 flex-col gap-8">
            <section className="overflow-hidden rounded-xl border border-outline-variant bg-surface-low">
              <div className="grid grid-cols-1 md:grid-cols-[260px_1fr]">
                <div className="relative h-52 overflow-hidden md:h-full">
                  <img
                    src={cancha.imagen}
                    alt={cancha.nombre}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />

                  <div className="absolute left-3 top-3 rounded-md bg-primary px-2.5 py-1 text-xs font-bold text-on-primary">
                    {cancha.tipo}
                  </div>
                </div>

                <div className="flex flex-col justify-between p-5 md:p-6">
                  <div>
                    <p className="font-label text-xs uppercase tracking-wider text-primary">
                      Complejo seleccionado
                    </p>

                    <h1 className="mt-2 font-display text-2xl font-bold md:text-3xl">
                      {cancha.nombre}
                    </h1>

                    <p className="mt-2 flex items-center gap-1.5 text-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-lg">
                        location_on
                      </span>

                      {cancha.ubicacion}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="flex items-center gap-1 rounded-md border border-outline-variant bg-surface-highest px-2.5 py-1.5 text-xs text-on-surface-variant">
                        <span className="material-symbols-outlined text-base text-primary">
                          grass
                        </span>

                        {cancha.superficie}
                      </span>

                      <span className="flex items-center gap-1 rounded-md border border-outline-variant bg-surface-highest px-2.5 py-1.5 text-xs text-on-surface-variant">
                        <span className="material-symbols-outlined text-base text-primary">
                          check_circle
                        </span>

                        {cancha.servicio}
                      </span>

                      <span className="flex items-center gap-1 rounded-md border border-outline-variant bg-surface-highest px-2.5 py-1.5 text-xs text-on-surface-variant">
                        <span className="material-symbols-outlined fill-icon text-base text-primary">
                          star
                        </span>

                        {Number(cancha.puntuacion).toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-end justify-between border-t border-outline-variant pt-4">
                    <span className="text-sm text-on-surface-variant">
                      Precio por hora
                    </span>

                    <span className="font-display text-2xl font-bold text-primary">
                      ${Number(cancha.precio_hora).toLocaleString("es-AR")}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="mb-4">
                <span className="font-label text-xs uppercase tracking-wider text-primary">
                  Paso 1
                </span>

                <h2 className="mt-1 font-display text-2xl font-bold">
                  Seleccioná una fecha
                </h2>

                <p className="mt-1 text-sm text-on-surface-variant">
                  Elegí el día en el que querés jugar.
                </p>
              </div>

              <div className="rounded-xl border border-outline-variant bg-surface-low p-4 md:p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold capitalize md:text-xl">
                    {mesVisible.toLocaleDateString("es-AR", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h3>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={mesAnteriorBloqueado}
                      onClick={() => cambiarMes(-1)}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <span className="material-symbols-outlined">
                        chevron_left
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => cambiarMes(1)}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant transition hover:border-primary hover:text-primary"
                    >
                      <span className="material-symbols-outlined">
                        chevron_right
                      </span>
                    </button>
                  </div>
                </div>

                <div className="mb-2 grid grid-cols-7 gap-1 text-center">
                  {["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"].map(
                    (dia) => (
                      <div
                        key={dia}
                        className="py-2 font-label text-[10px] font-bold text-on-surface-variant sm:text-xs"
                      >
                        {dia}
                      </div>
                    ),
                  )}
                </div>

                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {diasCalendario.map((fecha, indice) => {
                    if (!fecha) {
                      return (
                        <div key={`vacio-${indice}`} className="h-11 sm:h-12" />
                      );
                    }

                    const fechaFormateada = formatearFechaInput(fecha);

                    const seleccionada = fechaFormateada === fechaSeleccionada;

                    const pasada = esFechaAnterior(fecha, hoy);

                    const actual = fechaFormateada === formatearFechaInput(hoy);

                    return (
                      <button
                        key={fechaFormateada}
                        type="button"
                        disabled={pasada}
                        onClick={() => seleccionarFecha(fecha)}
                        className={`relative flex h-11 items-center justify-center rounded-lg text-sm transition sm:h-12 ${
                          seleccionada
                            ? "bg-primary font-bold text-on-primary shadow-[0_0_12px_rgba(75,226,119,0.25)]"
                            : pasada
                              ? "cursor-not-allowed text-on-surface-variant opacity-25"
                              : "border border-transparent text-on-surface hover:border-primary/40 hover:bg-surface-high"
                        }`}
                      >
                        {fecha.getDate()}

                        {actual && !seleccionada && (
                          <span className="absolute bottom-1 h-1 w-1 rounded-full bg-primary" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            <section>
              <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <span className="font-label text-xs uppercase tracking-wider text-primary">
                    Paso 2
                  </span>

                  <h2 className="mt-1 font-display text-2xl font-bold">
                    Elegí un horario
                  </h2>

                  <p className="mt-1 text-sm text-on-surface-variant">
                    Disponibilidad para{" "}
                    <span className="font-semibold text-on-surface">
                      {formatearFechaVisual(fechaSeleccionada)}
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full border border-primary" />

                    <span className="text-on-surface-variant">Disponible</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-surface-highest" />

                    <span className="text-on-surface-variant">Ocupado</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-primary" />

                    <span className="text-on-surface-variant">
                      Seleccionado
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {horarios.map((hora) => {
                  const ocupado = esHorarioOcupado(hora);

                  const seleccionado = horaSeleccionada === `${hora}:00`;

                  if (ocupado) {
                    return (
                      <div
                        key={hora}
                        className="flex h-24 cursor-not-allowed flex-col items-center justify-center rounded-xl border border-outline-variant bg-surface-lowest opacity-40"
                      >
                        <span className="text-lg font-bold text-on-surface-variant line-through">
                          {hora}
                          :00
                        </span>

                        <span className="mt-1 font-label text-[10px] font-semibold uppercase text-on-surface-variant">
                          Ocupado
                        </span>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={hora}
                      type="button"
                      onClick={() => seleccionarHorario(hora)}
                      className={`relative flex h-24 flex-col items-center justify-center rounded-xl border transition ${
                        seleccionado
                          ? "border-primary bg-primary font-bold text-on-primary shadow-[0_0_16px_rgba(75,226,119,0.25)]"
                          : "border-primary/20 bg-surface-low text-on-surface hover:-translate-y-0.5 hover:border-primary hover:bg-surface-high"
                      }`}
                    >
                      {seleccionado && (
                        <span className="material-symbols-outlined absolute right-2 top-2 text-base">
                          check_circle
                        </span>
                      )}

                      <span className="text-lg font-bold">
                        {hora}
                        :00
                      </span>

                      <span
                        className={`mt-1 text-xs font-semibold ${
                          seleccionado ? "" : "text-primary"
                        }`}
                      >
                        ${Number(cancha.precio_hora).toLocaleString("es-AR")}
                      </span>
                    </button>
                  );
                })}
              </div>

              {horariosOcupados.length > 0 && (
                <p className="mt-4 flex items-center gap-1.5 text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-base">
                    info
                  </span>
                  Los horarios marcados como ocupados ya tienen una reserva para
                  esta cancha.
                </p>
              )}
            </section>
          </div>

          <aside className="h-fit rounded-xl border border-outline-variant bg-surface-low p-5 lg:sticky lg:top-24">
            <h2 className="border-b border-outline-variant pb-4 font-display text-xl font-bold">
              Resumen de reserva
            </h2>

            <div className="mt-5 flex flex-col gap-5">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <span className="material-symbols-outlined">stadium</span>
                </div>

                <div className="min-w-0">
                  <p className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant">
                    Cancha
                  </p>

                  <p className="mt-1 font-semibold">{cancha.nombre}</p>

                  <p className="mt-0.5 text-xs text-on-surface-variant">
                    {cancha.tipo} · {cancha.superficie}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <span className="material-symbols-outlined">
                    calendar_month
                  </span>
                </div>

                <div>
                  <p className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant">
                    Fecha
                  </p>

                  <p className="mt-1 font-semibold capitalize">
                    {formatearFechaCompleta(fechaSeleccionada)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <span className="material-symbols-outlined">schedule</span>
                </div>

                <div>
                  <p className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant">
                    Horario
                  </p>

                  <p
                    className={`mt-1 font-semibold ${
                      horaSeleccionada
                        ? "text-primary"
                        : "text-on-surface-variant"
                    }`}
                  >
                    {horaSeleccionada
                      ? `${horaSeleccionada} - ${obtenerHoraFinal(
                          horaSeleccionada,
                        )}`
                      : "Seleccioná un horario"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-outline-variant pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-on-surface-variant">Total</p>

                  <p className="mt-1 text-xs text-on-surface-variant">1 hora</p>
                </div>

                <span className="font-display text-2xl font-bold text-primary">
                  $
                  {horaSeleccionada
                    ? Number(cancha.precio_hora).toLocaleString("es-AR")
                    : "0"}
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={!horaSeleccionada}
              onClick={continuar}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary font-semibold text-on-primary transition hover:bg-primary-light active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continuar
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>

            {!horaSeleccionada && (
              <p className="mt-3 text-center text-xs text-on-surface-variant">
                Seleccioná un horario disponible para continuar.
              </p>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}

function formatearFechaInput(fecha) {
  const año = fecha.getFullYear();

  const mes = String(fecha.getMonth() + 1).padStart(2, "0");

  const dia = String(fecha.getDate()).padStart(2, "0");

  return `${año}-${mes}-${dia}`;
}

function convertirFecha(valor) {
  const [año, mes, dia] = valor.split("-").map(Number);

  return new Date(año, mes - 1, dia);
}

function esFechaAnterior(fecha, referencia) {
  const fechaComparar = new Date(
    fecha.getFullYear(),
    fecha.getMonth(),
    fecha.getDate(),
  );

  const hoyComparar = new Date(
    referencia.getFullYear(),
    referencia.getMonth(),
    referencia.getDate(),
  );

  return fechaComparar < hoyComparar;
}

function esMesAnterior(mes, referencia) {
  const mesComparar = new Date(mes.getFullYear(), mes.getMonth(), 1);

  const mesActual = new Date(
    referencia.getFullYear(),
    referencia.getMonth(),
    1,
  );

  return mesComparar < mesActual;
}

function esMesActual(mes, referencia) {
  return (
    mes.getFullYear() === referencia.getFullYear() &&
    mes.getMonth() === referencia.getMonth()
  );
}

function generarDiasMes(mes) {
  const año = mes.getFullYear();

  const numeroMes = mes.getMonth();

  const primerDia = new Date(año, numeroMes, 1);

  const cantidadDias = new Date(año, numeroMes + 1, 0).getDate();

  const dias = [];

  for (let i = 0; i < primerDia.getDay(); i += 1) {
    dias.push(null);
  }

  for (let dia = 1; dia <= cantidadDias; dia += 1) {
    dias.push(new Date(año, numeroMes, dia));
  }

  return dias;
}

function formatearFechaVisual(valor) {
  if (!valor) {
    return "-";
  }

  return convertirFecha(valor).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatearFechaCompleta(valor) {
  if (!valor) {
    return "-";
  }

  return convertirFecha(valor).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function obtenerHoraFinal(hora) {
  const horaNumero = Number(hora.split(":")[0]);

  const siguiente = horaNumero + 1;

  if (siguiente === 24) {
    return "00:00";
  }

  return `${siguiente}:00`;
}

export default Reserva;

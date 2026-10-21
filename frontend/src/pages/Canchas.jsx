import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import { obtenerCanchas } from "../services/api";
import Footer from "../components/Footer";

function normalizarTipo(tipo) {
  if (!tipo) {
    return "";
  }

  return tipo.startsWith("F") ? tipo : `F${tipo}`;
}

function Canchas() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [canchas, setCanchas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [fecha, setFecha] = useState(searchParams.get("fecha") || "");

  const [hora, setHora] = useState(searchParams.get("hora") || "");

  const [tipo, setTipo] = useState(normalizarTipo(searchParams.get("tipo")));

  const [ubicacion, setUbicacion] = useState(
    searchParams.get("ubicacion") || "",
  );

  const fechaActual = new Date().toISOString().split("T")[0];

  useEffect(() => {
    async function cargarCanchas() {
      try {
        setCargando(true);
        setError("");

        const datos = await obtenerCanchas();

        setCanchas(datos);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    }

    cargarCanchas();
  }, []);

  useEffect(() => {
    const parametros = new URLSearchParams();

    if (fecha) {
      parametros.set("fecha", fecha);
    }

    if (hora) {
      parametros.set("hora", hora);
    }

    if (tipo) {
      parametros.set("tipo", tipo.replace("F", ""));
    }

    if (ubicacion) {
      parametros.set("ubicacion", ubicacion);
    }

    setSearchParams(parametros, {
      replace: true,
    });
  }, [fecha, hora, tipo, ubicacion, setSearchParams]);

  const canchasFiltradas = canchas.filter((cancha) => {
    const coincideUbicacion =
      !ubicacion ||
      cancha.ubicacion.toLowerCase().includes(ubicacion.toLowerCase());

    const coincideTipo = !tipo || normalizarTipo(cancha.tipo) === tipo;

    return coincideUbicacion && coincideTipo;
  });

  function irAReserva(cancha) {
    const parametros = new URLSearchParams();

    parametros.set("canchaId", cancha.id);

    if (fecha) {
      parametros.set("fecha", fecha);
    }

    if (hora) {
      parametros.set("hora", hora);
    }

    navigate(`/reserva?${parametros.toString()}`);
  }

  function limpiarFiltros() {
    setFecha("");
    setHora("");
    setTipo("");
    setUbicacion("");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-on-surface">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 md:px-8 lg:px-12">
        {/* ENCABEZADO */}
        <div className="mb-10">
          <span className="font-label text-xs uppercase tracking-wider text-primary">
            Encontrá tu cancha
          </span>

          <h1 className="mt-2 font-display text-3xl font-extrabold md:text-5xl">
            Explorá las mejores canchas
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-on-surface-variant">
            Elegí el tipo de cancha, fecha y horario para encontrar la mejor
            opción para tu próximo partido.
          </p>
        </div>

        {/* FILTROS */}
        <section className="mb-10 rounded-2xl border border-outline-variant bg-surface-low p-4 md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold">Filtros</h2>

              <p className="mt-1 text-xs text-on-surface-variant">
                Ajustá tu búsqueda
              </p>
            </div>

            {(fecha || hora || tipo || ubicacion) && (
              <button
                type="button"
                onClick={limpiarFiltros}
                className="flex items-center gap-1.5 text-sm font-semibold text-primary transition hover:text-primary-light"
              >
                <span className="material-symbols-outlined text-lg">
                  restart_alt
                </span>
                Limpiar
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* FECHA */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="fecha"
                className="font-label text-xs uppercase text-on-surface-variant"
              >
                Fecha
              </label>

              <div className="flex h-12 items-center gap-2 rounded-lg border border-outline-variant bg-surface px-3 transition focus-within:border-primary">
                <span className="material-symbols-outlined text-xl text-on-surface-variant">
                  calendar_month
                </span>

                <input
                  id="fecha"
                  type="date"
                  min={fechaActual}
                  value={fecha}
                  onChange={(event) => setFecha(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm text-on-surface outline-none"
                />
              </div>
            </div>

            {/* HORA */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="hora"
                className="font-label text-xs uppercase text-on-surface-variant"
              >
                Hora
              </label>

              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-xl text-on-surface-variant">
                  schedule
                </span>

                <select
                  id="hora"
                  value={hora}
                  onChange={(event) => setHora(event.target.value)}
                  className="h-12 w-full appearance-none rounded-lg border border-outline-variant bg-surface py-2 pl-10 pr-10 text-sm text-on-surface outline-none transition focus:border-primary"
                >
                  <option value="">Cualquier hora</option>

                  <option value="18:00">18:00 hs</option>

                  <option value="19:00">19:00 hs</option>

                  <option value="20:00">20:00 hs</option>

                  <option value="21:00">21:00 hs</option>

                  <option value="22:00">22:00 hs</option>

                  <option value="23:00">23:00 hs</option>
                </select>

                <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  expand_more
                </span>
              </div>
            </div>

            {/* TIPO */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="tipo"
                className="font-label text-xs uppercase text-on-surface-variant"
              >
                Tipo de cancha
              </label>

              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-xl text-on-surface-variant">
                  sports_soccer
                </span>

                <select
                  id="tipo"
                  value={tipo}
                  onChange={(event) => setTipo(event.target.value)}
                  className="h-12 w-full appearance-none rounded-lg border border-outline-variant bg-surface py-2 pl-10 pr-10 text-sm text-on-surface outline-none transition focus:border-primary"
                >
                  <option value="">Todos</option>

                  <option value="F5">Fútbol 5</option>

                  <option value="F7">Fútbol 7</option>

                  <option value="F11">Fútbol 11</option>
                </select>

                <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  expand_more
                </span>
              </div>
            </div>

            {/* UBICACION */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="ubicacion"
                className="font-label text-xs uppercase text-on-surface-variant"
              >
                Ubicación
              </label>

              <div className="flex h-12 items-center gap-2 rounded-lg border border-outline-variant bg-surface px-3 transition focus-within:border-primary">
                <span className="material-symbols-outlined text-xl text-on-surface-variant">
                  location_on
                </span>

                <input
                  id="ubicacion"
                  type="text"
                  value={ubicacion}
                  onChange={(event) => setUbicacion(event.target.value)}
                  placeholder="Ciudad o zona"
                  className="min-w-0 flex-1 bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant/50"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CARGANDO */}
        {cargando && (
          <div className="flex min-h-72 flex-col items-center justify-center gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">
              progress_activity
            </span>

            <p className="text-sm">Cargando canchas...</p>
          </div>
        )}

        {/* ERROR */}
        {!cargando && error && (
          <div className="rounded-xl border border-error/40 bg-error/10 p-8 text-center">
            <span className="material-symbols-outlined text-5xl text-error">
              error
            </span>

            <h2 className="mt-3 font-display text-xl font-bold text-error">
              No pudimos cargar las canchas
            </h2>

            <p className="mt-2 text-sm text-on-surface-variant">{error}</p>
          </div>
        )}

        {/* RESULTADOS */}
        {!cargando && !error && (
          <>
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="font-semibold">
                  {canchasFiltradas.length}{" "}
                  {canchasFiltradas.length === 1
                    ? "cancha encontrada"
                    : "canchas encontradas"}
                </p>

                {(fecha || hora) && (
                  <p className="mt-1 text-xs text-on-surface-variant">
                    La disponibilidad se verificará para la fecha y horario
                    seleccionados.
                  </p>
                )}
              </div>

              {tipo && (
                <span className="w-fit rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {tipo.replace("F", "Fútbol ")}
                </span>
              )}
            </div>

            {canchasFiltradas.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {canchasFiltradas.map((cancha) => (
                  <article
                    key={cancha.id}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_12px_35px_rgba(0,0,0,0.2)]"
                  >
                    {/* IMAGEN */}
                    <div className="relative h-52 w-full overflow-hidden">
                      <img
                        src={cancha.imagen}
                        alt={cancha.nombre}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />

                      {/* PUNTUACION */}
                      <div className="absolute left-3 top-3 flex items-center gap-1 rounded-md border border-outline-variant bg-background/80 px-2.5 py-1 backdrop-blur-md">
                        <span className="material-symbols-outlined fill-icon text-[16px] text-primary">
                          star
                        </span>

                        <span className="font-label text-xs font-bold">
                          {Number(cancha.puntuacion).toFixed(1)}
                        </span>
                      </div>

                      {/* TIPO */}
                      <div className="absolute right-3 top-3 rounded-md bg-primary px-2.5 py-1 font-label text-xs font-bold text-on-primary">
                        {cancha.tipo}
                      </div>
                    </div>

                    {/* CONTENIDO */}
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="font-display text-xl font-bold">
                            {cancha.nombre}
                          </h2>

                          <p className="mt-1 flex items-center gap-1 text-sm text-on-surface-variant">
                            <span className="material-symbols-outlined text-[17px]">
                              location_on
                            </span>

                            {cancha.ubicacion}
                          </p>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="font-display text-xl font-bold text-primary">
                            $
                            {Number(cancha.precio_hora).toLocaleString("es-AR")}
                          </p>

                          <span className="text-xs text-on-surface-variant">
                            por hora
                          </span>
                        </div>
                      </div>

                      {/* CARACTERISTICAS */}
                      <div className="mt-5 flex flex-wrap gap-2">
                        <span className="flex items-center gap-1 rounded-md border border-outline-variant bg-surface-highest px-2.5 py-1.5 text-xs text-on-surface-variant">
                          <span className="material-symbols-outlined text-[16px] text-primary">
                            grass
                          </span>

                          {cancha.superficie}
                        </span>

                        <span className="flex items-center gap-1 rounded-md border border-outline-variant bg-surface-highest px-2.5 py-1.5 text-xs text-on-surface-variant">
                          <span className="material-symbols-outlined text-[16px] text-primary">
                            check_circle
                          </span>

                          {cancha.servicio}
                        </span>
                      </div>

                      <div className="mt-auto pt-6">
                        <button
                          type="button"
                          onClick={() => irAReserva(cancha)}
                          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary font-semibold text-on-primary transition hover:bg-primary-light active:scale-[0.98]"
                        >
                          <span className="material-symbols-outlined text-xl">
                            calendar_month
                          </span>
                          Ver disponibilidad
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-outline-variant bg-surface-low py-16 text-center">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant">
                  search_off
                </span>

                <h2 className="mt-3 font-display text-xl font-bold">
                  No encontramos canchas
                </h2>

                <p className="mt-2 text-sm text-on-surface-variant">
                  Probá cambiando o limpiando alguno de los filtros.
                </p>

                <button
                  type="button"
                  onClick={limpiarFiltros}
                  className="mt-5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition hover:bg-primary-light"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Canchas;

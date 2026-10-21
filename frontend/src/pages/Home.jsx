import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import CanchaCard from "../components/CanchaCard";
import heroImage from "../assets/fondohero.jpg";
import { obtenerCanchasDestacadas } from "../services/api";
import Footer from "../components/Footer";

function Home() {
  const navigate = useNavigate();

  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("19:00");
  const [tipoCancha, setTipoCancha] = useState("5");

  const [canchasDestacadas, setCanchasDestacadas] = useState([]);
  const [cargandoCanchas, setCargandoCanchas] = useState(true);
  const [errorCanchas, setErrorCanchas] = useState("");

  useEffect(() => {
    async function cargarCanchasDestacadas() {
      try {
        const datos = await obtenerCanchasDestacadas();
        setCanchasDestacadas(datos);
      } catch (error) {
        setErrorCanchas(error.message);
      } finally {
        setCargandoCanchas(false);
      }
    }

    cargarCanchasDestacadas();
  }, []);

  function buscarCanchas(event) {
    event.preventDefault();

    const parametros = new URLSearchParams();

    if (fecha) {
      parametros.set("fecha", fecha);
    }

    if (hora) {
      parametros.set("hora", hora);
    }

    if (tipoCancha) {
      parametros.set("tipo", tipoCancha);
    }

    navigate(`/canchas?${parametros.toString()}`);
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar />

      <main>
        {/* HERO */}
        <section className="relative flex h-[400px] w-full items-center justify-center overflow-hidden">
          <img
            src={heroImage}
            alt="Cancha de fútbol iluminada de noche"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-background/45" />

          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

          <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center">
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-white drop-shadow-lg md:text-5xl">
              Tu Próximo Partido Empieza Acá
            </h1>

            <p className="max-w-2xl text-base text-gray-200 drop-shadow md:text-lg">
              Encontrá, compará y reservá las mejores canchas de tu ciudad en
              segundos.
            </p>

            <button
              type="button"
              onClick={() => navigate("/canchas")}
              className="mt-2 rounded-lg bg-primary px-8 py-3 font-semibold text-on-primary shadow-lg transition hover:bg-primary-light active:scale-95"
            >
              Explorar Canchas
            </button>
          </div>
        </section>

        {/* DESTACADOS */}
        <section className="mx-auto w-full max-w-7xl px-4 py-14 md:px-8 lg:px-12">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="font-label text-xs uppercase tracking-wider text-primary">
                Recomendados
              </span>

              <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">
                Complejos destacados
              </h2>

              <p className="mt-2 max-w-xl text-sm text-on-surface-variant">
                Descubrí algunas de las canchas mejor valoradas para organizar
                tu próximo partido.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/canchas")}
              className="flex w-fit items-center gap-1 text-sm font-semibold text-primary transition hover:text-primary-light"
            >
              Ver todas
              <span className="material-symbols-outlined text-lg">
                arrow_forward
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cargandoCanchas && (
              <div className="col-span-full flex min-h-64 items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-on-surface-variant">
                  <span className="material-symbols-outlined animate-spin text-3xl text-primary">
                    progress_activity
                  </span>

                  <p className="text-sm">Cargando canchas...</p>
                </div>
              </div>
            )}

            {!cargandoCanchas && errorCanchas && (
              <div className="col-span-full rounded-xl border border-error/40 bg-error/10 p-6 text-center">
                <span className="material-symbols-outlined text-4xl text-error">
                  error
                </span>

                <p className="mt-2 font-semibold text-error">
                  No se pudieron cargar las canchas
                </p>

                <p className="mt-1 text-sm text-on-surface-variant">
                  {errorCanchas}
                </p>
              </div>
            )}

            {!cargandoCanchas &&
              !errorCanchas &&
              canchasDestacadas.map((cancha) => (
                <CanchaCard
                  key={cancha.id}
                  id={cancha.id}
                  nombre={cancha.nombre}
                  ubicacion={cancha.ubicacion}
                  precio={cancha.precio_hora}
                  tipo={cancha.tipo}
                  puntuacion={cancha.puntuacion}
                  superficie={cancha.superficie}
                  servicio={cancha.servicio}
                  imagen={cancha.imagen}
                />
              ))}

            {!cargandoCanchas &&
              !errorCanchas &&
              canchasDestacadas.length === 0 && (
                <div className="col-span-full rounded-xl border border-outline-variant bg-surface-low py-14 text-center">
                  <span className="material-symbols-outlined text-5xl text-on-surface-variant">
                    sports_soccer
                  </span>

                  <p className="mt-3 font-semibold">
                    No hay canchas destacadas
                  </p>

                  <p className="mt-1 text-sm text-on-surface-variant">
                    Todavía no hay complejos marcados como destacados.
                  </p>
                </div>
              )}
          </div>
        </section>

        {/* BUSCADOR */}
        <section
          id="buscar"
          className="border-y border-outline-variant/60 bg-surface-lowest"
        >
          <div className="mx-auto w-full max-w-7xl px-4 py-14 md:px-8 lg:px-12">
            <div className="mx-auto max-w-5xl">
              <div className="mb-7 text-center">
                <span className="font-label text-xs uppercase tracking-wider text-primary">
                  Buscar disponibilidad
                </span>

                <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">
                  ¿Dónde querés jugar?
                </h2>

                <p className="mt-2 text-sm text-on-surface-variant">
                  Elegí fecha, horario y tipo de cancha para encontrar las
                  mejores opciones.
                </p>
              </div>

              <form
                onSubmit={buscarCanchas}
                className="rounded-2xl border border-outline-variant bg-surface-low p-4 shadow-[0_12px_35px_rgba(0,0,0,0.18)] md:p-6"
              >
                <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-4">
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

                    <div className="flex h-12 items-center gap-2 rounded-lg border border-outline-variant bg-surface px-3 transition focus-within:border-primary">
                      <span className="material-symbols-outlined text-xl text-on-surface-variant">
                        schedule
                      </span>

                      <select
                        id="hora"
                        value={hora}
                        onChange={(event) => setHora(event.target.value)}
                        className="min-w-0 flex-1 bg-surface text-sm text-on-surface outline-none"
                      >
                        <option value="18:00">18:00 hs</option>

                        <option value="19:00">19:00 hs</option>

                        <option value="20:00">20:00 hs</option>

                        <option value="21:00">21:00 hs</option>

                        <option value="22:00">22:00 hs</option>

                        <option value="23:00">23:00 hs</option>
                      </select>
                    </div>
                  </div>

                  {/* TIPO */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="tipoCancha"
                      className="font-label text-xs uppercase text-on-surface-variant"
                    >
                      Tipo de cancha
                    </label>

                    <div className="flex h-12 items-center gap-2 rounded-lg border border-outline-variant bg-surface px-3 transition focus-within:border-primary">
                      <span className="material-symbols-outlined text-xl text-on-surface-variant">
                        sports_soccer
                      </span>

                      <select
                        id="tipoCancha"
                        value={tipoCancha}
                        onChange={(event) => setTipoCancha(event.target.value)}
                        className="min-w-0 flex-1 bg-surface text-sm text-on-surface outline-none"
                      >
                        <option value="5">Fútbol 5</option>

                        <option value="7">Fútbol 7</option>

                        <option value="11">Fútbol 11</option>
                      </select>
                    </div>
                  </div>

                  {/* BOTON */}
                  <button
                    type="submit"
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 font-semibold text-on-primary shadow-[0_0_16px_rgba(75,226,119,0.15)] transition hover:bg-primary-light active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined">search</span>
                    Buscar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section className="mx-auto w-full max-w-7xl px-4 py-14 md:px-8 lg:px-12">
          <div className="mb-8 text-center">
            <span className="font-label text-xs uppercase tracking-wider text-primary">
              Simple y rápido
            </span>

            <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">
              Reservá en tres pasos
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <Paso
              numero="01"
              icono="search"
              titulo="Buscá una cancha"
              descripcion="Elegí la fecha, el horario y el tipo de cancha que necesitás."
            />

            <Paso
              numero="02"
              icono="calendar_month"
              titulo="Seleccioná un horario"
              descripcion="Revisá la disponibilidad y elegí el turno que mejor te quede."
            />

            <Paso
              numero="03"
              icono="check_circle"
              titulo="Confirmá la reserva"
              descripcion="Revisá los datos y confirmá tu cancha para el próximo partido."
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Paso({ numero, icono, titulo, descripcion }) {
  return (
    <article className="relative overflow-hidden rounded-xl border border-outline-variant bg-surface-low p-6 transition hover:border-primary/40 hover:bg-surface-container">
      <span className="absolute right-4 top-3 font-display text-5xl font-extrabold text-surface-highest">
        {numero}
      </span>

      <div className="relative z-10">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <span className="material-symbols-outlined">{icono}</span>
        </div>

        <h3 className="mt-5 font-display text-lg font-bold">{titulo}</h3>

        <p className="mt-2 text-sm leading-6 text-on-surface-variant">
          {descripcion}
        </p>
      </div>
    </article>
  );
}

export default Home;

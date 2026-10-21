import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Navbar from "../components/Navbar";

import { obtenerCanchas, crearReserva } from "../services/api";

function ConfirmarReserva() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const canchaId = Number(searchParams.get("canchaId"));

  const fecha = searchParams.get("fecha");

  const hora = searchParams.get("hora");

  const cantidadHoras = Number(searchParams.get("cantidadHoras") || 1);

  const [cancha, setCancha] = useState(null);

  const [metodoPago, setMetodoPago] = useState("efectivo");

  const [montoPago, setMontoPago] = useState("sena");

  const [cargando, setCargando] = useState(true);

  const [procesando, setProcesando] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarCancha() {
      try {
        setError("");

        if (!canchaId || !fecha || !hora || cantidadHoras <= 0) {
          throw new Error("Faltan datos para confirmar la reserva");
        }

        const canchas = await obtenerCanchas();

        const seleccionada = canchas.find(
          (item) => Number(item.id) === canchaId,
        );

        if (!seleccionada) {
          throw new Error("La cancha seleccionada no existe");
        }

        setCancha(seleccionada);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    }

    cargarCancha();
  }, [canchaId, fecha, hora, cantidadHoras]);

  function volverDisponibilidad() {
    if (!canchaId) {
      navigate("/canchas");
      return;
    }

    const parametros = new URLSearchParams({
      canchaId: String(canchaId),
    });

    if (fecha) {
      parametros.set("fecha", fecha);
    }

    if (hora) {
      parametros.set("hora", hora);
    }

    navigate(`/reserva?${parametros.toString()}`);
  }

  async function confirmarReserva() {
    if (!cancha || !fecha || !hora) {
      return;
    }

    setProcesando(true);
    setError("");

    try {
      const horaNumero = Number(hora.split(":")[0]);

      await crearReserva({
        canchaId,
        fecha,
        hora: horaNumero,
        cantidadHoras,
      });

      navigate("/mis-reservas");
    } catch (error) {
      setError(error.message);
    } finally {
      setProcesando(false);
    }
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-background text-on-surface">
        <Navbar />

        <div className="flex min-h-[500px] flex-col items-center justify-center gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">
            progress_activity
          </span>

          <p>Cargando reserva...</p>
        </div>
      </div>
    );
  }

  if (!cancha) {
    return (
      <div className="min-h-screen bg-background text-on-surface">
        <Navbar />

        <main className="mx-auto max-w-4xl px-4 py-20">
          <div className="rounded-xl border border-error/40 bg-error/10 p-8 text-center">
            <span className="material-symbols-outlined text-5xl text-error">
              error
            </span>

            <h1 className="mt-3 font-display text-xl font-bold">
              No se puede confirmar la reserva
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

  const precioTotal = Number(cancha.precio_hora) * cantidadHoras;

  const sena = precioTotal * 0.3;

  const pagarAhora = montoPago === "sena" ? sena : precioTotal;

  const saldoRestante = precioTotal - pagarAhora;

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar />

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 md:px-8">
        <button
          type="button"
          onClick={volverDisponibilidad}
          className="flex w-fit items-center gap-1 text-sm font-semibold text-on-surface-variant transition hover:text-primary"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Volver a disponibilidad
        </button>

        <header>
          <h1 className="font-display text-3xl font-bold">Confirmar reserva</h1>

          <p className="mt-2 text-sm text-on-surface-variant">
            Revisá los datos antes de confirmar tu reserva.
          </p>
        </header>

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-error/40 bg-error/10 p-4">
            <span className="material-symbols-outlined text-error">error</span>

            <div>
              <p className="font-semibold text-error">
                No se pudo confirmar la reserva
              </p>

              <p className="mt-1 text-sm text-on-surface-variant">{error}</p>

              <button
                type="button"
                onClick={volverDisponibilidad}
                className="mt-3 text-sm font-semibold text-primary"
              >
                Elegir otro horario
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          {/* IZQUIERDA */}
          <div className="flex flex-col gap-6 lg:col-span-7">
            {/* CANCHA */}
            <section className="overflow-hidden rounded-xl border border-outline-variant bg-surface-low">
              <div className="relative h-52">
                <img
                  src={cancha.imagen}
                  alt={cancha.nombre}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4">
                  <span className="rounded-md bg-primary px-2.5 py-1 text-xs font-bold text-on-primary">
                    {cancha.tipo}
                  </span>

                  <h2 className="mt-2 font-display text-2xl font-bold text-white">
                    {cancha.nombre}
                  </h2>

                  <p className="mt-1 flex items-center gap-1 text-sm text-gray-200">
                    <span className="material-symbols-outlined text-lg">
                      location_on
                    </span>

                    {cancha.ubicacion}
                  </p>
                </div>
              </div>
            </section>

            {/* METODO DE PAGO */}
            <section className="flex flex-col gap-4 rounded-xl border border-outline-variant bg-surface-low p-4 md:p-6">
              <div>
                <h2 className="text-lg font-semibold">Método de pago</h2>

                <p className="mt-1 text-xs text-on-surface-variant">
                  Seleccioná cómo abonarías la reserva.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <OpcionPago
                  valor="efectivo"
                  seleccionado={metodoPago}
                  cambiar={setMetodoPago}
                  icono="payments"
                  texto="Efectivo"
                />

                <OpcionPago
                  valor="transferencia"
                  seleccionado={metodoPago}
                  cambiar={setMetodoPago}
                  icono="account_balance"
                  texto="Transferencia"
                />

                <OpcionPago
                  valor="tarjeta"
                  seleccionado={metodoPago}
                  cambiar={setMetodoPago}
                  icono="credit_card"
                  texto="Tarjeta"
                />
              </div>

              <div className="flex items-start gap-2 rounded-lg bg-surface-highest/60 p-3">
                <span className="material-symbols-outlined text-lg text-primary">
                  info
                </span>

                <p className="text-xs leading-relaxed text-on-surface-variant">
                  En este prototipo no se procesa un pago real. El método
                  seleccionado se utiliza solamente para representar el flujo de
                  reserva.
                </p>
              </div>
            </section>

            {/* MONTO */}
            <section className="flex flex-col gap-4 rounded-xl border border-outline-variant bg-surface-low p-4 md:p-6">
              <h2 className="text-lg font-semibold">Monto a abonar</h2>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <OpcionMonto
                  activo={montoPago === "sena"}
                  onClick={() => setMontoPago("sena")}
                  titulo="Pagar seña"
                  detalle="30% del total"
                  precio={sena}
                />

                <OpcionMonto
                  activo={montoPago === "total"}
                  onClick={() => setMontoPago("total")}
                  titulo="Pagar total"
                  detalle="100% de la reserva"
                  precio={precioTotal}
                />
              </div>
            </section>
          </div>

          {/* RESUMEN */}
          <aside className="flex flex-col gap-4 rounded-xl border border-outline-variant bg-surface-high p-5 lg:sticky lg:top-24 lg:col-span-5">
            <h2 className="border-b border-outline-variant pb-4 text-lg font-semibold">
              Resumen de la reserva
            </h2>

            <DetalleResumen
              icono="stadium"
              titulo="Cancha"
              contenido={cancha.nombre}
              detalle={`${cancha.tipo} · ${cancha.superficie}`}
            />

            <DetalleResumen
              icono="calendar_today"
              titulo="Fecha"
              contenido={formatearFecha(fecha)}
            />

            <DetalleResumen
              icono="schedule"
              titulo="Horario"
              contenido={`${hora} - ${obtenerHoraFinal(hora, cantidadHoras)}`}
              detalle={`${cantidadHoras} ${
                cantidadHoras === 1 ? "hora" : "horas"
              }`}
            />

            <div className="border-t border-outline-variant pt-4">
              <div className="flex justify-between text-sm text-on-surface-variant">
                <span>Precio total</span>

                <span className="font-medium text-on-surface">
                  ${precioTotal.toLocaleString("es-AR")}
                </span>
              </div>

              {montoPago === "sena" && (
                <>
                  <div className="mt-2 flex justify-between text-sm">
                    <span>Seña (30%)</span>

                    <span>${sena.toLocaleString("es-AR")}</span>
                  </div>

                  <div className="mt-2 flex justify-between text-sm text-on-surface-variant">
                    <span>Saldo restante</span>

                    <span>${saldoRestante.toLocaleString("es-AR")}</span>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-outline-variant pt-4">
              <span className="font-semibold">A pagar ahora</span>

              <span className="font-display text-2xl font-bold text-primary">
                ${pagarAhora.toLocaleString("es-AR")}
              </span>
            </div>

            <button
              type="button"
              disabled={procesando}
              onClick={confirmarReserva}
              className="mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 font-semibold text-on-primary transition hover:bg-primary-light active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {procesando ? (
                <>
                  <span className="material-symbols-outlined animate-spin">
                    progress_activity
                  </span>
                  Confirmando...
                </>
              ) : (
                <>
                  Confirmar reserva
                  <span className="material-symbols-outlined">
                    check_circle
                  </span>
                </>
              )}
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}

function OpcionPago({ valor, seleccionado, cambiar, icono, texto }) {
  const activo = seleccionado === valor;

  return (
    <label
      className={`cursor-pointer rounded-lg border p-4 transition ${
        activo
          ? "border-primary bg-surface-high"
          : "border-outline-variant bg-surface-container hover:border-primary/60"
      }`}
    >
      <input
        type="radio"
        name="metodoPago"
        value={valor}
        checked={activo}
        onChange={() => cambiar(valor)}
        className="sr-only"
      />

      <div className="flex flex-col items-center gap-2 text-center">
        <span
          className={`material-symbols-outlined text-2xl ${
            activo ? "text-primary" : "text-on-surface-variant"
          }`}
        >
          {icono}
        </span>

        <span className="text-sm font-medium">{texto}</span>
      </div>
    </label>
  );
}

function OpcionMonto({ activo, onClick, titulo, detalle, precio }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg border p-4 text-left transition ${
        activo
          ? "border-primary bg-surface-high"
          : "border-outline-variant bg-surface-container hover:border-primary/60"
      }`}
    >
      <span
        className={`material-symbols-outlined ${
          activo ? "text-primary" : "text-on-surface-variant"
        }`}
      >
        {activo ? "radio_button_checked" : "radio_button_unchecked"}
      </span>

      <div>
        <p className="text-sm font-semibold">{titulo}</p>

        <p className="mt-0.5 text-xs text-on-surface-variant">{detalle}</p>

        <p className="mt-2 text-xl font-bold text-primary">
          ${precio.toLocaleString("es-AR")}
        </p>
      </div>
    </button>
  );
}

function DetalleResumen({ icono, titulo, contenido, detalle }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <span className="material-symbols-outlined">{icono}</span>
      </div>

      <div>
        <p className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant">
          {titulo}
        </p>

        <p className="mt-1 text-sm font-semibold capitalize">{contenido}</p>

        {detalle && (
          <p className="mt-0.5 text-xs text-on-surface-variant">{detalle}</p>
        )}
      </div>
    </div>
  );
}

function formatearFecha(fecha) {
  if (!fecha) {
    return "-";
  }

  const [año, mes, dia] = fecha.split("-").map(Number);

  return new Date(año, mes - 1, dia).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function obtenerHoraFinal(hora, cantidadHoras) {
  if (!hora) {
    return "-";
  }

  const horaInicio = Number(hora.split(":")[0]);

  const horaFinal = (horaInicio + cantidadHoras) % 24;

  return `${String(horaFinal).padStart(2, "0")}:00`;
}

export default ConfirmarReserva;

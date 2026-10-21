import { useNavigate } from "react-router-dom";

function CanchaCard({
  id,
  nombre,
  ubicacion,
  precio,
  tipo,
  puntuacion,
  superficie,
  servicio,
  imagen,
}) {
  const navigate = useNavigate();

  function verCancha() {
    navigate(`/reserva?canchaId=${id}`);
  }

  return (
    <article
      onClick={verCancha}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-high transition duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_12px_35px_rgba(0,0,0,0.22)]"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={imagen}
          alt={nombre}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />

        <div className="absolute left-3 top-3 rounded-md border border-primary/40 bg-background/80 px-2.5 py-1 backdrop-blur-md">
          <span className="font-label text-xs font-semibold text-primary">
            {tipo}
          </span>
        </div>

        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-md border border-outline-variant bg-background/80 px-2.5 py-1 backdrop-blur-md">
          <span className="material-symbols-outlined fill-icon text-[17px] text-primary">
            star
          </span>

          <span className="font-label text-xs font-semibold text-on-surface">
            {Number(puntuacion).toFixed(1)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-bold text-on-surface">
          {nombre}
        </h3>

        <p className="mt-1 flex items-center gap-1.5 text-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px]">
            location_on
          </span>

          {ubicacion}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="flex items-center gap-1 rounded-md bg-surface px-2.5 py-1 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-primary">
              grass
            </span>

            {superficie}
          </span>

          <span className="flex items-center gap-1 rounded-md bg-surface px-2.5 py-1 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-primary">
              check_circle
            </span>

            {servicio}
          </span>
        </div>

        <div className="mt-6 flex items-end justify-between border-t border-outline-variant/60 pt-4">
          <div>
            <p className="font-label text-xs uppercase text-on-surface-variant">
              Desde
            </p>

            <div className="mt-1 flex items-end gap-1">
              <p className="font-display text-xl font-bold text-primary">
                ${Number(precio).toLocaleString("es-AR")}
              </p>

              <span className="mb-0.5 text-xs text-on-surface-variant">
                / hora
              </span>
            </div>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-on-primary">
            <span className="material-symbols-outlined">arrow_forward</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default CanchaCard;

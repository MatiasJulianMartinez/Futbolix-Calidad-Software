import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const linkClass = ({ isActive }) =>
    `relative py-2 text-sm font-semibold transition-colors ${
      isActive
        ? "text-primary"
        : "text-on-surface-variant hover:text-on-surface"
    }`;

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant/70 bg-surface/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-8 lg:px-12">
        {/* Logo */}
        <Link to="/" onClick={cerrarMenu} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <span className="material-symbols-outlined">sports_soccer</span>
          </div>

          <span className="font-display text-xl font-extrabold italic tracking-tight text-primary">
            Futbolix
          </span>
        </Link>

        {/* Navegación escritorio */}
        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={linkClass}>
            {({ isActive }) => (
              <>
                Inicio
                {isActive && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-primary" />
                )}
              </>
            )}
          </NavLink>

          <NavLink to="/canchas" className={linkClass}>
            {({ isActive }) => (
              <>
                Canchas
                {isActive && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-primary" />
                )}
              </>
            )}
          </NavLink>

          <NavLink to="/mis-reservas" className={linkClass}>
            {({ isActive }) => (
              <>
                Mis Reservas
                {isActive && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-primary" />
                )}
              </>
            )}
          </NavLink>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Notificaciones"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-on-surface-variant transition hover:bg-surface-high hover:text-primary"
          >
            <span className="material-symbols-outlined">notifications</span>

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-surface bg-primary" />
          </button>

          <button
            type="button"
            aria-label="Perfil"
            className="hidden h-10 w-10 items-center justify-center rounded-lg text-on-surface-variant transition hover:bg-surface-high hover:text-primary sm:flex"
          >
            <span className="material-symbols-outlined">account_circle</span>
          </button>

          {/* Hamburguesa mobile */}
          <button
            type="button"
            aria-label="Abrir menú"
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="ml-1 flex h-10 w-10 items-center justify-center rounded-lg text-on-surface-variant transition hover:bg-surface-high hover:text-primary md:hidden"
          >
            <span className="material-symbols-outlined">
              {menuAbierto ? "close" : "menu"}
            </span>
          </button>
        </div>
      </nav>

      {/* Menú mobile */}
      {menuAbierto && (
        <div className="border-t border-outline-variant bg-surface md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-3">
            <NavLink
              to="/"
              onClick={cerrarMenu}
              className={({ isActive }) =>
                `rounded-lg px-3 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-on-surface-variant hover:bg-surface-high hover:text-on-surface"
                }`
              }
            >
              Inicio
            </NavLink>

            <NavLink
              to="/canchas"
              onClick={cerrarMenu}
              className={({ isActive }) =>
                `rounded-lg px-3 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-on-surface-variant hover:bg-surface-high hover:text-on-surface"
                }`
              }
            >
              Canchas
            </NavLink>

            <NavLink
              to="/mis-reservas"
              onClick={cerrarMenu}
              className={({ isActive }) =>
                `rounded-lg px-3 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-on-surface-variant hover:bg-surface-high hover:text-on-surface"
                }`
              }
            >
              Mis Reservas
            </NavLink>

            <button
              type="button"
              className="mt-1 flex items-center gap-2 rounded-lg px-3 py-3 text-left text-sm font-semibold text-on-surface-variant transition hover:bg-surface-high"
            >
              <span className="material-symbols-outlined text-xl">
                account_circle
              </span>
              Mi perfil
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;

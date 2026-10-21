function Footer() {
  return (
    <footer className="border-t border-outline-variant bg-surface-lowest">
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-6 px-4 py-10 md:flex-row md:items-center md:px-8 lg:px-12">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              sports_soccer
            </span>

            <p className="font-display text-xl font-bold text-primary">
              Futbolix
            </p>
          </div>

          <p className="mt-2 text-sm text-on-surface-variant">
            © 2026 Futbolix. Todos los derechos reservados.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-on-surface-variant">
          <span>Reserva de canchas</span>

          <span>Corrientes Capital</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

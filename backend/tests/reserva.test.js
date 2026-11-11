const {
  validarHorario,
  calcularPrecioReserva,
} = require("../src/services/reservaService");

describe("Pruebas del servicio de reservas", () => {
  test("permite reservar en un horario válido", () => {
    const resultado = validarHorario(20);

    expect(resultado).toBe(true);
  });

  test("rechaza un horario fuera del rango permitido", () => {
    const resultado = validarHorario(2);

    expect(resultado).toBe(false);
  });

  test("calcula correctamente el precio de una reserva", () => {
    const resultado = calcularPrecioReserva(2, 10000);

    expect(resultado).toBe(20000);
  });

  test("rechaza una cantidad de horas inválida", () => {
    const resultado = calcularPrecioReserva(0, 10000);

    expect(resultado).toBeNull();
  });
  test("permite reservar a las 8", () => {
    expect(validarHorario(8)).toBe(true);
  });

  test("permite reservar a las 23", () => {
    expect(validarHorario(23)).toBe(true);
  });

  test("rechaza un horario sin indicar", () => {
    expect(validarHorario()).toBe(false);
  });
});

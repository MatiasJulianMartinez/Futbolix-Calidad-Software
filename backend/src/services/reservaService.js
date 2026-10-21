function validarHorario(hora) {
    if (hora < 8 || hora > 23) {
        return false;
    }

    return true;
}

function calcularPrecioReserva(cantidadHoras, precioHora) {
    if (cantidadHoras <= 0 || precioHora <= 0) {
        return null;
    }

    return cantidadHoras * precioHora;
}

module.exports = {
    validarHorario,
    calcularPrecioReserva
};
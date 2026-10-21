const { getDatabase } = require('../config/database');

async function obtenerCanchas() {
    const db = getDatabase();

    return await db.all(`
        SELECT *
        FROM canchas
        ORDER BY nombre ASC
    `);
}

async function obtenerCanchaPorId(id) {
    const db = getDatabase();

    return await db.get(
        `
        SELECT *
        FROM canchas
        WHERE id = ?
        `,
        [id]
    );
}

async function obtenerCanchasDestacadas() {
    const db = getDatabase();

    return await db.all(`
        SELECT *
        FROM canchas
        WHERE destacada = 1
        ORDER BY puntuacion DESC
        LIMIT 3
    `);
}

module.exports = {
    obtenerCanchas,
    obtenerCanchaPorId,
    obtenerCanchasDestacadas
};
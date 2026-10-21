const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

let db;

async function initDatabase() {
    const databaseDir = path.join(__dirname, '../../database');

    fs.mkdirSync(databaseDir, {
        recursive: true
    });

    db = await open({
        filename: path.join(databaseDir, 'futbolix.db'),
        driver: sqlite3.Database
    });

    await db.exec(`
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS canchas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            ubicacion TEXT NOT NULL,
            precio_hora REAL NOT NULL,
            tipo TEXT NOT NULL,
            imagen TEXT NOT NULL,
            puntuacion REAL NOT NULL DEFAULT 0,
            superficie TEXT NOT NULL,
            servicio TEXT NOT NULL,
            destacada INTEGER NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS reservas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cancha_id INTEGER NOT NULL,
            fecha TEXT NOT NULL,
            hora INTEGER NOT NULL,
            cantidad_horas INTEGER NOT NULL,
            precio_total REAL NOT NULL,
            FOREIGN KEY (cancha_id) REFERENCES canchas(id)
        );
    `);

    await db.run(
        `
        INSERT OR IGNORE INTO canchas (
            id,
            nombre,
            ubicacion,
            precio_hora,
            tipo,
            imagen,
            puntuacion,
            superficie,
            servicio,
            destacada
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            1,
            'Cancha Norte',
            'Corrientes Capital',
            10000,
            'F5',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCTYZ-40HElKEP8P3Ix_mr3Rd61-gaQZWRuU1wIRCobNKR7PFz1SW_mSDSDX69H25Ey_5oZwnnjp0-MSKqkaBwf20tGyUFglK48LZQUloFdV3W00fCuCuyTHGkip7GAMueRGtFQmy3AMi5P93KQw7yd_2UNr2nagqlU1dCbVCKXP0IxKcDnZklVyztVNvvJQ9QVnmZdYDKaiqawP1sAu2o_zWMiyHhdH_p76z3UU7rbKPxGxtqE-ffApQ',
            4.8,
            'Sintético Premium',
            'Iluminación LED',
            1
        ]
    );

    await db.run(
        `
        INSERT OR IGNORE INTO canchas (
            id,
            nombre,
            ubicacion,
            precio_hora,
            tipo,
            imagen,
            puntuacion,
            superficie,
            servicio,
            destacada
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            2,
            'Cancha Central',
            'Corrientes Capital',
            12000,
            'F7',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCKBZBoLV9ug5P-6K3SHd1nG9qq8-peUPVRzyEJLDmbt9TF2x8tDpt1KID5kyP7kh71GtdA3sS3oQ7WOyvqIZrbocuu48SGzrtywmb_Z4yDfjuOlOY0tf5Uuo_xRB8jPJ7oE333yBKlwW6DRM9B-Lyx_6trsgVXcack3UK3yTN3EwmCOtvRvQDeeDAqnxKO1LL_whA8PoBNyARgXyp-u88XSw3V4iIs9Vd06wE10ef66kymZv7HFnJTlw',
            4.9,
            'Caucho Nuevo',
            'Vestuarios',
            1
        ]
    );

    await db.run(
        `
        INSERT OR IGNORE INTO canchas (
            id,
            nombre,
            ubicacion,
            precio_hora,
            tipo,
            imagen,
            puntuacion,
            superficie,
            servicio,
            destacada
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            3,
            'Cancha Sur',
            'Corrientes Capital',
            9000,
            'F11',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBj8iwIbgxz2OZKTM4jyv-45ECzKl30G_vTYVMGpGw9QbYSi02Gd8wqo4ZVpIgyJtct8Gg3q1HkVNr3u_CUiYftWe5QPz_kl2rwHVVuDGg36P8yC7nIAEhWo4ZVhtZ41dvRBUNgS7SptBM7zlQY161B_EUEYiEFgp1W7taHZcm3_FwemSliK-RcMAXRLLvfNCdx-l01b-w50r6TI26TDIniPCMwrdj6goWz5iwp5yODCK3In5NBPr1wEA',
            4.7,
            'Césped Natural',
            'Estacionamiento',
            1
        ]
    );

    console.log('Base de datos conectada');
}

function getDatabase() {
    return db;
}

module.exports = {
    initDatabase,
    getDatabase
};
const app = require('./app');
const { initDatabase } = require('./config/database');

const PORT = 3000;

async function iniciarServidor() {
    try {
        await initDatabase();

        app.listen(PORT, () => {
            console.log(`Servidor funcionando en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error.message);
        process.exit(1);
    }
}

iniciarServidor();
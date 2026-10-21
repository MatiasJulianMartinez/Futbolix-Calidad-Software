# Futbolix - Calidad de Software

Proyecto utilizado para el Trabajo Práctico 1 de la materia **Calidad de Software**.

## Tecnologías

- React + Vite + Tailwind CSS
- Node.js + Express
- SQLite
- Jest

## Pruebas unitarias

Las pruebas se encuentran en:

```text
backend/tests/reserva.test.js
```

Las funciones probadas están en:

```text
backend/src/services/reservaService.js
```

Se ejecutan **4 pruebas unitarias** relacionadas con validación de horarios y cálculo del precio de una reserva.

## Cómo ejecutar las pruebas

```bash
cd backend
npm install
npm test
```

Resultado esperado:

```text
Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
```

## Cómo ejecutar el proyecto

### Backend

```bash
cd backend
npm install
npm start
```

Servidor:

```text
http://localhost:3000
```

### Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Abrir la dirección indicada por Vite, normalmente:

```text
http://localhost:5173
```

## Autor

**Matias Julian Martinez**  
Materia: **Calidad de Software**  
Comisión: **ACN6AV**

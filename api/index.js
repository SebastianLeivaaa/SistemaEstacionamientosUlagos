import express from "express";
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();
const app = express();

//CONEXION A LA BASE DE DATOS
let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: 'require',
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

const port = 3090;

app.listen(port, async () => {
  try {
    console.log(`Server listening on port ${port}`);
    // CONSULTA PARA COMPROBAR QUE SE CONECTO CORRECTAMENTE
    const resultadoConsulta = await sql`SELECT * FROM EDIFICIO`;
    console.log('Consulta exitosa:', resultadoConsulta);
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
});

import express from "express";
import postgres from "postgres";
import dotenv from "dotenv";
import cors from "cors";
import { sendCodeEmail } from "../src/utils/mailer.js";
import { generatorCode } from "../src/utils/generatorCode.js";

dotenv.config();
const app = express();

//CONEXION A LA BASE DE DATOS
let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const SENDER_EMAIL_ID = "estacionamientosulagos@gmail.com";


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
app.use(cors());
app.use(express.json());

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

//Consulta para verificar si el usuario existe en la base de datos
app.post("/api/query-user-exists", async (req, res) => {
  const { userRut, userEmail, userPhone, userDomain } = req.body;
  const userFullEmail = `${userEmail}${userDomain}`

  try {
    const resultRut = await sql`select * from usuario where usua_rut = ${userRut}`;
    const resultEmail = await sql`select * from usuario where usua_correo = ${userFullEmail}`;
    const resultPhone = await sql`select * from usuario where usua_telefono = ${userPhone}`

    res.send({infoRut: resultRut, infoEmail: resultEmail, infoPhone: resultPhone});
  } catch (error) {
    res.send(error);
  }
})

//Consulta para enviar un correo electronico a tu cuenta
app.post("/api/send-email", async (req, res) => {
  const { userEmail, userDomain } = req.body;
  const fullUserEmail = `${userEmail}${userDomain}`;

  try {
    if (SENDER_EMAIL_ID === "EMAIL_ID") {
      throw new Error(
        "Please update SENDER_EMAIL_ID with your email id in server.js"
      );
    }
    const code = generatorCode();
    const info = await sendCodeEmail(code, fullUserEmail);
    res.send({ info: info, code: code });
  } catch (error) {
    res.send(error);
  }
});

//INSERTAR USUARIO EN LA BASE DE DATOS
app.post("/api/register-user", async (req, res) => {
  const { userName, userLastNamePat, userLastNameMat, userRut, userEmail, userPhone, userType, userDomain, password, vehiclePatente, vehicleMarca, vehicleModelo, vehicleYear, vehicleType, vehicleColor } = req.body;

  const fullUserEmail = `${userEmail}${userDomain}`;
  try {
    const existingVehicle = await sql`SELECT * FROM vehiculo WHERE vehi_patente = ${vehiclePatente}`;
    if (existingVehicle.length > 0) {
      const insertUser = await sql`insert into usuario(usua_nombre, usua_apellido_paterno, usua_apellido_materno, usua_rut, usua_correo, usua_clave, usua_telefono, usua_tipo) 
                                  values(${userName}, ${userLastNamePat}, ${userLastNameMat}, ${userRut}, ${fullUserEmail}, ${password}, ${userPhone}, ${userType})`;
      const insertRegistroUsuarioVehiculo = await sql`insert into registrousuariovehiculo(regi_usua_rut, regi_vehi_patente)
                                                      values (${userRut}, ${vehiclePatente})`;
    } else{
      const insertUser = await sql`insert into usuario(usua_nombre, usua_apellido_paterno, usua_apellido_materno, usua_rut, usua_correo, usua_clave, usua_telefono, usua_tipo) 
                                  values(${userName}, ${userLastNamePat}, ${userLastNameMat}, ${userRut}, ${fullUserEmail}, ${password}, ${userPhone}, ${userType})`;
      const insertVehicle = await sql`insert into vehiculo(vehi_patente, vehi_marca, vehi_modelo, vehi_anio, vehi_tipo, vehi_color) 
                                      values(${vehiclePatente}, ${vehicleMarca}, ${vehicleModelo}, ${vehicleYear}, ${vehicleType}, ${vehicleColor})`;
      const insertRegistroUsuarioVehiculo = await sql`insert into registrousuariovehiculo(regi_usua_rut, regi_vehi_patente)
                                                      values (${userRut}, ${vehiclePatente})`;
    }
    res.status(200).send('Registro insertado con éxito');
  } catch (err) {
    console.error('Error al insertar el registro:', err);
    res.status(500).send('Error al insertar el registro');
  }
});
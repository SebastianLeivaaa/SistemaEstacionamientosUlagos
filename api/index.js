import express from "express";
import postgres from "postgres"; 
import dotenv from "dotenv"; 
import cors from "cors"; 
import jwt from 'jsonwebtoken'; 
import { serialize } from 'cookie';
import cookieParser from 'cookie-parser';
import {generatorCode} from '../src/utils/generatorCode.js'
import {sendCodeEmail} from '../src/utils/mailer.js'



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
app.use(cors({
  origin: 'http://localhost:5173', // Origen permitido
  credentials: true // Permitir envío de credenciales
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.listen(port, async () => {
  try {
    console.log(`Server listening on port ${port}`);
    // CONSULTA PARA COMPROBAR QUE SE CONECTO CORRECTAMENTE
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

//Consulta para enviar un correo electronico a tu cuenta para recuperar la contraseña
app.post("/api/send-email-recover", async (req, res) => {
  const { userEmail, userDomain } = req.body;
  const fullUserEmail = `${userEmail}${userDomain}`;

  try {
    const resultUserExists = await sql`select * from usuario where usua_correo = ${fullUserEmail}`;
    if (resultUserExists.length > 0) {
      if (SENDER_EMAIL_ID === "EMAIL_ID") {
        throw new Error(
          "Please update SENDER_EMAIL_ID with your email id in server.js"
        );
      }
      const code = generatorCode();
      const info = await sendCodeEmail(code, fullUserEmail);
      res.send({ success: true, info: info, code: code });
    } else {
      res.status(404).send({ success: false, message: "El correo electrónico no está registrado en la base de datos" });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: "Error en el servidor", error: error.message });
  }
});

//inicio de sesión
app.post('/api/sesion', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar guardia primero
    const guards = await sql`SELECT * FROM guardia WHERE guar_correo = ${email}`;
    if (guards.length > 0) {
      const guard = guards[0];
      if (password === guard.guar_clave) {
        const token = jwt.sign({ userEmail: guard.guar_correo, userName: guard.guar_nombre, userLastNamePat: guard.guar_apellido_paterno, userLastNameMat: guard.guar_apellido_materno, IsGuard: true }, process.env.SECRET, { expiresIn: '15m' });
        const serialized = serialize('myTokenName', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 900, // 15 minutos
          path: '/'
        });
        res.setHeader('Set-Cookie', serialized);
        return res.json('guardia'); // Retorna 'guardia' si el inicio de sesión es exitoso
      }
    }

    // Buscar usuario
    const users = await sql`SELECT * FROM usuario WHERE usua_correo = ${email}`;
    if (users.length > 0) {
      const user = users[0];
      if (password === user.usua_clave) {
        const token = jwt.sign({ userEmail: user.usua_correo, userName: user.usua_nombre, userLastNamePat: user.usua_apellido_paterno, userLastNameMat: user.usua_apellido_materno, IsGuard: false }, process.env.SECRET, { expiresIn: '15m' });
        const serialized = serialize('myTokenName', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 900, // 15 minutos
          path: '/'
        });
        res.setHeader('Set-Cookie', serialized);
        return res.json('usuario'); // Retorna 'usuario' si el inicio de sesión es exitoso
      }
    }

    res.status(401).json({ error: 'Correo electrónico o contraseña incorrectos' });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error en el servidor' });
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
      const insertRegistroUsuarioVehiculo = await sql`insert into registrousuariovehiculo(regi_usua_rut, regi_vehi_patente, regi_estado)
                                                      values (${userRut}, ${vehiclePatente}, 'activo')`;
    }
    res.status(200).send('Registro insertado con éxito');
  } catch (err) {
    console.error('Error al insertar el registro:', err);
    res.status(500).send('Error al insertar el registro');
  }
});

//ACTUALIZAR LA NUEVA CLAVE DEL USUARIO
app.post("/api/update-password", async (req, res) => {
  const { userEmail, userDomain, password } = req.body;
  const fullUserEmail = `${userEmail}${userDomain}`;

  try {
    const updatePassword = await sql`update usuario set usua_clave = ${password} where usua_correo = ${fullUserEmail}`;
    res.status(200).send('Contraseña actualizada con éxito');
  } catch (error) {
    res.status(500).send('Error al actualizar la contraseña');
  }

});

//consulta para obtener los estacionamientos
app.get('/api/parkingSpaces', async (req, res) => {
  try {
    const parkingSpaces = await sql`SELECT COUNT(*) AS total_libres FROM estacionamiento WHERE esta_estado = 'LIBRE'`;
    res.json({total_libres: parkingSpaces[0].total_libres});
  } catch (error) {
    console.error('Error al obtener los estacionamientos:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});


//login
app.get('/api/login', async (req, res) => {
  const myTokenName = req.cookies.myTokenName;
  try{
    const user = jwt.verify(myTokenName, process.env.SECRET);
    return res.json({
      email: user.userEmail,
      username: user.userName,
      userLastNamePat: user.userLastNamePat,
      userLastNameMat: user.userLastNameMat,
      Isguard: user.Isguard,
    });
  }catch(error){
    console.error('Error al verificar el token:', error);
    return res.status(401).json({ error: "invalid token"})
  }
});

//logout
app.get('/api/logout', async (req, res) => {
  const myTokenName = req.cookies.myTokenName;
  if(!myTokenName){
    return res.status(401).json({error: 'no token'}) 
  }
  try{
    jwt.verify(myTokenName, process.env.SECRET);
    const serialized = serialize('myTokenName', null, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    });
    res.setHeader('Set-Cookie', serialized);
    res.status(200).json('logout succesfully')

  }catch(error){
    return res.status(401).json({ error: "invalid token"})
  }
});
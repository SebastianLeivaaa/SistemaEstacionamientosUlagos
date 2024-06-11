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

//Consulta para ir eliminando las reservas que expiran
const deleteExpiredReservas = async () => {

  try {
    await sql`DELETE FROM reserva
                WHERE rese_estado = 'EN ESPERA'
                AND (rese_fecha + rese_hora_inicio <= NOW() - INTERVAL '30 minutes');`;
  } catch (err) {
    console.error('Error deleting expired reservations:', err);
  }
};

setInterval(deleteExpiredReservas, 60 * 1000);

//Consulta para verificar si el usuario existe en la base de datos
app.post("/api/query-user-exists", async (req, res) => {
  const { userRut, userEmail, userPhone, userDomain } = req.body;
  const userFullEmail = `${userEmail}${userDomain}`

  try {
    const resultRut = await sql`select * from usuario where usua_rut = ${userRut.toUpperCase()}`;
    const resultEmail = await sql`select * from usuario where usua_correo = ${userFullEmail.toLowerCase()}`;
    const resultPhone = await sql`select * from usuario where usua_telefono = ${userPhone}`

    res.send({infoRut: resultRut, infoEmail: resultEmail, infoPhone: resultPhone});
  } catch (error) {
    res.send(error);
  }
})

//Consulta para enviar un correo electronico a tu cuenta
app.post("/api/send-email", async (req, res) => {
  const { userEmail, userDomain } = req.body;
  const fullUserEmail = `${userEmail.toLowerCase()}${userDomain}`;

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
  const fullUserEmail = `${userEmail.toLowerCase()}${userDomain}`;

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
    //console.log("llego esto: ",email, password)

    // Buscar guardia primero
    const guards = await sql`SELECT * FROM guardia WHERE guar_correo = ${email}`;
    if (guards.length > 0) {
      const guard = guards[0];
      if (password === guard.guar_clave) {
        const token = jwt.sign({ userEmail: guard.guar_correo, userName: guard.guar_nombre, userLastNamePat: guard.guar_apellido_paterno, userLastNameMat: guard.guar_apellido_materno, userRut: guard.guar_rut, IsGuard: true }, process.env.SECRET, { expiresIn: '15m' });
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
        const token = jwt.sign({ userEmail: user.usua_correo, userName: user.usua_nombre, userLastNamePat: user.usua_apellido_paterno, userLastNameMat: user.usua_apellido_materno, userRut: user.usua_rut, IsGuard: false }, process.env.SECRET, { expiresIn: '15m' });
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

  const fullUserEmail = `${userEmail.toLowerCase()}${userDomain}`;
  try {
    const existingVehicle = await sql`SELECT * FROM vehiculo WHERE vehi_patente = ${vehiclePatente.toUpperCase()}`;
    if (existingVehicle.length > 0) {
      const insertUser = await sql`insert into usuario(usua_nombre, usua_apellido_paterno, usua_apellido_materno, usua_rut, usua_correo, usua_clave, usua_telefono, usua_tipo) 
                                  values(${userName}, ${userLastNamePat}, ${userLastNameMat}, ${userRut.toUpperCase()}, ${fullUserEmail}, ${password}, ${userPhone}, ${userType})`;
      const insertRegistroUsuarioVehiculo = await sql`insert into registrousuariovehiculo(regi_usua_rut, regi_vehi_patente, regi_estado)
                                                      values (${userRut.toUpperCase()}, ${vehiclePatente.toUpperCase()}, 'activo')`;
    } else{
      const insertUser = await sql`insert into usuario(usua_nombre, usua_apellido_paterno, usua_apellido_materno, usua_rut, usua_correo, usua_clave, usua_telefono, usua_tipo) 
                                  values(${userName}, ${userLastNamePat}, ${userLastNameMat}, ${userRut.toUpperCase()}, ${fullUserEmail}, ${password}, ${userPhone}, ${userType})`;
      const insertVehicle = await sql`insert into vehiculo(vehi_patente, vehi_marca, vehi_modelo, vehi_anio, vehi_tipo, vehi_color) 
                                      values(${vehiclePatente.toUpperCase()}, ${vehicleMarca}, ${vehicleModelo}, ${vehicleYear}, ${vehicleType}, ${vehicleColor})`;
      const insertRegistroUsuarioVehiculo = await sql`insert into registrousuariovehiculo(regi_usua_rut, regi_vehi_patente, regi_estado)
                                                      values (${userRut.toUpperCase()}, ${vehiclePatente.toUpperCase()}, 'activo')`;
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
  const fullUserEmail = `${userEmail.toLowerCase()}${userDomain}`;

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

//Consulta para ovbener los vehiculos
app.post('/api/get-vehicles', async (req, res) => {
  const { userRut } = req.body;

  try {
    const vehicles = await sql`
      SELECT v.vehi_patente, v.vehi_marca, v.vehi_modelo, v.vehi_anio, v.vehi_color, v.vehi_tipo, r.regi_estado, r.regi_usua_rut
        FROM registrousuariovehiculo r
        INNER JOIN vehiculo v ON r.regi_vehi_patente = v.vehi_patente
        WHERE r.regi_usua_rut = ${userRut.toUpperCase()}
    `;
    res.json(vehicles);
  } catch (error) {
    console.error('Error al obtener los vehículos:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

//Consulta para cambiar el estado del vehiculo
app.put('/api/change-state-vehicle', async (req, res) => {
  const { patente, estado, userRut } = req.body;

  try {
    const selectVehicle = await sql`SELECT * FROM registrousuariovehiculo WHERE regi_estado = 'activo' AND regi_usua_rut = ${userRut.toUpperCase()}`;

    if (selectVehicle.count > 0 && estado === 'activo') {
      res.status(400).send('Ya existe un vehículo activo para este usuario');
    } else {
      const updateVehicle = await sql`UPDATE registrousuariovehiculo SET regi_estado = ${estado} WHERE regi_vehi_patente = ${patente.toUpperCase()}`;
      res.status(200).send('Estado del vehículo actualizado con éxito');
    }
  } catch (error) {
    console.error('Error al cambiar el estado del vehículo:', error);
    res.status(500).send('Error al cambiar el estado del vehículo');
  }
});

//Consulta para eliminar un vehiculo
app.delete('/api/delete-vehicle', async (req, res) => {
  const { patente, userRut } = req.body;

  try {
    const deleteVehicle = await sql`DELETE FROM registrousuariovehiculo WHERE regi_vehi_patente = ${patente.toUpperCase()} AND regi_usua_rut = ${userRut.toUpperCase()}`;
    res.status(200).send('Vehículo eliminado con éxito');
  } catch (error) {
    console.error('Error al eliminar el vehículo:', error);
    res.status(500).send('Error al eliminar el vehículo');
  }
});

//Consulta para agregar un nuevo vehiculo
app.post('/api/add-new-vehicle', async (req, res) => {
  const { patente, userRut } = req.body;

  try {
    // Agregar vehículo a la tabla 'vehiculo'
    const existingVehicle = await sql`SELECT * FROM vehiculo WHERE vehi_patente = ${patente.toUpperCase()}`;
    const existingRegister = await sql`SELECT * FROM registrousuariovehiculo WHERE regi_vehi_patente = ${patente.toUpperCase()} AND regi_usua_rut = ${userRut.toUpperCase()}`

    if(existingVehicle.length > 0){
      if(existingRegister.length > 0){
        res.status(500).json({ error: 'Ya tiene un registro asociado a la patente ingresada' });
      } else {
        const addRegister = await sql`
          INSERT INTO registrousuariovehiculo (regi_vehi_patente, regi_usua_rut, regi_estado) 
          VALUES (${patente.toUpperCase()}, ${userRut.toUpperCase()}, 'inactivo')
        `;
        res.status(200).json({ message: 'Vehículo agregado exitosamente' });
      }
    }else{
      const addVehicle = await sql`
        INSERT INTO vehiculo (VEHI_PATENTE) 
        VALUES (${patente.toUpperCase()})
      `;
      const addRegister = await sql`
          INSERT INTO registrousuariovehiculo (regi_vehi_patente, regi_usua_rut, regi_estado) 
          VALUES (${patente.toUpperCase()}, ${userRut.toUpperCase()}, 'inactivo')
        `;
      res.status(200).json({ message: 'Vehículo agregado exitosamente' });
    }
  } catch (error) {
    console.error('Error al agregar el vehículo:', error);
    res.status(500).json({ error: 'Error al agregar el vehículo' });
  }
});

//Consulta para obtener el historial de las reservas por usuario
app.post('/api/get-record-reservation', async (req, res) => {
  const { userRut } = req.body;

  try {
    const recordReservation = await sql`
      SELECT r.rese_vehi_patente, r.rese_hora_llegada, r.rese_hora_salida, r.rese_fecha, e.esta_numero 
        FROM reserva r
        INNER JOIN estacionamiento e ON r.rese_esta_id = e.esta_id
        WHERE rese_usua_rut = ${userRut.toUpperCase()} AND rese_estado != 'EN ESPERA'
        ORDER BY r.rese_fecha DESC, r.rese_hora_llegada DESC
    `;
    res.json(recordReservation);
  } catch (error) {
    console.error('Error al obtener los vehículos:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

//Consulta para obtener la reserva vigente del usuario
app.post('/api/get-current-reservation', async (req, res) => {
  const { userRut } = req.body;

  try {
    const currentReservation = await sql`
      SELECT r.rese_vehi_patente, r.rese_fecha, e.esta_numero, (r.rese_hora_inicio + INTERVAL '30 minutes') AS rese_hora_inicio
        FROM reserva r
        INNER JOIN estacionamiento e ON r.rese_esta_id = e.esta_id
        WHERE rese_usua_rut = ${userRut.toUpperCase()} AND rese_estado = 'EN ESPERA'
    `;
    res.json(currentReservation);
  } catch (error) {
    console.error('Error al obtener los vehículos:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

//Consulta para eliminar una reserva
app.post('/api/delete-reservation', async (req, res) => {
  const { userRut } = req.body;

  try {
    const deleteReservation = await sql`DELETE FROM reserva WHERE rese_usua_rut = ${userRut.toUpperCase()} AND rese_estado = 'EN ESPERA'`;
    res.status(200).send('Reserva eliminada con éxito');
  } catch (error) {
    console.error('Error al eliminar la reserva:', error);
    res.status(500).send('Error al eliminar la reserva');
  }
});

//Consulta para liberar una reserva por patente
app.post('/api/release-reservation', async (req, res) => {
  const { vehiclePatente } = req.body;

  try {
    // Verificar si la patente existe'
    const timeFormat = await sql`SET TIME ZONE 'America/Santiago'`
    const [existingReservation] = await sql`SELECT * FROM reserva WHERE rese_vehi_patente = ${vehiclePatente} AND rese_hora_salida IS NULL AND rese_estado = 'CONFIRMADA'`;
    if (!existingReservation) {
      return res.status(404).send('No se encontró una reserva con la patente proporcionada');
    }
    //se libera el estacionamiento y se actualiza la hora de salida de la reserva
    await sql`UPDATE estacionamiento SET esta_estado = 'LIBRE' WHERE esta_id = ${existingReservation.rese_esta_id}`;
    await sql`UPDATE reserva SET rese_hora_salida = TO_CHAR(NOW(), 'HH24:MI:SS')::time WHERE rese_vehi_patente = ${vehiclePatente} AND rese_hora_salida IS NULL`;

    res.status(200).send(existingReservation.rese_esta_id.slice(-2));
  } catch (error) {
    console.error('Error al eliminar la reserva:', error);
    res.status(500).send('Error al eliminar la reserva');
  }
});

//Consulta para obtener el historial de las reservas por patente
app.post('/api/get-record-reservation-by-patente', async (req, res) => {
  const { vehiclePatente, date } = req.body;
  try {

    let existingVehicle = await sql`SELECT * FROM vehiculo WHERE vehi_patente = ${vehiclePatente.toUpperCase()}`;
    if(existingVehicle.length === 0){
      res.status(500).json({ message: 'El vehículo no se encuentra registrado en la base de datos' });
    } else{
      let query = sql`
          SELECT r.rese_usua_rut, r.rese_hora_llegada, r.rese_vehi_patente, r.rese_hora_salida, r.rese_fecha, e.esta_numero, u.usua_nombre, u.usua_apellido_paterno, u.usua_apellido_materno, u.usua_tipo
            FROM reserva r
            INNER JOIN estacionamiento e ON r.rese_esta_id = e.esta_id
            INNER JOIN usuario u ON u.usua_rut = r.rese_usua_rut
            WHERE rese_vehi_patente = ${vehiclePatente.toUpperCase()} AND rese_estado = 'CONFIRMADA'
            ORDER BY r.rese_fecha DESC, r.rese_hora_llegada DESC
      `;

      if (date) {
        query = sql`
        SELECT r.rese_usua_rut, r.rese_hora_llegada, r.rese_vehi_patente, r.rese_hora_salida, r.rese_fecha, e.esta_numero, u.usua_nombre, u.usua_apellido_paterno, u.usua_apellido_materno, u.usua_tipo
          FROM reserva r
          INNER JOIN estacionamiento e ON r.rese_esta_id = e.esta_id
          INNER JOIN usuario u ON u.usua_rut = r.rese_usua_rut
          WHERE rese_vehi_patente = ${vehiclePatente.toUpperCase()} AND rese_estado = 'CONFIRMADA' AND rese_fecha = ${date}
          ORDER BY r.rese_fecha DESC, r.rese_hora_llegada DESC`;
      }


      const recordReservation = await query;

      if(recordReservation.length === 0){
        if(date){
          res.status(500).json({ message: 'No se encontraron registros asociados a la patente ingresada y la fecha seleccionada' });
        }else{
          res.status(500).json({ message: 'No se encontraron registros asociados a la patente ingresada' });
        }
      }else{
        res.json(recordReservation);
      }
    }
  } catch (error) {
    console.error('Error al obtener el historial:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

//Consulta para obtener el historial de las reservas por rut
app.post('/api/get-record-reservation-by-rut', async (req, res) => {
  const { rut, date } = req.body;
  try {

    let existingUser = await sql`SELECT * FROM usuario WHERE usua_rut = ${rut}`;
    if(existingUser.length === 0){
      res.status(500).json({ message: 'El usuario no se encuentra registrado en la base de datos' });
    } else{
      let query = sql`
          SELECT r.rese_usua_rut, r.rese_hora_llegada, r.rese_vehi_patente, r.rese_hora_salida, r.rese_fecha, e.esta_numero, u.usua_nombre, u.usua_apellido_paterno, u.usua_apellido_materno, u.usua_tipo
            FROM reserva r
            INNER JOIN estacionamiento e ON r.rese_esta_id = e.esta_id
            INNER JOIN usuario u ON u.usua_rut = r.rese_usua_rut
            WHERE rese_usua_rut = ${rut} AND rese_estado = 'CONFIRMADA'
            ORDER BY r.rese_fecha DESC, r.rese_hora_llegada DESC
      `;

      if (date) {
        query = sql`
        SELECT r.rese_usua_rut, r.rese_hora_llegada, r.rese_vehi_patente, r.rese_hora_salida, r.rese_fecha, e.esta_numero, u.usua_nombre, u.usua_apellido_paterno, u.usua_apellido_materno, u.usua_tipo
          FROM reserva r
          INNER JOIN estacionamiento e ON r.rese_esta_id = e.esta_id
          INNER JOIN usuario u ON u.usua_rut = r.rese_usua_rut
          WHERE rese_usua_rut = ${rut} AND rese_estado = 'CONFIRMADA' AND rese_fecha = ${date}
          ORDER BY r.rese_fecha DESC, r.rese_hora_llegada DESC`;
      }


      const recordReservation = await query;

      if(recordReservation.length === 0){
        if(date){
          res.status(500).json({ message: 'No se encontraron registros asociados al RUT ingresado y la fecha seleccionada' });
        }else{
          res.status(500).json({ message: 'No se encontraron registros asociados al RUT ingresado' });
        }
      }else{
        res.json(recordReservation);
      }
    }
  } catch (error) {
    console.error('Error al obtener el historial:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

//Consulta para obtener el historial de las reservas por fecha
app.post('/api/get-record-reservation-by-date', async (req, res) => {
  const { date } = req.body;
  try {

      let query = sql`
          SELECT r.rese_usua_rut, r.rese_hora_llegada, r.rese_vehi_patente, r.rese_hora_salida, r.rese_fecha, e.esta_numero, u.usua_nombre, u.usua_apellido_paterno, u.usua_apellido_materno, u.usua_tipo
            FROM reserva r
            INNER JOIN estacionamiento e ON r.rese_esta_id = e.esta_id
            INNER JOIN usuario u ON u.usua_rut = r.rese_usua_rut
            WHERE rese_fecha = ${date} AND rese_estado = 'CONFIRMADA'
            ORDER BY r.rese_fecha DESC, r.rese_hora_llegada DESC
      `;


      const recordReservation = await query;

      if(recordReservation.length === 0){
        res.status(500).json({ message: 'No se encontraron registros asociados a la fecha seleccionada' });
      }else{
        res.json(recordReservation);
      }
    
  } catch (error) {
    console.error('Error al obtener el historial:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

//Consulta para obtener la reserva activa del usuario mediante el rut
app.post('/api/get-active-reservation-by-rut', async (req, res) => {
  const { rut, codVerificador } = req.body;
  const rutUser = `${rut}-${codVerificador}`

  try {
    const activeReservation = await sql`
      SELECT r.rese_id, r.rese_usua_rut, r.rese_vehi_patente, e.esta_numero, e.esta_id, r.rese_fecha, u.usua_nombre, u.usua_apellido_paterno, u.usua_apellido_materno, u.usua_tipo, (r.rese_hora_inicio + INTERVAL '30 minutes') AS rese_hora_max
        FROM reserva r
        INNER JOIN estacionamiento e ON r.rese_esta_id = e.esta_id
        INNER JOIN usuario u ON u.usua_rut = r.rese_usua_rut
        WHERE rese_usua_rut = ${rutUser.toUpperCase()} AND rese_estado = 'EN ESPERA'
    `;
    if(activeReservation.length === 0){
      res.status(500).json({ message: 'No se encontró una reserva activa asociado a este rut' });
    }else{
      res.json(activeReservation);
    }
  } catch (error) {
    console.error('Error al obtener la reserva activa:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

//Consulta para obtener la reserva activa del usuario mediante codigo qr
app.post('/api/get-active-reservation-by-qr', async (req, res) => {
  const { rutUser } = req.body;
  try {
    const activeReservation = await sql`
      SELECT r.rese_id, r.rese_usua_rut, r.rese_vehi_patente, e.esta_numero, e.esta_id, r.rese_fecha, u.usua_nombre, u.usua_apellido_paterno, u.usua_apellido_materno, u.usua_tipo, (r.rese_hora_inicio + INTERVAL '30 minutes') AS rese_hora_max
        FROM reserva r
        INNER JOIN estacionamiento e ON r.rese_esta_id = e.esta_id
        INNER JOIN usuario u ON u.usua_rut = r.rese_usua_rut
        WHERE rese_usua_rut = ${rutUser.toUpperCase()} AND rese_estado = 'EN ESPERA'
    `;
    if(activeReservation.length === 0){
      res.status(500).json({ message: 'No se encontró una reserva activa asociado a este rut' });
    }else{
      res.json(activeReservation);
    }
  } catch (error) {
    console.error('Error al obtener la reserva activa:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});
//Consulta para confirmar la reserva del usuario
app.post('/api/confirm-reservation', async (req, res) => {
  const { record, userRut } = req.body;

  try {
    const timeFormat = await sql`SET TIME ZONE 'America/Santiago'`

    const updateReservation = await sql`
      UPDATE reserva
        SET rese_estado = 'CONFIRMADA', rese_guar_rut = ${userRut.toUpperCase()}, rese_hora_llegada = TO_CHAR(NOW(), 'HH24:MI:SS')::time
        WHERE rese_id = ${record.rese_id}
    `;

    const updateParking = await sql`
      UPDATE estacionamiento
        SET esta_estado = 'OCUPADO'
        WHERE esta_id = ${record.esta_id}  
    `

    res.status(200).send('Reserva confirmada con éxito');
  }catch (error) {
    console.error('Error al confirmar la reserva:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

//Consulta para obtener los estacionamientos disponibles por seccion
app.get('/api/get-parkings-availables-by-section', async (req, res) => {
  try {
    const parkingSpaces = await sql`SELECT e.ESTA_SECC_ID, s.SECC_NOMBRE, COUNT(e.ESTA_NUMERO) AS cantidad_estacionamientos
    FROM ESTACIONAMIENTO e 
    INNER JOIN SECCION s ON e.ESTA_SECC_ID = s.SECC_ID 
    WHERE e.ESTA_ESTADO = 'LIBRE' 
    GROUP BY e.ESTA_SECC_ID, s.SECC_NOMBRE
    ORDER BY s.SECC_NOMBRE ASC;`
    ;
    console.log(parkingSpaces);
    res.json(parkingSpaces);
  }catch (error) {
    console.error('Error al obtener los estacionamientos:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
})

//login
app.get('/api/login', async (req, res) => {
  const myTokenName = req.cookies.myTokenName;
  try{
    const user = jwt.verify(myTokenName, process.env.SECRET);
    return res.json({
      email: user.userEmail,
      userName: user.userName,
      userLastNamePat: user.userLastNamePat,
      userLastNameMat: user.userLastNameMat,
      userRut: user.userRut,
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
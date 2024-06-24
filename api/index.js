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
    await sql.begin(async (sql) => {

      await sql`SET TIME ZONE 'America/Santiago'`;
      const expiredReservations = await sql`
        DELETE FROM reserva
        WHERE rese_estado = 'EN ESPERA'
          AND (rese_fecha + rese_hora_inicio <= NOW() - INTERVAL '30 minutes')
        RETURNING rese_esta_id
      `;

      const parkingIds = expiredReservations.map(reserva => reserva.rese_esta_id);

      if (parkingIds.length > 0) {
        await sql`
          UPDATE estacionamiento
          SET esta_estado = 'LIBRE'
          WHERE esta_id = ANY(${parkingIds})
        `;
      }
    });
  } catch (err) {
    console.error('Error deleting expired reservations:', err);
  }
};

setInterval(deleteExpiredReservas, 30 * 1000);

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
    console.log(error)
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
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
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
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
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
                                  values(${userName.trim()}, ${userLastNamePat.trim()}, ${userLastNameMat.trim()}, ${userRut.toUpperCase()}, ${fullUserEmail}, ${password}, ${userPhone}, ${userType})`;
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

//consulta para obtener los estacionamientos2
app.get('/api/parkingSpaces2', async (req, res) => {
  try {
    const parkingSpaces = await sql`SELECT (COUNT(es.esta_id) * 100.0 / ed.edif_capacidad_estacionamiento) AS porcentaje_ocupado
                                      FROM EDIFICIO ed JOIN ESTACIONAMIENTO es 
                                      ON ed.edif_id = es.esta_edif_id
                                        WHERE es.esta_estado = 'LIBRE'
                                    group by ED.edif_capacidad_estacionamiento`;

    res.json({total_libres: parkingSpaces[0].porcentaje_ocupado});
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
    const existingVehicle = await sql`SELECT * FROM vehiculo WHERE vehi_patente = ${patente.toUpperCase()}`;
    const existingRegister = await sql`SELECT * FROM registrousuariovehiculo WHERE regi_vehi_patente = ${patente.toUpperCase()} AND regi_usua_rut = ${userRut.toUpperCase()}`

    const vehicleCount = await sql`SELECT COUNT(*) FROM registrousuariovehiculo WHERE regi_usua_rut = ${userRut.toUpperCase()}`;

    if (vehicleCount[0].count >= 6) {
      return res.status(400).json({ error: 'No puede tener más de 6 vehículos registrados' });
    }

    if(existingVehicle.length > 0){
      if(existingRegister.length > 0){
        res.status(500).json({ error: 'Ya tiene un registro asociado a la patente ingresada' });
      } else {
        const addRegister = await sql`
          INSERT INTO registrousuariovehiculo (regi_vehi_patente, regi_usua_rut, regi_estado) 
          VALUES (${patente.toUpperCase()}, ${userRut.toUpperCase()}, 'inactivo')
        `;
        res.status(200).json({ message: 'Registro pendiente de verificación' });
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
      res.status(200).json({ message: 'Registro pendiente de verificación' });
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
      SELECT r.rese_vehi_patente, r.rese_hora_llegada, r.rese_hora_salida, r.rese_fecha, r.rese_fecha_salida, e.esta_numero 
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

/*
SELECT r.rese_vehi_patente, r.rese_fecha, e.esta_numero, s.secc_nombre, (r.rese_hora_inicio + INTERVAL '30 minutes') AS rese_hora_llegada
          FROM reserva r
          INNER JOIN estacionamiento e ON r.rese_esta_id = e.esta_id
          INNER JOIN SECCION s ON e.esta_secc_id = s.secc_id
          WHERE (rese_usua_rut = ${userRut.toUpperCase()} OR rese_visi_rut = ${userRut.toUpperCase()}) AND (rese_estado = 'EN ESPERA' OR (rese_estado = 'CONFIRMADA' AND rese_hora_salida IS NULL))
*/

//Consulta para obtener la reserva vigente del usuario
app.post('/api/get-current-reservation', async (req, res) => {
  const { userRut } = req.body;

  try {
    const currentReservation = await sql`
      SELECT r.rese_vehi_patente, r.rese_fecha, r.rese_hora_llegada, r.rese_estado, r.rese_hora_salida, e.esta_numero, s.secc_nombre, (r.rese_hora_inicio + INTERVAL '30 minutes') AS rese_hora_llegada_max
          FROM reserva r
          INNER JOIN estacionamiento e ON r.rese_esta_id = e.esta_id
          INNER JOIN SECCION s ON e.esta_secc_id = s.secc_id
          WHERE rese_usua_rut = ${userRut.toUpperCase()} AND (rese_estado = 'EN ESPERA' OR (rese_estado = 'CONFIRMADA' AND rese_hora_salida IS NULL))
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
    await sql.begin(async (sql) => {

      const deleteReservation = await sql`
        DELETE FROM reserva
        WHERE rese_usua_rut = ${userRut.toUpperCase()}
          AND rese_estado = 'EN ESPERA'
        RETURNING rese_esta_id
      `;

      const parkingIds = deleteReservation.map(reserva => reserva.rese_esta_id);

      if (parkingIds.length > 0) {
        await sql`
          UPDATE estacionamiento
          SET esta_estado = 'LIBRE'
          WHERE esta_id = ANY(${parkingIds})
        `;
      }
    });
    res.status(200).send('Reserva eliminada con éxito');
  } catch (error) {
    console.error('Error al eliminar la reserva:', error);
    res.status(500).send('Error al eliminar la reserva');
  }
});

//Consulta para liberar una reserva por patente
app.post('/api/release-reservation', async (req, res) => {
  const { vehiclePatente, guardRut } = req.body;

  try {
    await sql.begin(async (sql) => {
      // Establecer la zona horaria en el contexto de la transacción
      await sql`SET TIME ZONE 'America/Santiago'`;

      // Verificar si la patente existe
      const [existingReservation] = await sql`
        SELECT * FROM reserva 
        WHERE (rese_vehi_patente = ${vehiclePatente.toUpperCase()} OR rese_visi_vehi_patente = ${vehiclePatente.toUpperCase()})
        AND rese_hora_salida IS NULL 
        AND rese_estado = 'CONFIRMADA'
      `;

      if (!existingReservation) {
        return res.status(404).send('No se encontró una reserva con la patente proporcionada');
      }

      // Liberar el estacionamiento y actualizar la hora de salida de la reserva
      await sql`
        UPDATE estacionamiento 
        SET esta_estado = 'LIBRE' 
        WHERE esta_id = ${existingReservation.rese_esta_id}
      `;

      await sql`
        UPDATE reserva 
        SET rese_hora_salida = TO_CHAR(NOW(), 'HH24:MI:SS')::time,
            rese_fecha_salida = CURRENT_DATE,
            rese_guar_rut_salida = ${guardRut}
        WHERE (rese_vehi_patente = ${vehiclePatente.toUpperCase()} OR rese_visi_vehi_patente = ${vehiclePatente.toUpperCase()})
        AND rese_hora_salida IS NULL
      `;
      res.status(200).send(existingReservation.rese_esta_id.slice(-2));
    });
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
          SELECT r.rese_usua_rut, r.rese_hora_llegada, r.rese_fecha_salida, r.rese_vehi_patente, r.rese_hora_salida, r.rese_fecha, e.esta_numero, u.usua_nombre, u.usua_apellido_paterno, u.usua_apellido_materno, u.usua_tipo
            FROM reserva r
            INNER JOIN estacionamiento e ON r.rese_esta_id = e.esta_id
            INNER JOIN usuario u ON u.usua_rut = r.rese_usua_rut
            WHERE rese_vehi_patente = ${vehiclePatente.toUpperCase()} AND rese_estado = 'CONFIRMADA'
            ORDER BY r.rese_fecha DESC, r.rese_hora_llegada DESC
      `;

      if (date) {
        query = sql`
        SELECT r.rese_usua_rut, r.rese_hora_llegada, r.rese_fecha_salida, r.rese_vehi_patente, r.rese_hora_salida, r.rese_fecha, e.esta_numero, u.usua_nombre, u.usua_apellido_paterno, u.usua_apellido_materno, u.usua_tipo
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
          SELECT r.rese_usua_rut, r.rese_hora_llegada, r.rese_fecha_salida, r.rese_vehi_patente, r.rese_hora_salida, r.rese_fecha, e.esta_numero, u.usua_nombre, u.usua_apellido_paterno, u.usua_apellido_materno, u.usua_tipo
            FROM reserva r
            INNER JOIN estacionamiento e ON r.rese_esta_id = e.esta_id
            INNER JOIN usuario u ON u.usua_rut = r.rese_usua_rut
            WHERE rese_usua_rut = ${rut} AND rese_estado = 'CONFIRMADA'
            ORDER BY r.rese_fecha DESC, r.rese_hora_llegada DESC
      `;

      if (date) {
        query = sql`
        SELECT r.rese_usua_rut, r.rese_hora_llegada, r.rese_fecha_salida, r.rese_vehi_patente, r.rese_hora_salida, r.rese_fecha, e.esta_numero, u.usua_nombre, u.usua_apellido_paterno, u.usua_apellido_materno, u.usua_tipo
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
          SELECT r.rese_usua_rut, r.rese_hora_llegada, r.rese_fecha_salida, r.rese_vehi_patente, r.rese_hora_salida, r.rese_fecha, e.esta_numero, u.usua_nombre, u.usua_apellido_paterno, u.usua_apellido_materno, u.usua_tipo
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
  const { rut } = req.body;

  try {
    const activeReservation = await sql`
      SELECT r.rese_id, r.rese_usua_rut, r.rese_vehi_patente, e.esta_numero, e.esta_id, r.rese_fecha, u.usua_nombre, u.usua_apellido_paterno, u.usua_apellido_materno, u.usua_tipo, (r.rese_hora_inicio + INTERVAL '30 minutes') AS rese_hora_max
        FROM reserva r
        INNER JOIN estacionamiento e ON r.rese_esta_id = e.esta_id
        INNER JOIN usuario u ON u.usua_rut = r.rese_usua_rut
        WHERE rese_usua_rut = ${rut.toUpperCase()} AND rese_estado = 'EN ESPERA'
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
    const parkingSpaces = await sql
      `SELECT s.SECC_ID AS ESTA_SECC_ID, 
        s.SECC_NOMBRE, 
        COALESCE(COUNT(e.ESTA_NUMERO), 0) AS cantidad_estacionamientos_disponibles, 
        s.SECC_CAPACIDAD
        FROM SECCION s
        LEFT JOIN ESTACIONAMIENTO e ON e.ESTA_SECC_ID = s.SECC_ID 
        AND e.ESTA_ESTADO = 'LIBRE'
        GROUP BY s.SECC_ID, s.SECC_NOMBRE, s.SECC_CAPACIDAD
        ORDER BY s.SECC_NOMBRE ASC;
;`
    ;
    res.json(parkingSpaces);

  }catch (error) {
    console.error('Error al obtener los estacionamientos:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
})

//Consulta para obtener la informacion de los estacionamientos de una seccion

app.post('/api/get-data-section' , async (req, res) => {
  const { sectionId } = req.body;
  try {
    const dataSection = await sql`SELECT e.ESTA_ID, e.ESTA_NUMERO, e.ESTA_SECC_ID, e.ESTA_ESTADO, e.ESTA_TIPO, s.SECC_NOMBRE, s.SECC_CAPACIDAD
    FROM ESTACIONAMIENTO e
    INNER JOIN SECCION s ON e.ESTA_SECC_ID = s.SECC_ID
    WHERE s.SECC_ID = ${sectionId}
    ORDER BY e.ESTA_NUMERO ASC;`
    ;
    res.json(dataSection);
  } catch (error) {
    console.error('Error al obtener los estacionamientos:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  
  }
})

//Consulta para ovbener el vehiculo activo
app.post('/api/get-vehicle-active', async (req, res) => {
  const { userRut } = req.body;

  try {
    const vehicleActive = await sql`
      SELECT v.vehi_patente
        FROM registrousuariovehiculo r
        INNER JOIN vehiculo v ON r.regi_vehi_patente = v.vehi_patente
        WHERE r.regi_usua_rut = ${userRut.toUpperCase()} AND r.regi_estado = 'activo'
    `;
    res.json(vehicleActive);
  } catch (error) {
    console.error('Error al obtener los vehículos:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

//Consulta para registrar una reserva por el usuario
app.post('/api/reserve-parking', async (req, res) => {
  const { userRut, vehiclePatent, parkingId } = req.body;

  try {
    await sql.begin(async (sql) => {
      // Establecer la zona horaria en el contexto de la transacción
      await sql`SET TIME ZONE 'America/Santiago'`;

      // Realizar el INSERT dentro de la transacción
      const result = await sql`
        INSERT INTO reserva (rese_usua_rut, rese_is_usua, rese_vehi_patente, rese_esta_id, rese_estado, rese_fecha, rese_hora_inicio)
          VALUES (${userRut.toUpperCase()}, TRUE, ${vehiclePatent.toUpperCase()}, ${parkingId}, 'EN ESPERA', TO_CHAR(NOW(), 'YYYY-MM-DD')::date, TO_CHAR(NOW(), 'HH24:MI:SS')::time)
      `;

      // Actualizar el estado del estacionamiento dentro de la misma transacción
      await sql`
        UPDATE estacionamiento
        SET esta_estado = 'RESERVADO'
        WHERE esta_id = ${parkingId}
      `;

      res.status(200).json({
        message: 'Reserva registrada con éxito',
      });
    });
  } catch (error) {
    console.error('Error al registrar la reserva:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

//Consulta para registrar una reserva mediante el guardia
app.post('/api/reserve-parking-by-guard', async (req, res) => {
  const { userRut, vehiclePatent, parkingId, guardRut } = req.body;

  try {
    await sql.begin(async (sql) => {
      // Establecer la zona horaria en el contexto de la transacción
      await sql`SET TIME ZONE 'America/Santiago'`;


      const getActiveReservation = await sql`
        SELECT r.rese_vehi_patente, r.rese_fecha, e.esta_numero, s.secc_nombre, (r.rese_hora_inicio + INTERVAL '30 minutes') AS rese_hora_llegada
          FROM reserva r
          INNER JOIN estacionamiento e ON r.rese_esta_id = e.esta_id
          INNER JOIN SECCION s ON e.esta_secc_id = s.secc_id
          WHERE (rese_usua_rut = ${userRut.toUpperCase()} OR rese_visi_rut = ${userRut.toUpperCase()}) AND (rese_estado = 'EN ESPERA' OR (rese_estado = 'CONFIRMADA' AND rese_hora_salida IS NULL))
      `;

      if (getActiveReservation.length > 0) {
        return res.status(400).json({ error: 'El usuario ya tiene una reserva activa' });
      }
      // Realizar el INSERT dentro de la transacción
      const result = await sql`
        INSERT INTO reserva (rese_visi_rut, rese_is_usua, rese_visi_vehi_patente, rese_esta_id, rese_estado, rese_guar_rut, rese_fecha, rese_hora_inicio)
          VALUES (${userRut.toUpperCase()}, FALSE, ${vehiclePatent.toUpperCase()}, ${parkingId}, 'CONFIRMADA', ${guardRut}, TO_CHAR(NOW(), 'YYYY-MM-DD')::date, TO_CHAR(NOW(), 'HH24:MI:SS')::time)
      `;

      // Actualizar el estado del estacionamiento dentro de la misma transacción
      await sql`
        UPDATE estacionamiento
        SET esta_estado = 'OCUPADO'
        WHERE esta_id = ${parkingId}
      `;

      res.status(200).json({
        message: 'Reserva registrada con éxito',
      });
    });
  } catch (error) {
    console.error('Error al registrar la reserva:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

//Consulta para obtener el historial de las reservas por usuario
app.post('/api/get-user-statistics', async (req, res) => {
  const { userRut } = req.body;

  try {
    await sql.begin(async (sql) => {
      await sql`SET TIME ZONE 'America/Santiago'`;
      const [
        reservationsThisMonth,
        mostUsedSection,
        averageHoursPerReservation,
        totalReservations,
      ] = await Promise.all([
        sql`
          SELECT COUNT(*) AS count
          FROM reserva
          WHERE rese_usua_rut = ${userRut.toUpperCase()}
            AND EXTRACT(MONTH FROM rese_fecha) = EXTRACT(MONTH FROM CURRENT_DATE)
            AND EXTRACT(YEAR FROM rese_fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
            AND rese_estado != 'EN ESPERA'
        `,
        sql`
          SELECT s.secc_nombre, COUNT(*) AS count
          FROM reserva r
          INNER JOIN estacionamiento e ON r.rese_esta_id = e.esta_id
          INNER JOIN seccion s ON e.esta_secc_id = s.secc_id
          WHERE rese_usua_rut = ${userRut.toUpperCase()}
            AND rese_estado != 'EN ESPERA'
          GROUP BY s.secc_nombre
          ORDER BY count DESC
          LIMIT 1
        `,
        sql`
          SELECT
            AVG(EXTRACT(EPOCH FROM (rese_fecha_salida - rese_fecha) * interval '1 day' + (rese_hora_salida - rese_hora_llegada)) / 3600) AS average_hours
            FROM reserva r
          WHERE rese_usua_rut = ${userRut.toUpperCase()}
            AND rese_hora_salida IS NOT NULL
            AND rese_estado != 'EN ESPERA'
        `,
        sql`
          SELECT COUNT(*) AS count
          FROM reserva
          WHERE rese_usua_rut = ${userRut.toUpperCase()}
            AND rese_estado != 'EN ESPERA'
        `,
      ]);
  
      const averageHours = averageHoursPerReservation[0]?.average_hours ?? 0;
  
      res.json({
        reservationsThisMonth: reservationsThisMonth[0].count,
        mostUsedSection: mostUsedSection.length > 0 ? mostUsedSection[0].secc_nombre : '',
        averageHoursPerReservation: averageHours,
        totalReservations: totalReservations[0].count,
      });
    });
  } catch (error) {
    console.error('Error al obtener las estadísticas:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.get('/api/get-statistics', async (req, res) => {

  try {
    await sql.begin(async (sql) => {
      await sql`SET TIME ZONE 'America/Santiago'`;
      const [
        reservationsActive,
        reservationToday,
        reservationMonth,
        occupationPercentage,
      ] = await Promise.all([
        sql`
          SELECT COUNT(*) AS count
          FROM reserva
          WHERE rese_estado = 'EN ESPERA'
        `,
        sql`
          SELECT COUNT(*) AS count
          FROM reserva r
          WHERE r.rese_fecha = CURRENT_DATE
            AND r.rese_estado != 'EN ESPERA'
        `,
        sql`
          SELECT COUNT(*) AS count
          FROM reserva
          WHERE EXTRACT(MONTH FROM rese_fecha) = EXTRACT(MONTH FROM CURRENT_DATE)
            AND EXTRACT(YEAR FROM rese_fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
            AND rese_estado != 'EN ESPERA'
        `,
        sql`
          SELECT (COUNT(es.esta_id) * 100.0 / ed.edif_capacidad_estacionamiento) AS porcentaje_ocupado
          FROM EDIFICIO ed JOIN ESTACIONAMIENTO es 
          ON ed.edif_id = es.esta_edif_id
          WHERE es.esta_estado != 'LIBRE'
          GROUP BY ED.edif_capacidad_estacionamiento
        `,
      ]);
  
  
      res.json({
        reservationsActive: reservationsActive[0].count,
        reservationToday: reservationToday[0].count,
        reservationMonth: reservationMonth[0].count,
        occupationPercentage: occupationPercentage[0].porcentaje_ocupado,
      });
    });
  } catch (error) {
    console.error('Error al obtener las estadísticas:', error);
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
      userName: user.userName,
      userLastNamePat: user.userLastNamePat,
      userLastNameMat: user.userLastNameMat,
      userRut: user.userRut,
      IsGuard: user.IsGuard,
    });
  }catch(error){
    console.error('Error al verificar el token:', error);
    return res.status(401).json({ error: "invalid token"})
  }
});

//logout
app.get('/api/logout', async (req, res) => {
  try {
    // Limpiar el token del cliente (por ejemplo, eliminar la cookie)
    res.clearCookie('myTokenName'); // Esto borra la cookie 'myTokenName'

    res.status(200).json('logout successfully');
  } catch (error) {
    return res.status(500).json({ error: 'logout failed' });
  }
});



//Consulta para obtener reservas activas
app.get('/api/get-active-reservations', async (req, res) => {
  try {
    const reservas = await sql`
      SELECT COUNT(*) AS count
      FROM estacionamiento
      WHERE esta_estado = 'RESERVADO'
    `;
    res.json(reservas);
  } catch (error) {
    console.error('Error al obtener los reservas:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

//Consulta para obtener reservas no disponibles
app.get('/api/get-inactive-reservations', async (req,res) => {
  try {
    const reservas = await sql`
      SELECT COUNT(*) AS count
      FROM estacionamiento
      WHERE esta_estado = 'NO DISPONIBLE'
    `;
    res.json(reservas);
  } catch (error) {
    console.error('Error al obtener los reservas:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

//Consulta para obtener reservas ocupadas
app.get('/api/get-taken-reservations', async (req, res) => {
  try {
    const reservas = await sql`
      SELECT COUNT(*) AS count
      FROM estacionamiento
      WHERE esta_estado = 'OCUPADO'
    `;
    res.json(reservas);
  } catch (error) {
    console.error('Error al obtener los reservas:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});
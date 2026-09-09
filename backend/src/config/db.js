const mysql = require('mysql2/promise');

const host = process.env.DB_HOST || 'db';
const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || 'rootpassword';
const database = process.env.DB_NAME || 'sistema_calificacion';

const pool = mysql.createPool({
  host,
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log(`Intentando conectar a MySQL en el host: ${host}`);

module.exports = pool;
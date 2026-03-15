//src/db db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Se estiver rodando testes, usa .env.test; caso contrário, usa .env
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envFile });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, // Aqui pega o DB do .env ou .env.test
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
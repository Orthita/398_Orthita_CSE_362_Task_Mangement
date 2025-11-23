const mysql = require('mysql2');

const connection = mysql.createPool({
  host: 'localhost',
  user: 'taskuser',
  password: 'taskpass123',
  database: 'taskdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const db = connection.promise(); // Promise-based connection
module.exports = db;

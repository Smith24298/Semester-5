const mysql = require('mysql2/promise');

const config = {
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || 'appuser',
  password: process.env.MYSQL_PASSWORD || 'apppassword',
  database: process.env.MYSQL_DATABASE || 'myapp',
};

async function main() {
  const connection = await mysql.createConnection(config);
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS properties (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      city VARCHAR(80) NOT NULL,
      monthly_rent DECIMAL(10, 2) NOT NULL,
      room_type VARCHAR(30) NOT NULL,
      available_rooms INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await connection.execute(
    `INSERT INTO properties (name, city, monthly_rent, room_type, available_rooms)
     SELECT ?, ?, ?, ?, ?
     WHERE NOT EXISTS (SELECT 1 FROM properties WHERE name = ? AND city = ?)`,
    [' omkara PG', 'Ahmedabad', 8500, 'Double', 12, 'Omkar PG', 'Ahmedabad'],
  );

  const [rows] = await connection.execute(
    'SELECT id, name, city, monthly_rent, room_type, available_rooms FROM properties ORDER BY id',
  );
  console.table(rows);
  await connection.end();
}

main().catch((error) => {
  console.error('MySQL example failed:', error.message);
  process.exitCode = 1;
});

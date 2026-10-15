const mysql = require("mysql2/promise");

const config = {
  host: process.env.MYSQL_HOST || "127.0.0.0",
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || "appuser",
  password: process.env.MYSQL_PASSWORD || "apppassword",
  database: process.env.MYSQL_DATABASE || "myapp",
};

async function main() {
  let connection;

  try {
    connection = await mysql.createConnection(config);

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

    // CREATE
    const [insertResult] = await connection.execute(
      `INSERT INTO properties
        (name, city, monthly_rent, room_type, available_rooms)
       VALUES (?, ?, ?, ?, ?)`,
      ["Omkar PG", "Ahmedabad", 8500, "Double", 12],
    );

    const propertyId = insertResult.insertId;
    console.log("Created property ID:", propertyId);

    // READ the newly created property
    let [rows] = await connection.execute(
      `SELECT id, name, city, monthly_rent, room_type, available_rooms
       FROM properties
       WHERE id = ?`,
      [propertyId],
    );
    console.log("Property before update:");
    console.table(rows);

    // UPDATE
    const [updateResult] = await connection.execute(
      `UPDATE properties
       SET monthly_rent = ?, available_rooms = ?
       WHERE id = ?`,
      [9000, 10, propertyId],
    );
    console.log("Properties updated:", updateResult.affectedRows);

    // READ the updated property
    [rows] = await connection.execute(
      `SELECT id, name, city, monthly_rent, room_type, available_rooms
       FROM properties
       WHERE id = ?`,
      [propertyId],
    );
    console.log("Property after update:");
    console.table(rows);

    // DELETE
    const [deleteResult] = await connection.execute(
      "DELETE FROM properties WHERE id = ?",
      [propertyId],
    );
    console.log("Properties deleted:", deleteResult.affectedRows);

    // READ all remaining properties
    [rows] = await connection.execute(
      `SELECT id, name, city, monthly_rent, room_type, available_rooms
       FROM properties
       ORDER BY id`,
    );
    console.log("Remaining properties:");
    console.table(rows);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

main().catch((error) => {
  console.error("MySQL CRUD example failed:", error.message);
  process.exitCode = 1;
});

import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: Number(process.env.DB_PORT)
}).promise();

async function usersDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        balance INT NOT NULL DEFAULT 0
      );
    `);
    console.log("users table created or already exists.");
  } catch (err) {
    console.error("Error creating users table:", err);
  }
}

async function stocksDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS stocks(
        stock_id INT AUTO_INCREMENT PRIMARY KEY,
        symbol VARCHAR(15) NOT NULL UNIQUE,
        company_name VARCHAR(255) NOT NULL
      );
    `);
    console.log("stocks table created or already exists.");
  } catch (err) {
    console.error("Error creating users table:", err);
  }
}

async function transactionDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        trans_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        stock_id INT NOT NULL,
        type ENUM('BUY', 'SELL') NOT NULL,
        quantity INT NOT NULL CHECK (quantity > 0),
        price_per_share DECIMAL(10, 2) NOT NULL CHECK (price_per_share >= 0),
        total_price DECIMAL(12, 2) GENERATED ALWAYS AS (quantity * price_per_share) STORED,
        trans_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (stock_id) REFERENCES stocks(stock_id) ON DELETE CASCADE
        );

    `);
    console.log("transactions table created or already exists.");
  } catch (err) {
    console.error("Error creating users table:", err);
  }
}

async function holdingsDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS holdings(
        holding_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        stock_id INT NOT NULL,
        total_quantity INT NOT NULL,
        avg_price_per_share DECIMAL(10, 2) NOT NULL,
        total_value DECIMAL(12, 2) GENERATED ALWAYS AS (total_quantity * avg_price_per_share) STORED,
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (stock_id) REFERENCES stocks(stock_id),
        UNIQUE (user_id, stock_id)
      )
    `);
    console.log("holdings table created or already exists.");
  } catch (err) {
    console.error("Error creating users table:", err);
  }
}

usersDB();
stocksDB();
transactionDB();
holdingsDB();

await pool.query(`
  INSERT IGNORE INTO stocks (symbol, company_name) VALUES
  ('AAPL', 'Apple Inc.'),
  ('MSFT', 'Microsoft Corporation'),
  ('GOOGL', 'Alphabet Inc.'),
  ('AMZN', 'Amazon.com, Inc.'),
  ('TSLA', 'Tesla, Inc.'),
  ('NVDA', 'NVIDIA Corporation');
`);

export default pool;
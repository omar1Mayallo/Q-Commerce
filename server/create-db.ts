import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const createDatabase = async () => {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: +process.env.DB_PORT,
  });

  try {
    await client.connect();
    const dbName = process.env.DB_NAME;

    // Terminate all connections to the database
    await client.query(
      `SELECT pg_terminate_backend(pid) 
                        FROM pg_stat_activity 
                        WHERE datname = $1 AND pid <> pg_backend_pid();`,
      [dbName],
    );

    // Drop the database if it exists
    await client.query(`DROP DATABASE IF EXISTS ${dbName}`);

    // Create the database
    await client.query(`CREATE DATABASE ${dbName}`);
    console.log(`Database ${dbName} created successfully`);
  } catch (err) {
    console.error('Error creating database:', err);
  } finally {
    await client.end();
  }
};

createDatabase();

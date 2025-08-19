const { Sequelize } = require('sequelize');

// First try to connect to postgres database to create our app database
const setupSequelize = new Sequelize('postgres://postgres@localhost:5432/postgres', {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: false
  }
});

async function setupDatabase() {
  try {
    await setupSequelize.authenticate();
    console.log('Connected to PostgreSQL');
    
    // Try to create database
    await setupSequelize.query('CREATE DATABASE mini_ats_db;');
    console.log('Database mini_ats_db created successfully');
  } catch (error) {
    if (error.original && error.original.code === '42P04') {
      console.log('Database mini_ats_db already exists');
    } else {
      console.error('Error setting up database:', error.message);
    }
  } finally {
    await setupSequelize.close();
  }
}

setupDatabase();
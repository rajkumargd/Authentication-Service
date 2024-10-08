import { Sequelize } from 'sequelize-typescript';

// db cnfig
const sequelize = new Sequelize({
  database: process.env.DB_NAME,  
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false,
});

export { sequelize };

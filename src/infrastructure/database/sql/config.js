require('dotenv').config()

module.exports = {
  production:{
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    dialect: 'mysql',
    dialectOptions: {
      bigNumberStrings: true
    }
  }
}
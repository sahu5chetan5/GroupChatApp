const { Sequelize } = require("sequelize");
// const dotenv=require('dotenv');
// dotenv.config();

const sequelize=new Sequelize('chatsapp','root','1234567890',{
    dialect:'mysql',
    host: '127.0.0.1'
});

module.exports=sequelize;
const Sequelize=require('sequelize');
const path=require('path');
const sequelize=require('../util/database');
const Message=sequelize.define('message',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    senderName:Sequelize.STRING,
    
    message:{
        type:Sequelize.STRING,
        allowNull:false,

    }
  

});
module.exports=Message;
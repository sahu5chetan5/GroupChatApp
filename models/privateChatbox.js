const Sequelize=require('sequelize');
const path=require('path');
const sequelize=require('../util/database');
const privateMessage=sequelize.define('privatemessage',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    
    message:{
        type:Sequelize.STRING,
        
    },
    multimedia:{
        type:Sequelize.STRING
    },
    senderId: { 
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    senderName:{
        type: Sequelize.STRING,
        allowNull: false,

    },
    receiverName:{
        type: Sequelize.STRING,
        allowNull: false,

    },
    receiverId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
    

});
module.exports=privateMessage;
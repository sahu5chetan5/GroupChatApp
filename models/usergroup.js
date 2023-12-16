const Sequelize=require('sequelize');
const path=require('path');
const sequelize=require('../util/database');
const User_Group=sequelize.define('user_group',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    isAdmin: {
        type: Sequelize.BOOLEAN
    }
   
  

});
module.exports=User_Group;


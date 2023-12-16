const path = require('path');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

//models:
const User = require('../models/user');
const Message=require('../models/chatbox');
const Group=require('../models/group');
const User_Group=require('../models/usergroup')
const privateMessage =require('../models/privateChatbox')

function invalidInput(input) {
    if (input === undefined || input.length === 0) {
         return true;
    }
    else {
         return false;
    }
}

//private chat window
exports.privateChatPage=async(req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','views','privateChat.html'));
};


exports.privateChatHeading = async(req,res,next)=>{
    console.log("heading from backend")
    console.log(req.params)
    const {userId}=req.params;
    console.log(userId,'userId')
    try {
        const user = await User.findOne({
          attributes: ['name'], // Specify the attributes you want to retrieve
          where: {
            id: userId,
          },
        });
        console.log(user,"user")
        if (user) {
          res.status(200).json({'userName':user})
        } else {
          res.status(400).json({ message: "No message found", success: false })
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
        
      }
    }
    
exports.listOfUsers =async(req,res,next)=>{
    try{
        const usersArr=await User.findAll({
            attributes: ['id', 'name'],
        
        });   
        res.status(200).json(usersArr);
    }
    catch(err){
        res.status(500).json({message:'Get Users: something went wrong'});
    }
}



exports.postPrivateMsg = async(req,res,next)=>{
    try{
        const {receiverId,senderId,message}=req.body
        console.log(receiverId,senderId,message)
        const senderRow = await User.findOne({ where: { id: senderId } });
        const receiverRow = await User.findOne({ where: { id: receiverId } });
        const senderName= senderRow.name
        const receiverName= receiverRow.name
        
        const saveToDb=await privateMessage.create({
            message:message,
            senderId:senderId,
            senderName:senderName,
            receiverId: receiverId,
            receiverName:receiverName

        });
        console.log("successful")
        res.status(201).json(saveToDb);
    }
    catch(err){
        return res.status(403).json({ message: "Post Message: unothorized!", success: false });
    }   
}


exports.getAllPrivateMsgs = async(req,res,next)=>{
    try{
        const {receiverId,senderId}=req.params;
        const latestMessages = await privateMessage.findAll({
            attributes: ['senderId', 'senderName', 'receiverId', 'receiverName', 'message'],
            where: {
              [Op.or]: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId },
              ],
            },
            order: [['createdAt', 'DESC']],
            limit: 20,
          });
          console.log(latestMessages.length,"length")
          res.status(200).json({ latestMessages: latestMessages, success: true });
    }
    catch(err){
        return res.status(403).json({ message: "Get All Message: unothorized!", success: false });
    }
}


exports.getNewPrivateMsgs = async(req,res,next)=>{
    try{
        const {receiverId,senderId}=req.params;
        const lastMessage = await privateMessage.findOne({
            order: [['createdAt', 'DESC']], // Assuming your table has a 'createdAt' column
          });

        if (lastMessage){
            res.status(201).json({'lastMessage':lastMessage})
        }
        else{
            console.log('No Message Found')
        }
        
    }   
    catch(err){
        res.status(403).json({ message: "No message found", success: false });
    }
}

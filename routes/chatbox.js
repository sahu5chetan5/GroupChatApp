const express=require('express');
const router=express.Router();
const chatmsgController=require('../controllers/chatbox');
const userAuth=require('../middleware/auth')
const upload = require("../middleware/fileupload");


//chat window:

router.get('/group-messages',chatmsgController.groupMessagePage);

router.get('/group/heading-data/:groupId',userAuth,chatmsgController.getHeadingData);


router.get('/all-messages/',chatmsgController.getMessages);

router.post('/user/message',userAuth,upload.single('file'),chatmsgController.postMessages);

router.get('/new-messages',chatmsgController.getNewMessages)


module.exports=router;
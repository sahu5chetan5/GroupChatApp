const express=require('express');
const router=express.Router();
const userController=require('../controllers/user')

router.get('/signup',userController.getSignupPage);
router.post('/post-user-details',userController.postUserDetails);
router.get('/login',userController.getLoginPage);
router.get('/logout',userController.getLogoutDetails);
router.get('/logout-page',userController.getLogoutPage);
router.post('/post-login-data',userController.postLoginDetails);



module.exports=router;
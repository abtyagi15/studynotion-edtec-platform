//import necessary modules
const express = require("express");
const router = express.Router();

//import controllers
const {login,signup,sendOTP,changePassword} = require("../controllers/Auth");
const {resetPasswordToken,resetPassword} = require("../controllers/ResetPassword");

//import middleware
const {auth} = require("../middleware/auth");

//routes for login signup authentication    

router.post('/login',login);
router.post('/signup',signup);
router.post('/sendotp',sendOTP);
router.post('reset-password-token',resetPasswordToken);
router.post('/reset-password',resetPassword);
router.post('/changepassword',auth,changePassword);

module.exports = router;
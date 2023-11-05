const express = require("express");
const router = express.Router();


//import controllers
const {updatProfile,deleteProfile} = require("../controllers/Profile");
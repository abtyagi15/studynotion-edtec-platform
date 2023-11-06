const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

exports.auth = async (req, res, next) => {
  try {
    //extract token
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorisation").replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Token is missing" });
    }

    //verify token
    try {
      const decode = await jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode; 
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed!" });
  }
};


//isStudent
exports.isStudent = async (req, res, next) => {
    try{
        if(req.user.role !== "Student"){
            return res.status(401).json({ message: "Access denied" });
        }
        next();
    }
    catch(error){
        res.status(401).json({ message: "User account type cannot be verified" });
    }
}

//isInstuctor 
exports.isInstructor = async (req, res, next) => {
    try{
        if(req.user.role !== "Instructor"){
            return res.status(401).json({ message: "Access denied" });
        }
        next();
    }
    catch(error){
        res.status(401).json({ message: "User account type cannot be verified" });
    }
}

//isAdmin
exports.isAdmin = async (req, res, next) => {
    try{
        if(req.user.role !== "Admin"){
            return res.status(401).json({ message: "Access denied" });
        }
        next();
    }
    catch(error){
        res.status(401).json({ message: "User account type cannot be verified" });
    }
}
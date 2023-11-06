const express = require("express");
const router = express.Router();


//import controllers
const {updateProfile,deleteProfile,getAllUserDetails,getEnrolledCourses,updateDispalyPicture} = require("../controllers/Profile");

//import middlewares
const {auth} = require("../middlewares/auth");


//........................................................................................................//
//                                       profile routes                                                    //
//........................................................................................................//

//route for updating profile
router.put('/update-profile',auth,updateProfile);
//route for deleting the account
router.delete('/delete-profile',auth,deleteProfile);
//route for getting all the details of an user
router.get('/get-user-details',auth,getAllUserDetails);
//router for getting all the courses in which an user is enrolled
router.get('/get-enrolled-courses',auth,getEnrolledCourses);
//route for updating user profile picture
router.put('/update-profile-picture',auth,updateDispalyPicture);

module.exports = router;
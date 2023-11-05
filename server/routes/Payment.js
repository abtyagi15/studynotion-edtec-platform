const express = require('express');
const router = express.Router();

//importing controllers
const {capturePayment,verifySignature} = require('../controllers/Payments');

//importing middlewares
const {auth,isStudent,isInstructor,isAdmin} = require('../middlewares/auth');

//...................creating payment related routes....................//

router.post('/capture-payment',auth,isStudent,capturePayment);

router.post('/verify-signature',verifySignature);

module.exports = router;
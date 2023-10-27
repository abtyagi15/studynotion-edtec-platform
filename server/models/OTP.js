const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');


const otpSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      expire: 5*60,
    }
  });

//function to send the verification code via mail

async function sendVerificationEmail(email,otp){
    try{
        const mailResponse = await mailSender(email,"Verification Email from StudyNotion", otp);
        console.log("Mail sent successfully",mailResponse);
    }
    catch(error){
        console.log("Error occured while sending the mails",error);
        throw error; 
    }
}

otpSchema.pre("save", async function(next){
    await sendVerificationEmail(this.email,this.otp); 
    next();
})


module.exports = mongoose.model("OTP", otpSchema);

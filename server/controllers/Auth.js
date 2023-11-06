const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
require("dotenv").config();

//send otp
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    //check if user already exists
    const checkUserExistence = await User.findOne({ email });

    if (checkUserExistence) {
      return res.status(401).json({
        success: false,
        message: "User already exists",
      });
    }

    //generate otp
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const result = await OTP.findOne({ otp: otp });

    //checking till otp is unique
    while (result) {
      let otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      const result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    //create an entry in db]
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log("Error in sending the OTP", error);
    res.status(500).json({
      success: false,
      message: "Error in sending the OTP",
    });
  }
};

//signup
exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !contactNumber ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    //find most recent otp
    const recentOtp = await OTP.findOne({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    if (recentOtp.length == 0) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }
    //compare otp
    if (recentOtp.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is incorrect",
      });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const profileDetails = await Profile.create({
      gender: null,
      about: null,
      contactNumber: null,
    });
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      contactNumber,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    return res.this.status(200).json({
      success: true,
      message: "User successfully registered",
    });
  } catch (error) {
    console.log("Error in signup", error);
    res.status(500).json({
      success: false,
      message: "Error in signup",
    });
  }
};

//login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Register first",
    });
  }

  if (await bcrypt.compare(password, user.password)) {
    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.cookie("token", token, options).status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
    });
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
  } else {
    return res.status(401).json({
      success: false,
      message: "Invalid password",
    });
  }
};


//change password
exports.changePassword  = async (req, res) => { 
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const user = await User.find
}

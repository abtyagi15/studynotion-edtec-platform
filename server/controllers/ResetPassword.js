const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

//resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = crypto.randomUUID();

    const updateUserDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );

    const url = `http://Localhost:3000/updatePassword/${token}`;

    await mailSender(
      email,
      "Password Reset Link",
      `Password Reset Link: ${url}`
    );

    return res
      .status(200)
      .json({ message: "Password reset link sent to your email" });
  } catch (err) {
    console.log(err);
  }
};

//reset password
exports.resetPassword = async (req, res) => {
  const { token, newPassword, confirmNewPassword } = req.body;

  const user = await User.findOne({ token: token });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (user.resetPasswordExpires < Date.now()) {
    return res.status(400).json({ message: "Link expired" });
  }
  
  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ message: "Password does not match" });
  }

  const hashpassword = await bcrypt.hash(newPassword, 10);
  await User.findOneAndUpdate(
    { token: token },
    {
      password: hashpassword,
    },
    { new: true }
  );
};

const asynchandler = require("express-async-handler");
const {
  User,
  validateUser,
  LoginValidate,
  genereateAuthToken,
  validateRegisterUser
} = require("../models/user");
const bcrypt = require("bcryptjs");
const { VerificationToken } = require("../models/VerificationToken");
const crypto = require('crypto');
const { sendEmail } = require("../utils/sendEmails");
/***
 * @method Post
 * @route '/api/auth/signup'
 * @desc  sign up new user
 * @access public
 */
module.exports.registerAuthCtrl = asynchandler(async (req, res) => {
  const { error } = validateRegisterUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ message: "user already exist" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });
  await user.save();

  const verificationToken=new VerificationToken({
    userId:user._id,
    token:crypto.randomBytes(32).toString("hex")
  })
  await verificationToken.save()
  const link =`http:/localhost:3000/users/${user._id}/verify/${verificationToken.token}`
  const htmlTemplate=`
  <div>
    <p>Click on th Link Below</p>
    <a href=${link}>Verify Account</a>
  </div>`
  await sendEmail(user.email,"verifiy email",htmlTemplate)
  res.status(201).json({message:"created"})
});
/***
 * @method Post
 * @route '/api/auth/login'
 * @desc  sign in new user
 * @access public
 */

module.exports.loginCtrl = asynchandler(async (req, res) => {
  const { error } = LoginValidate(req.body);
  if (error) {
    return res.status(400).json(error);
  } else {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "email or password not valiid" });
    }
    let passwordmatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordmatch) {
      return res.status(400).json({ message: "invalid email or password" });
    }
    if (!user.isVerified) {
      return res.status(400).json({ message: "please check ypur email" });
    }
    
    const token = user.genereateAuthToken();
    res.status(200).json({
      _id: user._id,
      profilePhoto: user.profilePhoto,
      isAdmin: user.isAdmin,
      username: user.username,
      token,
    });
  }
});
module.exports.verifyUserAccountCtrl = asynchandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const verificationToken = await VerificationToken.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!verificationToken) {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    user.isVerified = true;
    await user.save();

    if (verificationToken.remove) {
      await verificationToken.remove();
    }

    res.status(200).json({ message: "User account verified", isVerified: user.isVerified });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

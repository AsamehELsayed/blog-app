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
module.exports.ressetPasswordAccountCtrl = asynchandler(async (req, res) => {
 
    const user = await User.findOne({email:req.body.email});
    console.log(user)
    if (!user) { 
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const verificationToken=new VerificationToken({
        userId:user._id,
        token:crypto.randomBytes(32).toString("hex")
      })
      await verificationToken.save()
    const link=`http://localhost:3000/resetpassword/${user._id}/new-password/${verificationToken.token}`
    const htmlTemplate=
    `
        <div>
            <h1>Reset your pass</h1>
            <a href=${link} target=${link}]>Click</a>
        </div>    
    `
   await sendEmail(user.email,"resetpassword",htmlTemplate)
    res.status(200).json({message:"check email"})
});

module.exports.writeNewPassword= asynchandler(async (req, res) => {
    console.log("//////////////////////////////")
    console.log(req.params.id,req.params.token)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user= await User.findById(req.params.id)
    console.log(user)
    const token =await VerificationToken.findOne({
        userId: user._id,
        token: req.params.token,
      })
    console.log(token)
    if(!token){
        return res.status(404).json({message:'token not found'})
    }
    const updatedUser=await User.findByIdAndUpdate(req.params.id,{
        $set:{
            password:hashedPassword
        }
    },{new:true})
    await updatedUser.save()
    await VerificationToken.findByIdAndDelete(token._id)
    console.log("12")
    res.status(200).json({message:"password changed"})
})
const Joi = require("joi");
const { default: mongoose } = require("mongoose");
const jwt= require("jsonwebtoken")
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        min:2,
        max:100,
        required:true,
    },
    email:{
        type:String,
        min:5,
        required:true,
        unique:true
    },
    bio:{
        type:String,
        max:1000,
    },
    password:{
        type:String,
        min:8,
        required:true
},
    profilePhoto:{
        type:Object,
        default:{
            url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMkTSF9gVJIBjtmyoOttT_j4yWAkOKpbMEO9LOfx8rUrgsdUSt-pndS2gJGHIpQCGSjvA&usqp=CAU",
            publicId:null
        }
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    isVerified:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}
})
userSchema.virtual("posts",{
    ref:"post",
    foreignField:"user",
    localField:"_id"
})
userSchema.methods.genereateAuthToken=function (){
    return jwt.sign({id:this._id,isAdmin:this.isAdmin},process.env.SECRET_KEY)
}


const User =mongoose.model("User",userSchema)
function validateUser(obj){
    const Schema=Joi.object({
        username:Joi.string().trim().min(2).max(100).required(),
        password:Joi.string().trim().min(8).max(100).required(),
        bio:Joi.max(1000).string().trim(),
        email:Joi.string().trim().min(5).required(),
    })
    return Schema.validate(obj)
}
function validateUpdateUser(obj){
    const Schema=Joi.object({
        username:Joi.string().trim().min(2).max(100),
        password:Joi.string().trim().min(8).max(100),
        bio:Joi.string().trim().max(1000),
    })
    return Schema.validate(obj)
}
function validateRegisterUser(obj){
    const Schema=Joi.object({
        username:Joi.string().trim().min(2).max(100),
        password:Joi.string().trim().min(8).max(100),
        email:Joi.string().trim().min(8).max(100)
    })
    return Schema.validate(obj)
}
function LoginValidate(obj){
    const Schema=Joi.object({
        email:Joi.string().trim().min(5).required(),
        password:Joi.string().trim().min(8).max(100).required(),
    })
    return Schema.validate(obj)
}
function emailValidate(obj){
    const Schema=Joi.object({
        email:Joi.string().trim().min(5).required(),
    })
    return Schema.validate(obj)
}
function passwordValidate(obj){
    const Schema=Joi.object({
        password:Joi.string().trim().min(8).max(100).required(),
    })
    return Schema.validate(obj)
}
module.exports={
    User,
    validateUser,
    validateUpdateUser,
    LoginValidate,
    validateRegisterUser,
    emailValidate,
    passwordValidate
}
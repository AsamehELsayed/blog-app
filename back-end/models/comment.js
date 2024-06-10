const Joi = require("joi");
const { default: mongoose } = require("mongoose");
const jwt= require("jsonwebtoken")
 
const commentSchema =new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
        required: true
    },    
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    username:{
        type:String,
        require:true
    },
    text:{
        type:String,
        require:true
    }
},{
    timestamps:true
})

const Comment =mongoose.model("Comment",commentSchema)

function commentVaildition(obj){
    const schema= Joi.object({
        text:Joi.string().required(),
        postId:Joi.string().required(),
    })
    return schema.validate(obj)
}
function updatecommentVaildition(obj){
    const schema= Joi.object({
        text:Joi.string().required()
    })
    return schema.validate(obj)
}

module.exports={
    Comment,
    commentVaildition,
    updatecommentVaildition
}
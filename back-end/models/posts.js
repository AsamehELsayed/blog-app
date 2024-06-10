const mongoose = require('mongoose');
const joi = require('joi');
const postShema=new mongoose.Schema({
    title:{
        type:String,
        minlength:2,
        maxlength:100,
        require:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    image:{
        type:Object,
        default:{
            url:"",
            publicId:null
        }
    },
    category:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    likes:[
        {type:mongoose.Schema.Types.ObjectId,
        ref:"User"}
    ]
    
},{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})
postShema.virtual("comments",{
    ref:"Comment",
    foreignField:"postId",
    localField:"_id"
})
const Post=mongoose.model("post",postShema)

function validatePost(obj){
    const schema=joi.object({
        title:joi.string().trim().min(2).max(100).required(),
        description:joi.string().trim().required(),
        category:joi.string().required()
    })
    return schema.validate(obj)
}
function validateUpdatePost(obj){
    const schema=joi.object({
        title:joi.string().trim().min(2).max(100),
        description:joi.string().trim(),
        category:joi.string()
    })
    return schema.validate(obj)
}
module.exports={
    Post,
    validatePost,
    validateUpdatePost
}
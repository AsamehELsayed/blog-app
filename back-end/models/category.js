const Joi = require("joi");
const { default: mongoose } = require("mongoose");
const jwt= require("jsonwebtoken")
 
const categorySchema =new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    title:{
        type:String,
        require:true
    }
},{
    timestamps:true
})

const Category =mongoose.model("Category",categorySchema)

function categoryVaildition(obj){
    const schema= Joi.object({
        title:Joi.string().required(),
    })
    return schema.validate(obj)
}


module.exports={
    Category,
    categoryVaildition
}
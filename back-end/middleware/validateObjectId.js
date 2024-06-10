const { default: mongoose } = require("mongoose");

function validateObjectId(req,res,next){
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(500).json({message:"ivalid id"})
    } else {
        next()
    }
}


module.exports={
    validateObjectId
}
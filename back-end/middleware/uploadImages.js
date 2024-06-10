const path =require("path")
const multer = require('multer');

const photoStorage =multer.diskStorage({destination:
function(req,res,cb){
    cb(null,path.join(__dirname,"../images"))
},
filename:function(req,file,cb){
    if (file) {
        const fileExtension = path.extname(file.originalname);
        cb(null,new Date().getTime().toString()+fileExtension)
    } else {
        cb(null,false)
    }
}})

const photoUpload=multer({
    storage:photoStorage,
    fileFilter:function(req,file,cb){
        if(file.mimetype.startsWith("image")){
            cb(null,true)
        }else{
            cb({message:"not supported file"},false)
        }
    },
    limits:{fileSize:1024 * 1024 * 2}
})

module.exports=photoUpload
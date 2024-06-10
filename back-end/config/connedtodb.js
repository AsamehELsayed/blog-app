const mongoose= require('mongoose')

module.exports= async()=>{
    try {
       await  mongoose.connect(process.env.MONGO_URL)
       console.log("connected to database")
    } catch (error) {
        console.log(`faild to connecting with ${process.env.MONGO_URL}`)
    }
}
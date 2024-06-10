const express = require('express');
const connectToDb=require("./config/connedtodb");
const { notfound, errorHandler } = require('./middleware/errorhandler');
const xss=require("xss-clean")
const helmet = require('helmet');
const hpp=require("hpp")
const rateLimit = require('express-rate-limit');
require("dotenv").config()
const cors=require("cors")
connectToDb()
const app=express()
app.use(rateLimit({
    windowMs:10 * 60 *1000,
    max:200
}))
app.use(helmet())
app.use(hpp())
app.use(xss())
app.use(express.json())
app.use(cors({
    origin:"http://localhost:3000"
}))
//routes
app.use(`/api/category`,require("./routes/category"))
app.use("/api/auth/",require("./routes/auth"))
app.use("/api/users/",require("./routes/users"))
app.use("/api/posts/",require("./routes/post"))
app.use("/api/comments/",require("./routes/comment"))
app.use(`/api/password`,require("./routes/password"))
//error handler
app.use(notfound)
app.use(errorHandler)

const port =process.env.PORT
app.listen(port,()=>console.log(`server work on : http://localhost:${port}`))
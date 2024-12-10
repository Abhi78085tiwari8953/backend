//require('dotenv').config({path:'./env'})
import dotenv from "dotenv"

import connectDB from "./db/index.js";
 import {app} from './app.js'

dotenv.config({
    path:'./. env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`server is runnong: ${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.log("server connection failed", error)
})






























/*
import express from "express"
const app = express()

(async ()=>{
    try{
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAMe}`)
    app.on("error",()=>{
        console.log("database not connect express",error);
        throw error;
    })
    app.listen(process.env.PORT,()=>{
        console.log(`App is listening on port ${process.env.PORT}`);
    })

    }catch(error){
        console.log("error")
    }
})()
    */
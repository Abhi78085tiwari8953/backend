import mongoose, {model, Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    userName:{
        type: String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type: String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        
    },
    fullName:{
        type: String,
        required:true,
        index:true,
        trim:true,
        
    },
    avatar:{
        type: String,//cloundary url
        required:true,
       
        
    },
    coverImage:{
        type:String,//clondary url
    },
watchHistory:[
    {
        type:Schema.Types.ObjectId,
        ref:"Video"
    }
],
password:{
    type:String,
    required:[true,'Password is required']
},
refreshToken:{
    type:String
}   
},
{
    timestamps:true
})
userSchema.pre("save",async function(next) {
if(!this.isModified("password"))/*hartime String me bhejta hain */ return next();


this.password = bcrypt.hash(this.password,10)
next()
})

userSchema.methods.isPasswordCorrect = async function (password){
  return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullName
    },
process.env.ACCESS_TOKEN_SECRET,
    {
   expireIn : process.env.ACCESS_TOKEN_EXPIRY
     }
  )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id:this._id,
       
    },
process.env.REFRESH_TOKEN_SECRET,
    {
   expireIn : process.env.REFRESH_TOKEN_EXPIRY
     }
  )
}



export const User = mongoose.model("User",userSchema)
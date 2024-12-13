import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorhandling } from "../utils/errorhandling.js";
import { User } from "../models/user.models.js";



 const verifyJWT = asyncHandler(async(req,res,next)=>{
  try {
     const  token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
  
     if(!token){
      throw new errorhandling(401,"Unathorized request")
     }
     
     const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
  
     const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
  
     if(!user){
      throw new errorhandling(401,"Invalid Access Token")
     }
  
     req.user = user;
     next()
  
  } catch (error) {
    throw new errorhandling(401,error?.message || "Invalid access token")
  }
})
export{verifyJWT}
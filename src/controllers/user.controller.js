import {asyncHandler} from "../utils/asyncHandler.js"
import {errorhandling} from "../utils/errorhandling.js"
import {User} from "../models/user.models.js"
import{uploadONCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res)=>{
    //get user detail


    const {userName,email,fullName,password} = req.body
    console.log("email:" ,email)
    // validation - not empty
    if([userName,email,fullName,password].some((field)=>field?.trim==="")

    ){
        throw new errorhandling(400,"All field are required")
    }
    //check if user already exists:userName,email

    const existUser = User.findOne({
        $or:[{username},{email}]
    })

    if(existUser){
        throw new errorhandling(409,"User with email or userName already exist")
    }
    ////check for images, check for avatar

   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverImageLocalPath = req.file?.coverImage[0]?.path

   if(!avatarLocalPath){
    throw new errorhandling(400,"Avatr file is required")
   }
    //upload them cloudinary, avatar
 const avatar = await uploadONCloudinary(avatarLocalPath);
 const cover = await uploadONCloudinary(coverImageLocalPath )

 if(!avatar){
    throw new errorhandling(400, "Avatar file is required")
 }
  

    // create user object - create entry in db
    const user =    await  User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url|| "",
        email,
        password,
        userName:userName.toLowerCase()
    })

     const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
     )
     if(!createdUser){
        throw new ApiError(500," something error while register")
     }
     return res.status(201).json(new ApiResponse(200,createdUser,"User register Succesfully"))
    //remove password and refresh token field from response
    // check for user creation
    //return response
})

export{registerUser}
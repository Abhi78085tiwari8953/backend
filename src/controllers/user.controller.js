import {asyncHandler} from "../utils/asyncHandler.js"
import {errorhandling} from "../utils/errorhandling.js"
import {User} from "../models/user.models.js"
import{uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const generateAccessAndRefereshToken = async(userID)=>{
try {
   const user = await User.findById(userID);
   const accessToken = user.generateAccessToken();
   const refreshToken = user.generateRefereshToken();


   user.refreshToken = refreshToken
  await  user.save({validateBeforeSave:false})
   
   return {accessToken,refreshToken}

} catch (error) {
    throw new errorhandling(500,"Something went wrong while generating refresh and access token")
}
}






const registerUser = asyncHandler(async (req, res)=>{
    //get user detail
    console.log("Uploaded files:", req.files); 

    const {username,email,fullName,password} = req.body
    console.log("email:" ,email);
    console.log("username",username);
    console.log("fullName",fullName);
    console.log("password",password);
    // validation - not empty
    if([username,email,fullName,password].some((field)=>field?.trim==="")

    ){
        throw new errorhandling(400,"All field are required")
    }
    //check if user already exists:userName,email

    const existUser = await User.findOne({
        $or:[{username},{email}]
    })

    if(existUser){
        throw new errorhandling(409,"User with email or userName already exist")
    }
    ////check for images, check for avatar

    const avatarLocalPath = req.files?.avatar[0]?.path;
// const avatarLocalPath = req.files?.avatar ? req.files.avatar[0]?.path : null;
   // const coverImageLocalPath = req.file?.coverImage[0]?.path
   console.log("Avatar file path:", avatarLocalPath);

//    let coverImageLocalPath;
//         if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
//            coverImageLocalPath = req.files.coverImage[0].path
        
//         }

   if(!avatarLocalPath){
    throw new errorhandling(400,"Avatr file is required")
   }
    //upload them cloudinary, avatar
 const avatar = await uploadOnCloudinary(avatarLocalPath);
 console.log("file is upload",avatar);
//  const cover = await uploadONCloudinary(coverImageLocalPath )
const coverImageLocalPath = req.files?.coverImage ? req.files.coverImage[0]?.path : null;
const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

 if(!avatar){
    throw new errorhandling(400, "Avatar file is mustly required")
 }
  

    // create user object - create entry in db
    const user =    await  User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url|| "",
        email,
        password,
        username:userName.toLowerCase()
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

   
} );



 //LOGIN WORK
 const loginUser = asyncHandler(async (req,res)=>{
    // req body -> data
    //username or email
    // find the user
    //password check
    // access and refresh token
    //send cookie
    const{email,username,password} = req.body;
    if(!username|| !email){
        
        
            throw new errorhandling(400," username or password is required")
      
       
    }
    const user = await User.findOne({
        $or:[{username},{email}]
    })
    
    if(!user){
        throw new errorhandling(404,"User does not exist");
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if(!isPasswordValid){
    throw new errorhandling(405,"Password is not valid");
}

    const {accessToken,refreshToken} = await generateAccessAndRefereshToken(user._id)


   const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

     const options = {
        httpOnly:true,
        secure:true
     }
     return res.status(200)
     .cookie("accessToken",accessToken, options)
     .cookie("refreshToken",refreshToken,options)
     .json(
        new ApiResponse(
            200,{
                user:loggedInUser,accessToken,
                refreshToken
            },
            "User logged in successfully"
        )
     )
    
});


//Logged Out User

const logOut = asyncHandler(async(req,res)=>{
   User.findByIdAndUpdate(
    req.user._id,
    {
        $set:{
            refreshToken:undefined
        }
    },
    {
        new:true
    }
   )

   const options = {
    httpOnly:true,
    secure:true
 }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logOut"))
})

const refreshAcessToken = asyncHandler(async(req,res)=>{
   try {
    // yeh user bhej rhain hain
     const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
     if(!incomingRefreshToken){
         throw new errorhandling(401,"unauthorized request")
     }
     const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
 // jo database ke andar hain
     const user = await User.findById(decodedToken?._id);
 
     if(!user){
         throw new errorhandling(401,"invalid regresh token")
     }
 //compare kar rahe hain (user jo likha hain or database me padha )
     if(incomingRefreshToken!== user?.refreshToken){
         throw new errorhandling(401,"refresh token is  not valid");
     }
     const options = {
         httpOnly : true,
         secure:true
     }
 
     const {accessToken,newrefreshToken} = await generateAccessAndRefereshToken(user._id)
 
     return res.ststus(200)
     .cookie("accessToken", accessToken,options)
     .cookie("refreshToken", newrefreshToken,options)
     .json(
         new ApiResponse(
             200,
             {accessToken,refreshToken:newrefreshToken},
             "Access token refreshed"
         )
     )
   } catch (error) {
    throw new errorhandling(401,error?.message||"invalid token")
   }
})


export { registerUser,loginUser,logOut,refreshAcessToken };


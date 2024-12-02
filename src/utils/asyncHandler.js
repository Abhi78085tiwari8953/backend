const asyncHandler = (requestHandler) => {
  return  (req,res,next) =>{
        Promise.resolve(requestHandler(req,res,next)).catch((error)=>next(error))
    }
}

// const asyncHandler = (fn) =>async(req,res,next)=>{
//    try {
//     await fn(req,res,next)
//    } catch (error) {
//     res.status(err.code || 500).json({
//         sucess: false,
//         message:err.message
//     })
//    }
// }
export{asyncHandler}
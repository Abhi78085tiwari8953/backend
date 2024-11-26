import mongoose ,{module,Schema}from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"


const userVideo = new Schema({
    thumbnail:{
       type:String,
       required:[true,"Write our thumbail"]
    },
    title:{
        type:String,
        required:[true,"Short tittle"]
    },
    description:{
          type:String,
          required:true
    },
    duration:{
        type:Number,
        required:true
    },
    views:{
        type:Number,
        default:0,
       
    },
    createdAt:{
        type:Date,
        required:true
    },
    updatedAt:{
        type:Date,
        required:true
    },
    isPublished:{
        type:Boolean,
       default:true
    },
    owner:[{
        type:Schema.Types.ObjectIdId,
        ref:"User"
    }],
    videoFile:{
     type:String,//cloud
     required:true
    }
},{timestamps:true})

userVideo.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("video",userVideo)
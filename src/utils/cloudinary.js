import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"



cloudinary.config({ 
    cloud_name: 'process.env.CLOUDINARY_CLOUD_NAME', 
    api_key: 'process.env.CLOUDINARY_API_KEY', 
    api_secret: 'process.env.CLODINARY_API_SECREAT' // Click 'View API Keys' above to copy your API secret
});

const uploadONCloudinary = async (localFilePath)=>{
    try {
        if(!localFilePath) return null;
        //uploadFileinCloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        console.log("file is uploaded on cloudinary",response.url);
        return response;
    } catch (error) {
       fs.unlinkSync(localFilePath)// remove the locally saved temporary file as the upload operation got failed
       return null; 
    }
}

export{uploadONCloudinary}
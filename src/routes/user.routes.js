import{Router} from "express"
import { registerUser } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middlewares.js";


const router = Router()
router.route("/register").post( 
    upload.fields([
        {
            // yeh communication hona chahiya fronted and backend me uska name avatar hona chahiya
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser

)



export default router
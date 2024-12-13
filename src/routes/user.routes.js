import{Router} from "express"
import { loginUser, logOut, registerUser,refreshAcessToken } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


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

router.route("/login").post(loginUser)
//secured routes

router.route("/logout").post(verifyJWT,logOut)
router.route("/refresh-Token").post(refreshAcessToken)



export default router
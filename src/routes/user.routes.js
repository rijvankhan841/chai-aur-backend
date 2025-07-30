// import express from "express";
import {Router} from "express";
import {registerUser} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middeleware.js"


const router = Router()

router.route("/register").post(
    upload.fields([
        {
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
// console.log("Router loaded")

export default router;
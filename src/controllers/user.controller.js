import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    // res.status(200).json({
    // message:"chai aur code"
    // })




    //    get user details from frontend
    //    validation - not empty
    //    check if user already exixsts: username.email
    //    check for images , check for avatar
    //    upload them to cloudinary, avatar
    //    create user object - create entry in db
    //    remove password and refresh token field from response
    //    check for user creation
    //    return response(res)

    const { fullname, email, username, password } = req.body
    console.log("email:", email)

    // if(fullname === ""){
    //     throw new ApiError(400,"fullname is required")
    // }

    if (
        [fullname, email, username, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exixt")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
       "-password -refreshToken" 
    )

    if(!createdUser){
        throw new ApiError(500,"something went wront while the registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registerd Successfully")
    )


})

export { registerUser, } 
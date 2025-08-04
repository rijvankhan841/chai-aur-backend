import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
// import jwt from "jsonwebtoken"
// import mongoose from "mongoose";


// const generateAccessAndRefereshTokens = async(userId) =>{
//     try {
//         const user = await User.findById(userId)
//         const accessToken = user.generateAccessToken()
//         const refreshToken = user.generateRefreshToken()

//         user.refreshToken = refreshToken
//         await user.save({ validateBeforeSave: false })

//         return {accessToken, refreshToken}


//     } catch (error) {
//         throw new ApiError(500, "Something went wrong while generating referesh and access token")
//     }
// }

const registerUser = asyncHandler(async (req, res) => {

    console.log("--------------- STARTING REGISTER USER ---------------");
    console.log("1. RECEIVED REQ. BODY : ", req.body)
    console.log("2. RECEIVED REQ. FILES : ", req.files);
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const { fullName, email, username, password } = req.body
    //console.log("email: ", email);


    // Check if basic fields are empty
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        console.log("Validation Failed: All fields are required - Some field is empty/whitespace.");
        throw new ApiError(400, "All fields are required")
    }
    console.log("3. Basic fields present.");

    // Check if user already exists
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })


    if (existedUser) {
        console.log("Validation Failed: User with email or username already exists.");
        throw new ApiError(409, "User with email or username already exists")
    }

    console.log("4. User does not exist already.");

    // Get local paths for avatar and cover image
    const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log("5. avatarLocalPath:", avatarLocalPath);
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }


    console.log("6. coverImageLocalPath:", coverImageLocalPath);
    // if (!avatarLocalPath) {
    //     throw new ApiError(400, "Avatar file is required")
    // }

    // ************* YAHAN DHYAN DEIN *************
    // Jo error aa raha hai "avatar: Path `avatar` is required", woh is block ko hit kar sakta hai

    if (!avatarLocalPath) { // Agar avatarLocalPath undefined ya empty string hai
        console.log("Validation Failed: Avatar file is required (avatarLocalPath missing).");
        throw new ApiError(400, "Avatar file is required");
    }
    console.log("7. Avatar local path is present.");

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    console.log("8. Cloudinary Avatar Upload Response:", avatar);

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    console.log("9. Cloudinary Cover Image Upload Response:", coverImage);

    // ************* YAHAN BHI DHYAN DEIN *************
    // Agar Cloudinary se avatar ka URL nahi mila, toh bhi yeh hit ho sakta hai

    // if (!avatar) {
    //     throw new ApiError(400, "Avatar file is required")
    // }

    if (!avatar || !avatar.url) { // Check if avatar object or its url property is missing
        console.log("Validation Failed: Failed to upload avatar or avatar URL is missing.");
        throw new ApiError(400, "Failed to upload avatar file or URL not found");
    }
    console.log("10. Avatar uploaded successfully to Cloudinary.");




    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username?.toLowerCase()
    });

    console.log("11. User creation attempt successful, user ID:", user._id);

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

})

export { registerUser }

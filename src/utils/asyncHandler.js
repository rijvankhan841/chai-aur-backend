const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}

export { asyncHandler }



// const asyncHandler = () => {
// const asyncHandler = (func) => () => {}
// const asyncHandelr = (func) => async () => {}



// const asyncHandler = (fn) => async (req,res,next) => {
//     try {
//       await fn(req,res,next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             succes:false,
//             message:err.message
//         })
//     }
// }
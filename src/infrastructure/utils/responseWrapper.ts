export const responseWrapper = (res, code, isSuccess, message, data) =>{
  return res.status(code).json({success: isSuccess, message, data})
}
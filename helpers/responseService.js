// exports.success = (res,statusCode,responseMessage,responseData)=>{
//     return res.status(statusCode).json({success:true,message:responseMessage,data:responseData})
// }

// exports.failure = (res,statusCode,responseMessage)=>{
//     return res.status(statusCode).json({success:false,message:responseMessage})
// }
exports.response = (res, code, responseMessage, responseData) => {
  return res
    .status(code)
    .json({ message: responseMessage, data: responseData });
};

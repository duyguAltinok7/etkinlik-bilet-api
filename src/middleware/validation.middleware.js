const AppError=require("../utils/AppError");
const validationMiddleware=(schema)=>{
    return (req,res,next)=>{
        const {error}=schema.validate(req.body);
        if(error){
           const message=error.details[0].message;
           return next(new AppError(message,400));
        }
        next()
    }
};
module.exports=validationMiddleware;
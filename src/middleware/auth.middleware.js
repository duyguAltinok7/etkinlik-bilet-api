const jwt=require("jsonwebtoken")
const authMiddleware=(req,res,next)=>{
    try{
        const authHeader=req.headers.authorization;
        if(!authHeader ){
            return res.status(401).json({message:"token bulunamadı"});

        }
        const [type,token]=authHeader.split(" "); // bearer[0] token[1]
        if(type !=='Bearer'){
            return res.status(401).json({
                message:"geçersiz authorization formatı "
            });
        }
        const decoded=jwt.verify(
            token,
            process.env.JWT_SECRET

        )
        req.user=decoded;
        next();

    }catch(err){
        next(err)
    }

};

module.exports=authMiddleware;
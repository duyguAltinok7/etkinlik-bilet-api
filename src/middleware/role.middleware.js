const roleMiddleware=(...allowedRoles)=>{
    return (req,res,next)=>{
        if(!req.user){
            return res.status(401).json({
                message:"kimlik doğrulama gerekli"
            });
        }
        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({
                message:"bu işlem içiçn yetkiniz yok"
            });
        }
        next();
    }
};
module.exports=roleMiddleware
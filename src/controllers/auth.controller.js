const services=require("../services/auth.service");

const authRegister=async(req,res,next)=>{
    try{
        const {name,email,password}=req.body;
        const data={name,email,password};
        const regist=await services.authRegister(data);
        res.status(201).json(regist)

    }catch(err){
        next(err)
    }
}
const authLogin=async(req,res,next)=>{
    try{
        const {email,password}=req.body;
        const data={email,password};
        const login=await services.authLogin(data);
        res.status(200).json(login)

    }catch(err){
        next(err)
    }
}
const authRefresh=async(req,res,next)=>{
    try{
        const {refreshToken}=req.body;
        const result=await services.authRefresh(refreshToken);
        res.status(200).json(result);

    }catch(err){
        next(err)
    }
};

const authLogout =async(req,res,next)=>{
    try{
        const {refreshToken}=req.body;
        await services.authLogout(refreshToken);
        res.status(204).send()


    }catch(err){
        next(err)
    }
}
module.exports={
    authRegister,
    authLogin,
    authRefresh,
    authLogout
}
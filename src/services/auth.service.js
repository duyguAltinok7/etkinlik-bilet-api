const userRepository=require("../repositories/user.repositories");
const refreshTokenRepository=require("../repositories/refreshToken.repositories");
const AppError=require("../utils/AppError")
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const crypto=require("crypto");

const generateAccessToken= (user)=>{
    return jwt.sign(
        {
            id:user.id,
            email:user.email,
            role:user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"15m"
        }
    );
};
// burda refreshtoken üretiyoruz 
const generateRefreshToken = () =>{
    return crypto.randomBytes(64).toString("hex");
};

const authRegister=async(data)=>{
    const {name,email,password}=data;
    const existingUser=await userRepository.findUserByEmail(email);
    if(existingUser){
        throw new AppError("bu email ile daha önce kayıt olunmuş",409);
       
    };
    const hashedPassword=await bcrypt.hash(password,10);
    const newUser={
        name,
        email,
        password:hashedPassword,
        role:"user"
    };
    const user=await userRepository.createUser(newUser);

    const { password :_, 
        ...userWithoutPassword}=user;
    return userWithoutPassword
}

const authLogin=async(data)=>{
    const {email,password}=data;
    const user=await userRepository.findUserByEmail(email);
    if(!user){
        throw new AppError("email veya şifre hatalı",401);
        
    };

    const passwordMatch=await bcrypt.compare(password,user.password);

    if(!passwordMatch){
       throw new AppError(" email veya şifre  hatalı",401);
        
    };

    const accessToken=generateAccessToken(user);
    const refreshToken=generateRefreshToken();

    const expiresAt=new Date(
        Date.now()+ 7*24*60*60*1000
    );
    await refreshTokenRepository.createRefreshToken({
        token:refreshToken,
        userId: user.id,
        expiresAt
    });
    return {accessToken,refreshToken};
};

const authRefresh=async(token)=>{
    const storedToken=await refreshTokenRepository.findByToken(token);
    if(!storedToken){
        throw new AppError("geçersiz refresh token",401);
       
    }
    if(storedToken.expiresAt <new Date()){
        await refreshTokenRepository.deleteByToken(token);
        throw new AppError("refresh token süresi dolmuş",401);
       
    };
    const user=await userRepository.findUserById(storedToken.userId);
    if(!user){
        throw new AppError("kullanıcı bulunamadı",404);
        
    }
    const accessToken=generateAccessToken(user);

    return {accessToken};
};

const authLogout = async (refreshToken) => {
    const token = await refreshTokenRepository.findByToken(refreshToken);

    if (!token) {
       throw new AppError("Geçersiz refresh token",401);
     
    }

    await refreshTokenRepository.deleteByToken(refreshToken);

    return {
        message: "Başarıyla çıkış yapıldı"
    };
};

module.exports={
    authRegister,
    authLogin,
    authRefresh,
    authLogout
}
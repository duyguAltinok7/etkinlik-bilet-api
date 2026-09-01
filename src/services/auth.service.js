const userRepository=require("../repositories/user.repositories");
const refreshTokenRepository=require("../repositories/refreshToken.repositories");
const AppError=require("../utils/AppError")
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const crypto=require("crypto");
const logger=require("../utils/logger")

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
        logger.warn("bu email ile daha önce kayıt olunmuş")
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
    logger.info("kullanıcı başarıyla kayıt oldu",{userId: user.id});
    return userWithoutPassword
}

const authLogin=async(data)=>{
    const {email,password}=data;
    const user=await userRepository.findUserByEmail(email);
    if(!user){
        logger.warn("Giriş başarısız kullanıcı bulunamadı")
        throw new AppError("email veya şifre hatalı",401);
        
    };

    const passwordMatch=await bcrypt.compare(password,user.password);

    if(!passwordMatch){
        logger.warn("giriş başarısız şifre hatalı") // uygulama hatası değil warn kullanabilirz
       throw new AppError(" email veya şifre  hatalı",401);
        
    };
    logger.info("kullanıcı başarıyla giriş yaptı",{userId:user.id});
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
        logger.warn("geçersiz refresh token kullanıldı")
        throw new AppError("geçersiz refresh token",401);
       
    }
    if(storedToken.expiresAt <new Date()){
        logger.warn("refresh token süresi dolmuş")
        await refreshTokenRepository.deleteByToken(token);
        throw new AppError("refresh token süresi dolmuş",401);
       
    };
    const user=await userRepository.findUserById(storedToken.userId);
    if(!user){
        logger.error("refresh tokene bağlı kullanıcı bulunamadı")
        throw new AppError("kullanıcı bulunamadı",404);
        
    }
    const accessToken=generateAccessToken(user);
    logger.info("access token başarıyla yenilendi",{userId:user.id})

    return {accessToken};
};

const authLogout = async (refreshToken) => {
    const token = await refreshTokenRepository.findByToken(refreshToken);

    if (!token) {
        logger.warn("geçersiz refresh token ile logout denemesi")
       throw new AppError("Geçersiz refresh token",401);
     
    }

    await refreshTokenRepository.deleteByToken(refreshToken);
    logger.info("kullanıcı başarıyla çıkış yaptı",{userId: token.id})

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
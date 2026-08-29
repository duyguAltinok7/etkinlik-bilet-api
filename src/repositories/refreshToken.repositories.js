
const prisma=require("../config/prisma");
// burda amacımız yeni refresh tokeni db ye kaydetmek
const createRefreshToken=async(data)=>{
    const refreshToken=await prisma.refreshToken.create({
          data
    
    });
    return refreshToken;
}
// burda amac db' de bu token var mı 
const findByToken=async(token)=>{
    const refreshToken=await prisma.refreshToken.findUnique({
        where: {
            token
        }
    });
    return refreshToken;
};
//refreshtokeni db'den sil
const deleteByToken=async(token)=>{
    const refreshToken=await prisma.refreshToken.delete({
        where:{
            token
        }
    });
    return refreshToken
};
// kullanıcının bütün refrshtoken larını siler
const deleteAllByUserId=async(userId)=>{
    const result=await prisma.refreshToken.deleteMany({
        where: {
            userId
        }
    });
    return result;
};

module.exports={
    createRefreshToken,
    findByToken,
    deleteByToken,
    deleteAllByUserId
}
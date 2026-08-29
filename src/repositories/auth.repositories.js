const prisma=require("../config/prisma");

const findUserByEmail=async(email)=>{
    const kullanici=await prisma.user.findUnique({
        where:{ email }
    })
    return kullanici;
}

const createUser=async(newUser)=>{
    const user=await prisma.create({
        data:newUser
    })
    return user;
};
module.exports={
    findUserByEmail,
    createUser
}
const repositories = require("../repositories/user.repositories");
const AppError=require("../utils/AppError")
const bcrypt=require("bcrypt");


const getUserById = async (id) => {

    const user = await repositories.findUserById(id);

    if (!user) {
        throw  new AppError("Kullanıcı bulunamadı",404);
        
    }

    const {
        password: _,
        ...userWithoutPassword
    } = user;

    return userWithoutPassword;
};


const updateUser = async (id, userData) => {

    const user = await repositories.findUserById(id);

    if (!user) {
        throw  new AppError("Kullanıcı bulunamadı",404);
      
    }

    if (userData.email) {

        const emailControl =
            await repositories.findUserByEmail(userData.email);

        if (emailControl && emailControl.id !== id) {
            throw new AppError(
                "Bu email başka bir kullanıcı tarafından kullanılıyor",409
            );

            
        }
    }

    const updatedUser =
        await repositories.updateUser(id, userData);

    const {
        password: _,
        ...userWithoutPassword
    } = updatedUser;

    return userWithoutPassword;
};


const deleteUser = async (id) => {

    const user = await repositories.findUserById(id);

    if (!user) {
        throw new AppError("Kullanıcı bulunamadı",404);
     
    }

    await repositories.deleteUser(id);

    return {
        message: "Kullanıcı başarıyla silindi"
    };
};

const changedPassword=async(id,oldPassword,newPassword)=>{
    const user=await repositories.findUserById(id);
    if(!user){
        throw new AppError("kullanıcı bulunamadı",404);
        
    }
    const passwordMatch=await bcrypt.compare(
        oldPassword,
        user.password
    );
    if(!passwordMatch){
        throw new   AppError("mevcut şifre yanlış ",401);
       
    }
    if(oldPassword===newPassword){
        throw new AppError("Yeni şifre eski şifreyle aynı olamaz",400);
       

    }
    if(newPassword.length<6){
        throw new AppError("yeni şifre  en az 6 karakter olmalı",400);
      

    }
    const hashedPassword=await bcrypt.hash(newPassword,10);
    await repositories.updateUser(id,{
        password:hashedPassword
    });
    return {
        message:"şifre başarıyla değiştirildi "
    }
}

module.exports = {
    getUserById,
    updateUser,
    deleteUser,
    changedPassword
};
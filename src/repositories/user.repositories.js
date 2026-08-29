const prisma = require("../config/prisma");


const findUserByEmail = async (email) => {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    return user;
};


const findUserById = async (id) => {
    const user = await prisma.user.findUnique({
        where: {
            id
        }
    });

    return user;
};


const createUser = async (data) => {
    const user = await prisma.user.create({
        data
    });

    return user;
};


const updateUser = async (id, data) => {
    const user = await prisma.user.update({
        where: {
            id
        },
        data
    });

    return user;
};


const deleteUser = async (id) => {
    const user = await prisma.user.delete({
        where: {
            id
        }
    });

    return user;
};
const changePassword = async (req, res, next) => {
    try {

        const id = req.user.id;

        const {
            oldPassword,
            newPassword
        } = req.body;

        const result =
            await services.changePassword(
                id,
                oldPassword,
                newPassword
            );

        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
};


module.exports = {
    findUserByEmail,
    findUserById,
    createUser,
    updateUser,
    deleteUser,
    changePassword
};
const services = require("../services/user.services");


const getMe = async (req, res, next) => {
    try {

        const user =
            await services.getUserById(req.user.id);

        res.status(200).json(user);

    } catch (err) {
        next(err);
    }
};


const updateMe = async (req, res, next) => {
    try {

        const id = req.user.id;

        const {
            name,
            email
        } = req.body;

        const userData = {
            name,
            email
        };

        const updatedUser =
            await services.updateUser(id, userData);

        res.status(200).json(updatedUser);

    } catch (err) {
        next(err);
    }
};


const deleteMe = async (req, res, next) => {
    try {

        const id = req.user.id;

        const result =
            await services.deleteUser(id);

        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
};


const changedPassword = async (req, res, next) => {
    try {

        const id = req.user.id;

        const {
            oldPassword,
            newPassword
        } = req.body;

        const result =
            await services.changedPassword(
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
    getMe,
    updateMe,
    deleteMe,
    changedPassword
};
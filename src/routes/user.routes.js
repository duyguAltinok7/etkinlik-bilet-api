const express = require("express");

const router = express.Router();

const controller =
    require("../controllers/user.controller");

const authMiddleware =
    require("../middleware/auth.middleware");


router.get(
    "/me",
    authMiddleware,
    controller.getMe
);


router.put(
    "/me",
    authMiddleware,
    controller.updateMe
);


router.delete(
    "/me",
    authMiddleware,
    controller.deleteMe
);
router.put(
    "/me/password",
    authMiddleware,
    controller.changedPassword
);


module.exports = router;
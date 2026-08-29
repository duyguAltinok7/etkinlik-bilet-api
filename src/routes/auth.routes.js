const express = require("express");

const router = express.Router();

const controller =require("../controllers/auth.controller");
const validationMiddleware = require("../middleware/validation.middleware");
const { registerSchema, loginSchema } = require("../validators/auth.validator");


router.post("/register",validationMiddleware(registerSchema) ,controller.authRegister
);


router.post("/login",validationMiddleware(loginSchema),controller.authLogin);


router.post("/refresh",controller.authRefresh);


router.post("/logout",controller.authLogout);


module.exports = router;
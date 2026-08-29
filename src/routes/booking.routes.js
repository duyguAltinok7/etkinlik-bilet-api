const express = require("express");

const router = express.Router();

const controller = require("../controllers/booking.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.post(
    "/",
    authMiddleware,
    controller.createBooking
);

module.exports = router;
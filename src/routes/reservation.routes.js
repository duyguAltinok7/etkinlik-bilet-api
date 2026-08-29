
const express = require("express");

const router = express.Router();

const controller =require("../controllers/reservation.controller");

const authMiddleware =require("../middleware/auth.middleware");

const roleMiddleware =require("../middleware/role.middleware");

router.get(  "/", authMiddleware, controller.getReservations);


router.get("/:id",authMiddleware,controller.getReservationById);


router.post( "/", authMiddleware, roleMiddleware("user", "organizer", "admin"), controller.createReservation);



router.put( "/:id/cancel", authMiddleware, controller.cancelReservation);


router.delete("/:id",authMiddleware, controller.deleteReservation);


module.exports = router;


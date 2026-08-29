const express = require("express");

const router = express.Router();

const controller = require("../controllers/seat.controller");

router.get("/", controller.getSeats);

router.get("/:id", controller.getSeatById);

router.get("/venue/:venueId", controller.getSeatsByVenue);

router.post("/", controller.createSeat);

router.put("/:id", controller.updateSeat);

router.delete("/:id", controller.deleteSeat);

module.exports = router;
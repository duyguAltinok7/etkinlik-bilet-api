const express=require("express");
const router=express.Router();
const controller=require("../controllers/event.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

router.get("/",controller.getEvents);
router.get("/:id",controller.getEventById);
router.post("/",authMiddleware,roleMiddleware("admin","organizer"),controller.createEvent);
router.put("/:id",authMiddleware,roleMiddleware("admin","organizer"),controller.updateEvent);
router.delete("/:id",authMiddleware,roleMiddleware("admin"),controller.deleteEvent);

module.exports=router;

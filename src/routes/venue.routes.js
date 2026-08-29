const express=require("express");
const router=express.Router();
const controller=require("../controllers/venue.controller");
const authMiddleware=require("../middleware/auth.middleware")
const roleMiddleware=require("../middleware/role.middleware");

router.get("/",controller.getVenues);
router.get("/:id",controller.getVenueById);
router.post("/",authMiddleware,roleMiddleware("admin","organizer"),controller.createVenue);
router.put("/:id",authMiddleware,roleMiddleware("admin","organizer"),controller.updateVenue);
router.delete("/:id",authMiddleware,roleMiddleware("admin"),controller.deleteVenue);

module.exports=router;
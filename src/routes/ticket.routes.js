const express=require("express");
const router=express.Router();
const controller=require("../controllers/ticket.controller");

router.get("/",controller.getTickets);
router.get("/:id",controller.getTicketById);
router.post("/",controller.createTicket);
router.put("/:id",controller.updateTicket);
router.delete("/:id",controller.deleteTicket);
module.exports=router;
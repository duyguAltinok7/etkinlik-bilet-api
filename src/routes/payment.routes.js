const express=require("express");
const router=express.Router();
const controller=require("../controllers/payment.controller");

router.get("/",constroller.getPayments);
router.get("/:id",controller.getPaymentById);
router.post("/",controller.createPayment);
router.put("/:id",controller.updatePayment);
router.delete("/:id",controller.deletePayment);

module.exports=router;
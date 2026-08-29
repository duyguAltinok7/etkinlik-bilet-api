const services=require("../services/payment.service");

const getPayments=async(req,res,next)=>{
    try{
        const payments=await services.getPayments();
        res.status(200).json(payments)

    }catch(err){
        next(err)
    }
    
};
const getPaymentById=async(req,res,next)=>{
    try{
        const id=Number(req.params.id);
        const payment=await services.getPaymentById(id);
        res.status(200).json(payment);


    }catch(err){
        next(err)
    }

};
const createPayment=async(req,res,next)=>{
    try{
        const {reservationId,amount,status,paymentMethod,transactionId}=req.body;
        const paymentData={reservationId,amount,status,paymentMethod,transactionId};
        const newPayment=await services.createPayment(paymentData);
        res.status(201).json(newPayment);

    }catch(err){
        next(err)
    }


}

const updatePayment=async(req,res,next)=>{
    try{
        const id=Number(req.params.id);
        const {reservationId,amount,status,paymentMethod,transactionId}=req.body;
        const paymentData={reservationId,amount,status,paymentMethod,transactionId}
        const newUpdatePayment=await services.updatePayment(id,paymentData);
        res.status(200).json(newUpdatePayment)

    }catch(err){
        next(err)
    }

}

const deletePayment=async(req,res,next)=>{
    try{
        const id=Number(req.params.id);
        const delPayment=await services.deletePayment(id);
        res.status(200).json(delPayment);

    }catch(err){
        next(err)
    }

}
module.exports={
    getPayments,
    getPaymentById,
    createPayment,
    updatePayment,
    deletePayment
}
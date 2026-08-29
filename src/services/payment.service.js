const repositories = require("../repositories/payment.repositories");
const AppError=require("../utils/AppError")

const getPayments = async () => {

    const payments = await repositories.getPayments();

    return payments;
};

const getPaymentById = async (id) => {

    const payment = await repositories.getPaymentById(id);

    if (!payment) {
       throw new AppError("Ödeme bulunamadı",404);
        
    }

    return payment;
};

const createPayment = async (paymentData) => {

    const {
        reservationId,
        amount,
        status,
        paymentMethod,
        transcationId
    } = paymentData;

    // Rezervasyon kontrolü
    const reservation =
        await repositories.findReservation(reservationId);

    if (!reservation) {
        throw new AppError("Bu rezervasyon bulunamadı",404);

     
    }

    // Amount kontrolü
    if (amount <= 0) {
        throw new AppError("Ödeme miktarı sıfırdan büyük olmalı",400);

       
    }

    // Yeni ödeme REFUNDED olamaz
    if (status === "REFUNDED") {
        throw new AppError(
                "Yeni ödeme REFUNDED durumunda oluşturulamaz",400
            );

        
    }

    // Geçerli status kontrolü
    if (
        status !== "PENDING" &&
        status !== "SUCCESS" &&
        status !== "FAILED"
    ) {
        throw new AppError("Geçersiz ödeme durumu",400);

      
    }

    // Payment method kontrolü
    if (
        paymentMethod !== "CREDIT_CARD" &&
        paymentMethod !== "BANK_TRANSFER" &&
        paymentMethod !== "CASH"
    ) {
        throw new AppError("Geçerli bir ödeme yöntemi girilmedi",400);

       
    }

    // Transaction ID daha önce kullanılmış mı?
    const existingTransaction =
        await repositories.findTransactionById(transcationId);

    if (existingTransaction) {
        throw new AppError("Bu transaction ID daha önce kullanılmış",409);

       
    }

    const newPayment =
        await repositories.createPayment(paymentData);

    return newPayment;
};

const updatePayment = async (id, paymentData) => {

    const existingPayment =
        await repositories.getPaymentById(id);

    if (!existingPayment) {
        throw new AppError("Ödeme bulunamadı",404);

       
    }

    const updatedPayment =
        await repositories.updatePayment(id, paymentData);

    return updatedPayment;
};

const deletePayment = async (id) => {

    const existingPayment =
        await repositories.getPaymentById(id);

    if (!existingPayment) {
        throw new AppError("Ödeme bulunamadı",404);

        
    }

    const deletedPayment =
        await repositories.deletePayment(id);

    return deletedPayment;
};

module.exports = {
    getPayments,
    getPaymentById,
    createPayment,
    updatePayment,
    deletePayment
};
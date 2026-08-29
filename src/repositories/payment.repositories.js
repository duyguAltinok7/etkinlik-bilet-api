const prisma = require("../config/prisma");

const getPayments = async () => {

    const payments =
        await prisma.payment.findMany();

    return payments;
};

const getPaymentById = async (id) => {

    const payment =
        await prisma.payment.findUnique({
            where: {
                id
            }
        });

    return payment;
};

const findReservation = async (reservationId) => {

    const reservation =
        await prisma.reservation.findUnique({
            where: {
                id: reservationId
            }
        });

    return reservation;
};

const findTransactionById = async (transcationId) => {

    const transaction =
        await prisma.payment.findFirst({
            where: {
                transcationId
            }
        });

    return transaction;
};

const createPayment = async (paymentData) => {

    const newPayment =
        await prisma.payment.create({
            data: paymentData
        });

    return newPayment;
};

const updatePayment = async (id, paymentData) => {

    const updatedPayment =
        await prisma.payment.update({
            where: {
                id
            },
            data: paymentData
        });

    return updatedPayment;
};

const deletePayment = async (id) => {

    const deletedPayment =
        await prisma.payment.delete({
            where: {
                id
            }
        });

    return deletedPayment;
};

module.exports = {
    getPayments,
    getPaymentById,
    findReservation,
    findTransactionById,
    createPayment,
    updatePayment,
    deletePayment
};

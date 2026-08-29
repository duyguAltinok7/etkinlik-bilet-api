//burda amacım rezervasyon+ödeme+bilet işlemlerini birlikte yönetmek 
// burdada transaction kullancaz çünkü bu birden fazla veritabanı işlemlerini tek bir işlem gibi yönetir
const prisma = require("../config/prisma");
const repositories = require("../repositories/booking.repositories");

const createBooking = async (data) => {

    return await prisma.$transaction(async (tx) => {

        const reservation = await repositories.createReservation(
            tx,
            data
        );

        const payment = await repositories.createPayment(
            tx,
            {
                reservationId: reservation.id,
                amount: data.amount,
                paymentMethod: data.paymentMethod,
                transactionId: data.transactionId
            }
        );

        const ticket = await repositories.createTicket(
            tx,
            {
                reservationId: reservation.id,
                ticketNumber: data.ticketNumber,
                amount: data.amount
            }
        );

        return {
            reservation,
            payment,
            ticket
        };
    });
};

module.exports = {
    createBooking
};
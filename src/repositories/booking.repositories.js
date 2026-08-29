const createReservation = async (tx, data) => {

    const reservation = await tx.reservation.create({
        data: {
            userId: data.userId,
            eventId: data.eventId,
            seatId: data.seatId,
            status: "PENDING"
        }
    });

    return reservation;
};


const createPayment = async (tx, data) => {

    const payment = await tx.payment.create({
        data: {
            reservationId: data.reservationId,
            amount: data.amount,
            status: "SUCCESS",
            paymentMethod: data.paymentMethod,
            transactionId: data.transactionId
        }
    });

    return payment;
};


const createTicket = async (tx, data) => {

    const ticket = await tx.ticket.create({
        data: {
            reservationId: data.reservationId,
            ticketNumber: data.ticketNumber,
            price: data.amount,
            status: "ACTIVE"
        }
    });

    return ticket;
};


module.exports = {
    createReservation,
    createPayment,
    createTicket
};
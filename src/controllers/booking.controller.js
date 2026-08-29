const services = require("../services/booking.service");

const createBooking = async (req, res, next) => {
    try {

        const {
            eventId,
            seatId,
            amount,
            paymentMethod,
            transactionId,
            ticketNumber
        } = req.body;

        const data = {
            userId: req.user.id,
            eventId,
            seatId,
            amount,
            paymentMethod,
            transactionId,
            ticketNumber
        };

        const booking = await services.createBooking(data);

        res.status(201).json(booking);

    } catch (err) {
        next(err);
    }
};

module.exports = {
    createBooking
};
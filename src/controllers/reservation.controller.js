
const services = require("../services/reservation.service");
const getReservations = async (req, res, next) => {

    try {

        const reservations =
            await services.getReservations(req.user);

        res.status(200).json(reservations);

    } catch (err) {

        next(err);
    }
};

const getReservationById = async (req, res, next) => {

    try {

        const id = Number(req.params.id);

        const reservation =
            await services.getReservationById(
                id,
                req.user
            );

        res.status(200).json(reservation);

    } catch (err) {

        next(err);
    }
};

const createReservation = async (req, res, next) => {

    try {

        const {
            eventId,
            seatId
        } = req.body;


        const reservationData = {

            userId: req.user.id,

            eventId: Number(eventId),

            seatId: Number(seatId)

        };


        const newReservation =
            await services.createReservation(
                reservationData
            );


        res.status(201).json(newReservation);

    } catch (err) {

        next(err);
    }
};


const cancelReservation = async (req, res, next) => {

    try {

        const id = Number(req.params.id);

        const cancelledReservation =
            await services.cancelReservation(
                id,
                req.user
            );


        res.status(200).json(
            cancelledReservation
        );

    } catch (err) {

        next(err);
    }
};

const deleteReservation = async (req, res, next) => {

    try {

        const id = Number(req.params.id);

        const deletedReservation =
            await services.deleteReservation(
                id,
                req.user
            );


        res.status(200).json(
            deletedReservation
        );

    } catch (err) {

        next(err);
    }
};


module.exports = {

    getReservations,
    getReservationById,
    createReservation,
    cancelReservation,
    deleteReservation

};


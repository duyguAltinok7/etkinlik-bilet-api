const prisma = require("../config/prisma");
const getReservations = async () => {

    const reservations = await prisma.reservation.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            event: true,
            seat: true
        }
    });

    return reservations;
};

const getReservationsByUserId = async (userId) => {

    const reservations = await prisma.reservation.findMany({
        where: {
            userId
        },
        include: {
            event: true,
            seat: true
        }
    });

    return reservations;
};

const getReservationById = async (id) => {

    const reservation = await prisma.reservation.findUnique({
        where: {
            id
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            event: true,
            seat: true,
            ticket: true,
            payment: true
        }
    });

    return reservation;
};

const findUserById = async (userId) => {

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });

    return user;
};

const findEventById = async (eventId) => {

    const event = await prisma.event.findUnique({
        where: {
            id: eventId
        }
    });

    return event;
};

const findSeatById = async (seatId) => {

    const seat = await prisma.seat.findUnique({
        where: {
            id: seatId
        }
    });

    return seat;
};

const findReservationByEventAndSeat = async (eventId,seatId) => {

    const reservation = await prisma.reservation.findUnique({
        where: {
            eventId_seatId: {
                eventId,
                seatId
            }
        }
    });

    return reservation;
};

const createReservation = async (reservationData) => {

    const reservation = await prisma.reservation.create({
        data: reservationData
    });

    return reservation;
};

const cancelReservation = async (id) => {

    const reservation = await prisma.reservation.update({
        where: {
            id
        },
        data: {
            status: "CANCELLED"
        }
    });

    return reservation;
};

const deleteReservation = async (id) => {

    const reservation = await prisma.reservation.delete({
        where: {
            id
        }
    });

    return reservation;
};

module.exports = {

    getReservations,
    getReservationsByUserId,
    getReservationById,

    findUserById,
    findEventById,
    findSeatById,
    findReservationByEventAndSeat,

    createReservation,
    cancelReservation,
    deleteReservation
};


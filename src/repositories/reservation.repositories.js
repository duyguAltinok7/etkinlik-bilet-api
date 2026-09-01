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
// bu koltuğun satırını kontrol ederken kilitle prismada bunun için tx.queryRaw kullanacağız
const findSeatForUpdate=async(seatId,db=prisma)=>{
    const seat= await db.$queryRaw`
        SELECT *
        FROM "Seat"
        where id = ${seatId}
        FOR UPDATE`
    return seat[0]; // array olarak döner biz ilk satırı arıyoruz o yüzden sıfır 
        
}

const findUserById = async (userId,db=prisma) => {// db eğer bana başka bir database client verlimezse normal prismayı kullan

    const user = await db.user.findUnique({
        where: {
            id: userId
        }
    });

    return user;
};

const findEventById = async (eventId,db=prisma) => {

    const event = await db.event.findUnique({
        where: {
            id: eventId
        }
    });

    return event;
};

const findSeatById = async (seatId,db=prisma) => {

    const seat = await db.seat.findUnique({
        where: {
            id: seatId
        }
    });

    return seat;
};

const findActiveReservationByEventAndSeat = async (eventId, seatId, db = prisma) => {
    const reservation = await db.reservation.findFirst({
        where: {
            eventId,
            seatId,
            status: {
                not: "CANCELLED"
            }
        }
    });

    return reservation;
};

const createReservation = async (reservationData,db=prisma) => {

    const reservation = await db.reservation.create({
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
    findSeatForUpdate,
    findUserById,
    findEventById,
    findSeatById,
    findActiveReservationByEventAndSeat,

    createReservation,
    cancelReservation,
    deleteReservation
};


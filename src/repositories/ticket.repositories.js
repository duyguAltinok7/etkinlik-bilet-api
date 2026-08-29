const prisma = require("../config/prisma");


const getTickets = async () => {

    const tickets = await prisma.ticket.findMany();

    return tickets;
};


const getTicketById = async (id) => {

    const ticket = await prisma.ticket.findUnique({
        where: {
            id
        }
    });

    return ticket;
};


// Reservation var mı?
const findReservation = async (reservationId) => {

    const reservation =
        await prisma.reservation.findUnique({
            where: {
                id: reservationId
            }
        });

    return reservation;
};


// Ticket numarası daha önce kullanılmış mı?
const findTicketNumber = async (ticketNumber) => {

    const ticket = await prisma.ticket.findFirst({
        where: {
            ticketNumber
        }
    });

    return ticket;
};


// Ticket oluştur
const createTicket = async (ticketData) => {

    const newTicket =
        await prisma.ticket.create({
            data: ticketData
        });

    return newTicket;
};


// Ticket güncelle
const updateTicket = async (id, ticketData) => {

    const updatedTicket =
        await prisma.ticket.update({
            where: {
                id
            },
            data: ticketData
        });

    return updatedTicket;
};


// Ticket sil
const deleteTicket = async (id) => {

    const deletedTicket =
        await prisma.ticket.delete({
            where: {
                id
            }
        });

    return deletedTicket;
};


module.exports = {
    getTickets,
    getTicketById,
    findReservation,
    findTicketNumber,
    createTicket,
    updateTicket,
    deleteTicket
};
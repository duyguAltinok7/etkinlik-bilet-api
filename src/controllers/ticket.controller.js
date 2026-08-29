const services = require("../services/ticket.services");

const getTickets = async (req, res, next) => {
    try {
        const tickets = await services.getTickets();

        res.status(200).json(tickets);

    } catch (err) {
        next(err);
    }
};


const getTicketById = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        const ticket = await services.getTicketById(id);

        res.status(200).json(ticket);

    } catch (err) {
        next(err);
    }
};


const createTicket = async (req, res, next) => {
    try {
        const {
            reservationId,
            ticketNumber,
            price,
            status
        } = req.body;

        const ticketData = {
            reservationId,
            ticketNumber,
            price,
            status
        };

        const newTicket =
            await services.createTicket(ticketData);

        res.status(201).json(newTicket);

    } catch (err) {
        next(err);
    }
};


const updateTicket = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        const {
            reservationId,
            ticketNumber,
            price,
            status
        } = req.body;

        const ticketData = {
            reservationId,
            ticketNumber,
            price,
            status
        };

        const updatedTicket =
            await services.updateTicket(id, ticketData);

        res.status(200).json(updatedTicket);

    } catch (err) {
        next(err);
    }
};


const deleteTicket = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        const deletedTicket =
            await services.deleteTicket(id);

        res.status(200).json(deletedTicket);

    } catch (err) {
        next(err);
    }
};


module.exports = {
    getTickets,
    getTicketById,
    createTicket,
    updateTicket,
    deleteTicket
};
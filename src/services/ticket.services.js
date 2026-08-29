const repositories=require("../repositories/ticket.repositories");
const AppError=require("../utils/AppError")

const getTickets=async()=>{
    const tickets=await repositories.getTickets();
    return tickets;
};

const getTicketById=async(id)=>{
    const ticket=await repositories.getTicketById(id);
    if(!ticket){
        throw new AppError("bilet bulunamadı",404);
        
    }
    return ticket;
};

const createTicket=async(ticketData)=>{
    const {reservationId,ticketNumber,price,status}=ticketData;

    const reservation=await repositories.findReservation(reservationId);
    if(!reservation){
        throw new AppError("bu ıd ye ait rezervasyon bulunmamaktadır",404);
      
    }
    const ticketNum=await repositories.findTicketNumber(ticketNumber);
    if(ticketNum){
        throw new AppError("bilet numarası uygun değil ",400);
        
    }
    if(price<=0){
        throw new AppError("bilet fiyatı sıfırdan büyük olmalı",400);
    
    }
    if(status==='CANCELLED'){
        throw new AppError(" bu bilet iptal edilmiş",400);
      

    }
    if(status==='USED'){
        throw new AppError(" BU bilet daha önce kullanılmış",400);
       
    }
    const newTicket=await repositories.createTicket(ticketData);
    return newTicket;
}
;

const updateTicket=async(id,ticketData)=>{
    const newUpdateTicket=await repositories.updateTicket(id,ticketData);
    if(!newUpdateTicket){
        throw new AppError("bilet bulunamadı",404);
       
    }
    return newUpdateTicket;
};

const deleteTicket=async(id)=>{
    const delTicket=await repositories.deleteTicket(id);
    if(!delTicket){
        throw new AppError("bilet bulunamadı",404);
        
    }
    return delTicket;
};

module.exports={
    getTickets,
    getTicketById,
    createTicket,
    updateTicket,
    deleteTicket
}

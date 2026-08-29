const prisma=require("../config/prisma");

const getSeats=async()=>{
    const seats=await prisma.seat.findMany();
    return seats;
};

const getSeatById=async(id)=>{
    const seat=await prisma.seat.findUnique({
        where:{id}
    });
    return seat;
}
// VENUDE BİRDEN FAZLA KOLTUK OLSUN İSTERİZ MANY KULLANIRIZ 
const getSeatsByVenue=async(venueId)=>{
    const seatVenue=await prisma.seat.findMany({
        where:{venueId}
    });
    return seatVenue;

};
const createSeat=async(seatData)=>{
    const newSeat=await prisma.seat.create({
        data:seatData
    });
    return newSeat;
};
const updateSeat=async(id,seatData)=>{
    const newUpdateSeat=await prisma.seat.update({
        where:{id},
        data:seatData
    });
    return newUpdateSeat;
};

const deleteSeat=async(id)=>{
    const delSeat=await prisma.seat.delete({
        where:{id}
    });
    return delSeat;
};

module.exports={
    getSeats,
    getSeatById,
    getSeatsByVenue,
    createSeat,
    updateSeat,
    deleteSeat
}
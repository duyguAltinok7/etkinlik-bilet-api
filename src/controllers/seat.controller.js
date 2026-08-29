const services=require("../services/seat.service");

const getSeats=async(req,res,next)=>{
    try{
        const seats=await services.getSeats();
        res.status(200).json(seats)

    }catch(err){
        next(err)
    }
};
const getSeatById=async(req,res,next)=>{
    try{
        const id=Number(req.params.id);
        const seat=await services.getSeatById(id);
        res.status(200).json(seat);

    }catch(err){
        next(err)
    }
};

const getSeatsByVenue=async(req,res,next)=>{
    try{
        const venuId=Number(req.params.venueId);
        const seatVenue=await services.getSeatsByVenue(venuId);
        res.status(200).json(seatVenue);

    }catch(err){
        next(err)
    }

};

const createSeat=async(req,res,next)=>{
    try{
        const {venueId,seatNumber,row}=req.body;
        const seatData={venueId,seatNumber,row};
        const newSeat=await services.createSeat(seatData);
        res.status(201).json(newSeat);

    }catch(err){
        next(err)
    }
}

const updateSeat=async(req,res,next)=>{
    try{
        const id=Number(req.params.id);
        const {venueId,seatNumber,row}=req.body;
        const seatData={venueId,seatNumber,row};
        const newUpdateSeat=await services.updateSeat(id,seatData);
        res.status(200).json(newUpdateSeat);

    }catch(err){
        next(err)
    }
};

const deleteSeat=async(req,res,next)=>{
    try{
        const id=Number(req.params.id);
        const delSeat=await services.deleteSeat(id);
        res.status(200).json(delSeat)

    }catch(err){
        next(err)
    }
};
module.exports={
    getSeats,
    getSeatById,
    getSeatsByVenue,
    createSeat,
    updateSeat,
    deleteSeat
}
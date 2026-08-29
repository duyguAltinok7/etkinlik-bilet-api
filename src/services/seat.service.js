const repositories=require("../repositories/seat.repositories");
const AppError=require("../utils/AppError")

const getSeats=async()=>{
    const seats=await repositories.getSeats();

    return seats;
};

const getSeatById=async(id)=>{
    const seat=await repositories.getSeatById(id);
    if(!seat){
        throw new AppError("koltuk bulunamadı",404);
       
    };
    return seat
};

const getSeatsByVenue=async(venueId)=>{
    const seatVenue=await repositories.getSeatsByVenue(venueId);
  
    return seatVenue;
};

const createSeat=async(seatData)=>{
    const {venueId,seatNumber,row}=seatData;
    if(venueId<=0  ){
        throw new AppError("mekan  numarası sıfırdan büyük olmalıdır ",400)
        
    }
    if(seatNumber<=0  ){
        throw new AppError("koltuk  numarası sıfırdan büyük olmalıdır ",400)
       
    }
     if(row<=0  ){
        throw new AppError(" sıra sıfırdan büyük olmalıdır ",400)
       

    }
    const newSeat=await repositories.createSeat(seatData);
    return newSeat;
}
const updateSeat=async(id,seatData)=>{
    const newUpdateSeat=await repositories.updateSeat(id,seatData);
    if(!newUpdateSeat){
        throw new AppError("koltuk bulunamadı",404);
      
    }
    return newUpdateSeat;
};

const deleteSeat=async(id)=>{
    const delSeat=await repositories.deleteSeat(id)
    if(!delSeat){
        throw new AppError("koltuk bulunamadı",404);
     
    }
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
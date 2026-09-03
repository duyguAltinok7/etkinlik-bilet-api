const repositories=require("../repositories/seat.repositories");
const AppError=require("../utils/AppError")
const redis=require("../config/redis.js")
const logger=require("../utils/logger.js");

const getSeats=async()=>{
    const cachedSeat=await redis.get("seats")
    if(cachedSeat){
        logger.info("seats redis cache den getirildi");
        return JSON.parse(cachedSeat);

    }
    const seats=await repositories.getSeats();
    await redis.set(
        "seats",
        JSON.stringify(seats),
        {
            EX:60
        }
    )
    logger.info("seats başarıyla getirilidi.")
    return seats;
};

const getSeatById=async(id)=>{
    
    const cacheKey=await redis.get(`seat:${id}`);
    if(cacheKey){
        logger.info("seat redis cache den getirildi");
        return JSON.parse(cacheKey);
    }
    const seat=await repositories.getSeatById(id);
    if(!seat){
        logger.warn("seat bulunamadı");
        throw new AppError("koltuk bulunamadı",404);
       
    };
    await redis.set(
        `seat:${id}`,
        JSON.stringify(seat),
        {
            EX:60
        }
    )
    logger.info("seat başarıyla getirildi")
    return seat
};

const getSeatsByVenue=async(venueId)=>{
    const cacheKey=await redis.get(`seats:venue:${venueId}`);
    if(cacheKey){
        logger.info("venue id ile koltuklar redis cache den getirildi");
        return JSON.parse(cacheKey);
    }
    const seatVenue=await repositories.getSeatsByVenue(venueId);
    await redis.set(
        `seats:venue:${venueId}`,
        JSON.stringify(seatVenue),
        {
            EX:60
        }
    )
    logger.info("venue id ile koltuklar başarıyla getirildi");
    return seatVenue;
};

const createSeat=async(seatData)=>{
    const {venueId,seatNumber,row}=seatData;
    if(venueId<=0  ){
        logger.warn("mekan numarası sıfırdan büyük olmalıdır");
        throw new AppError("mekan  numarası sıfırdan büyük olmalıdır ",400)
        
    }
    if(seatNumber<=0  ){
        logger.warn("koltuk numarası sıfırdan büyük olmalıdır")
        throw new AppError("koltuk  numarası sıfırdan büyük olmalıdır ",400)
       
    }
     if(row<=0  ){
        logger.warn("sıra numarası sıfırdan büyük olmalıdır");
        throw new AppError(" sıra sıfırdan büyük olmalıdır ",400)
       

    }
    const newSeat=await repositories.createSeat(seatData);
    await redis.del("seats")
    await redis.del(`seats:venue:${venueId}`);
    logger.info("koltuk başarıyla oluşturuldu");
    return newSeat;
}
const updateSeat=async(id,seatData)=>{
    const newUpdateSeat=await repositories.updateSeat(id,seatData);
    if(!newUpdateSeat){
        logger.warn("koltuk bulunamadı")
        throw new AppError("koltuk bulunamadı",404);
      
    }
    await redis.del("seats");
    await redis.del(`seat:${id}`);
    logger.info("koltuk başarıyla güncellendi");
    return newUpdateSeat;
};

const deleteSeat=async(id)=>{
    const delSeat=await repositories.deleteSeat(id)
    if(!delSeat){
        logger.warn("koltuk bulunamadı");
        throw new AppError("koltuk bulunamadı",404);
     
    }
    await redis.del("seats");
    await redis.del(`seat:${id}`);
    logger.info("koltuk başarıyla silindi")
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
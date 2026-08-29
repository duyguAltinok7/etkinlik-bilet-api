const repositories=require("../repositories/venue.repositories");
const AppError=require("../utils/AppError")

const getVenues=async()=>{
    const venues=await repositories.getVenues();
    return venues
};

const getVenueById=async(id)=>{
    const venue=await repositories.getVenueById(id);
    if(!venue){
        throw new AppError("mekan bulunamadı",404);
       
    };
    return venue;
};

const createVenue=async(venueData)=>{
    if(venueData.capacity<=0){
        throw new AppError("mekan kapasitesi sıfırdan büyük olmalıdır",400);
        
    }
    const newVenue=await repositories.createVenue(venueData);
    return newVenue
};

const updateVenue=async(id,venueData)=>{
    const newUpdateVenue=await repositories.updateVenue(id,venueData);
    if(!newUpdateVenue){
        throw new AppError("mekan bulunamadı",404);
        
    }
    return newUpdateVenue;
}
const deleteVenue=async(id)=>{
    const delVenue=await repositories.deleteVenue(id);
    if(!delVenue){
        throw new AppError("mekan bulunamadı",404);
       
    };
    return delVenue;
};

module.exports={
    getVenues,
    getVenueById,
    createVenue,
    updateVenue,
    deleteVenue
}
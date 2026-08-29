const services=require("../services/venue.service");

const  getVenues=async(req,res,next)=>{
    try{
        const venues=await services.getVenues();
        res.status(200).json(venues)

    }catch(err){
        next(err)
    }
};

const getVenueById=async(req,res,next)=>{
    try{
        const id=Number(req.params.id);
        const venue=await services.getVenueById(id);
        res.status(200).json(venue)

    }catch(err){
        next(err)
 
    }
};

const createVenue=async(req,res,next)=>{
    try{
        const {name,address,capacity}=req.body;
        const venueData={name,address,capacity};

        const newVenue=await services.createVenue(venueData);
        res.status(201).json(newVenue);

    }catch(err){
        next(err)
    }
};
const updateVenue=async(req,res,next)=>{
    try{
        const id=Number(req.params.id);
        const {name,address,capacity}=req.body;
        const venueData={name,address,capacity}
        const newUpdateVenue=await services.updateVenue(id,venueData);
        res.status(200).json(newUpdateVenue);

    }catch(err){
        next(err)
    }
};

const deleteVenue=async(req,res,next)=>{
    try{
        const id=Number(req.params.id);
        const delVenue=await services.deleteVenue(id);
        res.status(200).json(delVenue);

    }catch(err){
        next(err)
    }
};

module.exports={
    getVenues,
    getVenueById,
    createVenue,
    updateVenue,
    deleteVenue
}
const prisma=require("../config/prisma");

const getVenues=async()=>{
    const venues=await prisma.venue.findMany();
 
    return venues;
};

const getVenueById=async(id)=>{
    const venue=await prisma.venue.findUnique({
        where:{id}
    });
   
    return venue;
};

const createVenue=async(venueData)=>{
    const newVenue=await prisma.venue.create({
        data:venueData
    });
    return newVenue;
};

const updateVenue=async(id,venueData)=>{
    const newUpdateVenue=await prisma.venue.update({
        where:{id},
        data:venueData
    })
  
    return  newUpdateVenue;
};

const deleteVenue=async(id)=>{
    const delVenue=await prisma.venue.delete({
        where:{id}
        
    })
    return delVenue;
};
module.exports={
    getVenues,
    getVenueById,
    createVenue,
    updateVenue,
    deleteVenue
}
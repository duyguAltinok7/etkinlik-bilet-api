const prisma=require("../config/prisma");

const getEvents=async()=>{
    const events=await prisma.event.findMany();
    return events;

};
const getEventById=async(id)=>{
    const event=await prisma.event.findUnique({
        where:{id}
    });
 
    return event;
};

const createEvent=async(eventData)=>{
    const newEvent=await prisma.event.create({
        data:eventData
    })
    return newEvent
};

const updateEvent=async(id,eventData)=>{
    const newUpdateEvent=await prisma.event.update({
        where:{id},
        data:eventData
    }
    )

    return newUpdateEvent

};

const deleteEvent=async(id)=>{
    const delEvent=await prisma.event.delete({
        where:{id}
    })
   
    return delEvent
};
module.exports={
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
}
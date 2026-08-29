const repositories=require("../repositories/event.repositories");
const AppError=require("../utils/AppError")

const getEvents=async()=>{
    const events=await repositories.events();
    if(!events){
        throw new AppError("event bulunamadı",404);
       
    }
    return events;
}
const getEventById=async(id)=>{
    const event=await repositories.getEventById(id);
    if(!event){
        throw new AppError("event bulunamadı",404);
       
    }
    return event;
};
const createEvent=async(eventData)=>{
    
    const newEvent=await repositories.createEvent(eventData);
    return newEvent;
};
const updateEvent=async(id,eventData)=>{
    
    const newUpdateEvent=await repositories.updateEvent(id,eventData);
    if(!newUpdateEvent){
        throw new AppError("event bulunamadı",404);
    
    }
    return newUpdateEvent;
}

const deleteEvent=async(id)=>{
    const delEvent=await repositories.deleteEvent(id);
    if(!delEvent){
        throw new AppError("event bulunamadı",404);
        
    }
    return delEvent;
};

module.exports={
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
}
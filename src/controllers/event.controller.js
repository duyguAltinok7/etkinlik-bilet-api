const services=require("../services/event.service");

const getEvents=async(req,res,next)=>{
    try{
       const events=await services.getEvents();
       res.status(200).json(events)

    }catch(err){
        next(err)

    }
}
const getEventById=async(req,res,next)=>{
    try{
        const id=Number(req.params.id);
        const event=await services.getEventById(id);
        res.status(200).json(event);


    }catch(err){
        next(err)
    }
}
const createEvent=async(req,res,next)=>{
    try{
        const {title,description,date,venueId}=req.body;

        const eventData={
            title,
            description,
            date,
            venueId
        };

        const newEvent=await services.createEvent(eventData);

        res.status(201).json(newEvent);

    }catch(err){
        next(err)
    }
}
const updateEvent=async(req,res,next)=>{
    try{
        const id=Number(req.params.id);
        const {title,description,date}=req.body;
        const eventData={title,description,date};
        const newUpdateEvent=await services.updateEvent(id,eventData)
        res.status(200).json(newUpdateEvent);

    }catch(err){
        next(err)
    }
}
const deleteEvent=async(req,res,next)=>{
    try{
        const id=Number(req.params.id);
        const delEvent=await services.deleteEvent(id);
        res.status(200).json(delEvent)

    }catch(err){
        next(err)

    }
};
module.exports={
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
}
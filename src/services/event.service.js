const repositories = require("../repositories/event.repositories");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger.js");
const redisClient = require("../config/redis.js");

const getEvents = async () => {
    const cachedEvents = await redisClient.get("events"); // cachedevents var mı > evetse redisten alacağız yoksa postgresql e gideceğiz
    if (cachedEvents) {
        logger.info("events redis cache den getirildi");
        return JSON.parse(cachedEvents);
    }
    const events = await repositories.getEvents();

    if (!events) {
        logger.warn("events bulunamadı");
        throw new AppError("event bulunamadı", 404);
    }
    await redisClient.set(
        "events",
        JSON.stringify(events),
        {
            EX: 60
        }
    )
    logger.info("Events başarıyla getirildi")
    return events;

}
const getEventById = async (id) => {
    // burda redis mantığımız sürekli aynı id istenirse redisten alacağız 
    const cacheKey = `event:${id}`;
    const cachedEvent = await redisClient.get(cacheKey);
    if (cachedEvent) {
        if (cachedEvent === "NOT_FOUND") {
            logger.info("event redis cache de bulunamadı olarak işaretlenmiş");
            throw new AppError("event bulunamadı", 404);
        }
        logger.info("event redis cacheden getirildi");
        return JSON.parse(cachedEvent);
    }
    const event = await repositories.getEventById(id);
    if (!event) {
        await redisClient.set(
            cacheKey,
            "NOT_FOUND",
            {
                EX: 30
            }
        );
        logger.warn("event bulunamadı", { eventId: id });
        throw new AppError("event bulunamadı", 404);

    }
    await redisClient.set(
        cacheKey,
        JSON.stringify(event),
        {
            EX: 60
        }
    )
    return event;
};
const createEvent = async (eventData) => {

    const { venueId, ...event } = eventData;

    const newEvent = await repositories.createEvent({
        ...event,
        venue: {
            connect: {
                id: venueId
            }
        }
    });
    await redisClient.del("events"); // redisteki eski cachi siliyoruz

    logger.info("event başarıyla oluştu", {
        eventId: newEvent.id,
        venueId
    });

    return newEvent;
};
const updateEvent = async (id, eventData) => {

    const newUpdateEvent = await repositories.updateEvent(id, eventData);

    if (!newUpdateEvent) {
        logger.warn("event bulunamadı", { eventId: id });
        throw new AppError("event bulunamadı", 404);


    }
    // güncelleme başarılı olduktan sonra redisi silecez 
    await redisClient.del("events");
    // event id içinde yapmalıyız
    await redisClient.del(`event:${id}`);
    return newUpdateEvent;
}

const deleteEvent = async (id) => {
    const delEvent = await repositories.deleteEvent(id);
    if (!delEvent) {
        logger.warn("event bulunamadı", { eventId: id });
        throw new AppError("event bulunamadı", 404);

    }
    await redisClient.del("events");
    await redisClient.del(`event:${id}`);
    return delEvent;
};

module.exports = {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
}
const repositories = require("../repositories/venue.repositories");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger.js");
const redis = require("../config/redis.js");

const getVenues = async () => {
    const cachedVenues = await redis.get("venues");

    if (cachedVenues) {
        logger.info("venues redis'ten getirildi");
        return JSON.parse(cachedVenues);
    }

    const venues = await repositories.getVenues();

    await redis.set(
        "venues",
        JSON.stringify(venues),
        {
            EX: 60
        }
    );

    logger.info("venues başarıyla getirildi");

    return venues;
};

const getVenueById = async (id) => {
    const cachedVenue = await redis.get(`venue:${id}`);

    if (cachedVenue) {
        logger.info(`venue redis'ten getirildi: ${id}`);
        return JSON.parse(cachedVenue);
    }

    const venue = await repositories.getVenueById(id);

    if (!venue) {
        logger.warn(`mekan bulunamadı: ${id}`);
        throw new AppError("mekan bulunamadı", 404);
    }

    await redis.set(
        `venue:${id}`,
        JSON.stringify(venue),
        {
            EX: 60
        }
    );

    logger.info(`venue başarıyla getirildi: ${id}`);

    return venue;
};

const createVenue = async (venueData) => {
    if (venueData.capacity <= 0) {
        logger.warn("mekan kapasitesi sıfırdan büyük olmalıdır");
        throw new AppError(
            "mekan kapasitesi sıfırdan büyük olmalıdır",
            400
        );
    }

    const newVenue = await repositories.createVenue(venueData);

    await redis.del("venues");

    logger.info(`mekan başarıyla oluşturuldu: ${newVenue.id}`);

    return newVenue;
};

const updateVenue = async (id, venueData) => {
    const newUpdateVenue = await repositories.updateVenue(
        id,
        venueData
    );

    if (!newUpdateVenue) {
        logger.warn(`mekan bulunamadı: ${id}`);
        throw new AppError("mekan bulunamadı", 404);
    }

    await redis.del("venues");
    await redis.del(`venue:${id}`);

    logger.info(`mekan başarıyla güncellendi: ${id}`);

    return newUpdateVenue;
};

const deleteVenue = async (id) => {
    const delVenue = await repositories.deleteVenue(id);

    if (!delVenue) {
        logger.warn(`mekan bulunamadı: ${id}`);
        throw new AppError("mekan bulunamadı", 404);
    }

    await redis.del("venues");
    await redis.del(`venue:${id}`);

    logger.info(`mekan başarıyla silindi: ${id}`);

    return delVenue;
};

module.exports = {
    getVenues,
    getVenueById,
    createVenue,
    updateVenue,
    deleteVenue
};
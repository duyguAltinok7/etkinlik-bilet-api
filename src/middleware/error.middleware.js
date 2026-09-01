
const { Prisma } = require("../generated/prisma/client");
const logger = require("../utils/logger");

const errorMiddleware = (err, req, res, next) => {

    logger.error("Application Error", {
        requestId:req.requestId,
        method: req.method,
        url: req.originalUrl,
        statusCode: err.statusCode || 500,
        message: err.message,
        stack: err.stack
    });

    if (err instanceof Prisma.PrismaClientKnownRequestError) {

        if (err.code === "P2002") {
            return res.status(409).json({
                message: "Bu kayıt zaten mevcut"
            });
        }

        if (err.code === "P2025") {
            return res.status(404).json({
                message: "İstenen kayıt bulunamadı"
            });
        }
    }

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        message: err.message || "Sunucu hatası"
    });
};

module.exports = errorMiddleware;


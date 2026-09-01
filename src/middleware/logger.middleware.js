
const logger = require("../utils/logger");

const crypto=require("crypto")

const loggerMiddleware = (req, res, next) => {
    const requestId=crypto.randomUUID()//o istek boyunca oluşturulan loglara aynı ID'yi koyarız. benzersiz bir ıd üretir
    req.requestId=requestId;
    const start = Date.now(); // requestin başladığı zaman

    res.on("finish", () => { // fiinish eventını dinliyoruz işlem tamamlandığında bu fonksiyonu çağır
        const duration = Date.now() - start;//süreyi hesaplıyoruz 

        const logData = {
            requestId:req.requestId,
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            responseTime: `${duration}ms`
        };

        if (res.statusCode >= 500) {
            logger.error("HTTP Request", logData);
        } else if (res.statusCode >= 400) {
            logger.warn("HTTP Request", logData);
        } else {
            logger.info("HTTP Request", logData);
        }
    });

    next();
};

module.exports = loggerMiddleware;


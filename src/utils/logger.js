// burda winston kullanacaz çünkü bize info warn error debug bunları hazır veriyor 
// console.log kullanmak yerine artık logger.info logger.warn logger.error kullanacağız 

// log seviyesi o mesajın ne kdr önemli ne kdr acil olduğunu gösteriri 
// winston da sayi ne kdr küçükse o seviye 0 kdr kritiktir

const winston = require("winston");
const { PostgresTransport } = require("@innova2/postgres-transport"); // logları postgres e yazmamızı sağlar

const isProduction = process.env.NODE_ENV === "production";
const isInfoEnabled = process.env.LOG_INFO_ENABLED !== "false"; // varsayılan: açık

const customLevels = {
    levels: {
        critical: 0, // en kriteri 
        error: 1,
        warn: 2,
        info: 3,
        debug: 4 // en sıradan 
    }
};

// Terminale hangi seviyeye kadar basılacağını belirliyoruz
// dev -> hepsi (debug dahil)
// prod -> info açık/kapalıya göre info'ya kadar ya da sadece warn+critical
let consoleLevel;
if (!isProduction) {
    consoleLevel = "debug"; // tüm seviyler gözükür bundan ciddi seviyeleri yaz 
} else {
    consoleLevel = isInfoEnabled ? "info" : "warn";
}

const logger = winston.createLogger({
    levels: customLevels.levels,
    level: "debug",

    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),

    transports: [
        // 1) Terminal - her ortamda var, seviyesi yukarıda belirleniyor
        new winston.transports.Console({
            level: consoleLevel,
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),

        // 2) Dosya - critical + error (level <= 'error' olan her şey)
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error"
        }),

        // 3) Ayrı log DB - warn + error + critical (level <= 'warn' olan her şey)
        // Proje DB'sinden bağımsız bir connection string veriyoruz, routing paketin işi
        new PostgresTransport({
            connectionString: process.env.LOG_DB_URL,
            level: "warn",
            tableName: "app_logs",
            maxPool: 10 // aynı anda en fazla 10 bağlantı açık
        })
    ]
});

module.exports = logger;
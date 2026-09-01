// burda winston kullanacaz çünkü bize info warn error debug bunları hazır veriyor 
// console.log kullanmak yerine artık logger.info logger.warn logger.error kullanacağız 
const winston=require("winston");
const logger=winston.createLogger({ // winston bize hazır logger nesnesi oluşturuyor

    level:"info", // log hangi seviyedeki mesajları kabul edecek
    format: winston.format.combine(  // burda logların nasıl görüneceğini belirliyoruz 
        winston.format.timestamp(), // loga zaman ekler
        winston.format.json() // burada logu json formatında oluşturur
    ),
    transports:[  // logun nereye gönderceğini belirler 
        new winston.transports.Console(), // logları console a gönder 
        new winston.transports.File({
            filename: "logs/combined.log"
        }),
        new winston.transports.File({ // sadece error seviyesindeki logları kabul edeceğiz 
            filename: "logs/error.log",
            level:"error"
        })
    ]

});
module.exports=logger;
const http = require("http");

const app = require("./app");
const redisClient=require("./config/redis")

const setupWebsocket = require("./websocket/websocket");

const server = http.createServer(app);

setupWebsocket(server);

server.listen(3000, async() => {
    try{
        await redisClient.connect();
        console.log("redis bağlantısı başarılı");
        console.log("server 300 portunda çalışıyor");

    }catch(err){
        console.error("redis bağlantı hatası",error);

    }
});
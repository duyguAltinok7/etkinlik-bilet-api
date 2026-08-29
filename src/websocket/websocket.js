const WebSocket = require("ws");

function setupWebSocket(server) {
    const wss = new WebSocket.Server({
        server: server
    });

    // Etkinlik odalarını tutuyoruz
    const rooms = new Map();

    wss.on("connection", (socket) => {
        console.log("Yeni bir WebSocket bağlantısı kuruldu.");

        socket.send(
            JSON.stringify({
                type: "connected",
                message: "WebSocket bağlantısı başarılı.",
            })
        );

        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());

            console.log("Gelen mesaj:", message);

            // Kullanıcı etkinliğe katılıyor
            if (message.type === "join_event") {
                const eventId = message.eventId;

                const roomName = `event-${eventId}`;

                // Room yoksa oluştur
                if (!rooms.has(roomName)) {
                    rooms.set(roomName, new Set());
                }

                // Room'u al
                const room = rooms.get(roomName);

                // Kullanıcının socket bağlantısını room'a ekle
                room.add(socket);

                // Socket'in hangi room'da olduğunu sakla
                socket.roomName = roomName;

                console.log(`${roomName} odasına kullanıcı katıldı.`);

            }

            // Kullanıcı koltuk seçiyor
            else if (message.type === "seat_selected") {
                const eventId = message.eventId;
                const seatId = message.seatId;

                const roomName = `event-${eventId}`;

                const room = rooms.get(roomName);

                if (!room) {
                    console.log("Bu etkinlik için aktif bir room yok.");
                    return;
                }

                // Room'daki bütün kullanıcıları dolaş
                room.forEach((client) => {

                    // Mesajı gönderen kullanıcı hariç
                    // ve bağlantısı açıksa
                    if (
                        client !== socket &&
                        client.readyState === WebSocket.OPEN
                    ) {
                        client.send(
                            JSON.stringify({
                                type: "seat_selected",
                                seatId: seatId,
                                eventId: eventId,
                            })
                        );
                    }
                });
            }

            // Kullanıcı koltuğu bırakıyor
            else if (message.type === "seat_released") {
                console.log("Koltuk bırakma isteği geldi.");

            }

            // Tanınmayan mesaj
            else {
                console.log("Bilinmeyen mesaj türü.");
            }
        });

        // Bağlantı kapandığında
        socket.on("close", () => {
            console.log("WebSocket bağlantısı kapandı.");

            // Kullanıcı bir room'daysa room'dan çıkar
            if (socket.roomName) {
                const room = rooms.get(socket.roomName);

                if (room) {
                    room.delete(socket);

                    // Room boş kaldıysa Map'ten de sil
                    if (room.size === 0) {
                        rooms.delete(socket.roomName);
                    }
                }
            }
        });

        // Hata
        socket.on("error", (error) => {
            console.error("WebSocket hatası:", error);
        });
    });
}

module.exports = setupWebSocket;
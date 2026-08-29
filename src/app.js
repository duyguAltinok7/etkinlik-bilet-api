const http = require("http");
const express = require("express");

const app = express();

const userRoutes = require("./routes/user.routes");

const authRoutes = require("./routes/auth.routes");
const reservationRoutes = require("../src/routes/reservation.routes");
const errorMiddleware = require("./middleware/error.middleware");
const bookingRoutes = require("./routes/booking.routes");
const setupWebsocket=require("./websocket/websocket")

app.use(express.json());

app.use("/api/users", userRoutes);

app.use(
    "/api/reservations",
    reservationRoutes
);
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use(errorMiddleware);
const server = http.createServer(app);
setupWebsocket(server);
server.listen(3000, () => {
    console.log("server 3000 portunda çalışıyor");
});

module.exports = app;
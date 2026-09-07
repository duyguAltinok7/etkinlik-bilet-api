// expres uygulamasını oluşturuyoruz httpi yi server da oluşturca
const express = require("express");

const app = express();

const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const reservationRoutes = require("../src/routes/reservation.routes");
const errorMiddleware = require("./middleware/error.middleware");
const bookingRoutes = require("./routes/booking.routes");
const loggerMiddleware = require("./middleware/logger.middleware");
const eventRoutes = require("./routes/event.routes");
const venueRoutes = require("./routes/venue.routes");
const seatRoutes= require("./routes/seat.routes");
app.use(loggerMiddleware);

app.use(express.json());

app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);

app.use(errorMiddleware);



module.exports = app;
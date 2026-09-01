-- This is an empty migration.
CREATE UNIQUE INDEX "Reservation_active_event_seat_unique"
ON "Reservation" ("eventId", "seatId")
WHERE "status" <> 'CANCELLED';
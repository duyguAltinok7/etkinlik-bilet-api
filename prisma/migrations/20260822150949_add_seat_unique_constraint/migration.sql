/*
  Warnings:

  - A unique constraint covering the columns `[venueId,row,seatNumber]` on the table `Seat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Seat_venueId_row_seatNumber_key" ON "Seat"("venueId", "row", "seatNumber");

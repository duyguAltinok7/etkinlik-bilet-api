const bookingService = require("../services/booking.service");
const repositories = require("../repositories/booking.repositories");
const prisma = require("../config/prisma");

jest.mock("../repositories/booking.repositories");
jest.mock("../config/prisma", () => ({
  $transaction: jest.fn(),
}));

describe("createBooking", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    prisma.$transaction.mockImplementation(async (callback) => {
      return await callback({});
    });
  });

  it("reservation, payment ve ticket oluşturup birlikte döndürmeli", async () => {
    const fakeReservation = { id: 1 };
    const fakePayment = { id: 2, reservationId: 1 };
    const fakeTicket = { id: 3, reservationId: 1 };

    repositories.createReservation.mockResolvedValue(fakeReservation);
    repositories.createPayment.mockResolvedValue(fakePayment);
    repositories.createTicket.mockResolvedValue(fakeTicket);

    const data = {
      amount: 100,
      paymentMethod: "CREDIT_CARD",
      transactionId: "tx1",
      ticketNumber: "T-001",
    };

    await expect(bookingService.createBooking(data)).resolves.toEqual({
      reservation: fakeReservation,
      payment: fakePayment,
      ticket: fakeTicket,
    });
  });

});
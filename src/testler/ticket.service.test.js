const ticketService = require("../services/ticket.services");
const repositories = require("../repositories/ticket.repositories");

jest.mock("../repositories/ticket.repositories");

describe("getTickets", () => {
  beforeEach(() => jest.clearAllMocks());

  it("bilet listesini döndürür", async () => {
    const fakeTickets = [{ id: 1 }, { id: 2 }];
    repositories.getTickets.mockResolvedValue(fakeTickets);

    await expect(ticketService.getTickets()).resolves.toEqual(fakeTickets);
  });
});

describe("getTicketById", () => {
  beforeEach(() => jest.clearAllMocks());

  it("bilet bulunmazsa hata fırlatmalı", async () => {
    repositories.getTicketById.mockResolvedValue(null);
    await expect(ticketService.getTicketById(2))
      .rejects.toThrow("bilet bulunamadı");
  });

  it("bilet bulunursa döndürmeli", async () => {
    const fakeTicket = { id: 3, price: 300 };
    repositories.getTicketById.mockResolvedValue(fakeTicket);
    await expect(ticketService.getTicketById(3))
      .resolves.toEqual(fakeTicket);
  });
});

describe("createTicket", () => {
  beforeEach(() => jest.clearAllMocks());

  it("rezervasyon bulunamazsa hata fırlatmalı", async () => {
    repositories.findReservation.mockResolvedValue(null);

    const ticketData = { reservationId: 1, ticketNumber: 5, price: 100 };
    await expect(ticketService.createTicket(ticketData))
      .rejects.toThrow("bu ıd ye ait rezervasyon bulunmamaktadır");
  });

  it("bilet numarası zaten kullanılmışsa hata fırlatmalı", async () => {
    repositories.findReservation.mockResolvedValue({ id: 1 });
    repositories.findTicketNumber.mockResolvedValue({ id: 9 });

    const ticketData = { reservationId: 1, ticketNumber: 5, price: 100 };
    await expect(ticketService.createTicket(ticketData))
      .rejects.toThrow("bilet numarası uygun değil");
  });

  it("fiyat sıfır veya negatifse hata fırlatmalı", async () => {
    repositories.findReservation.mockResolvedValue({ id: 1 });
    repositories.findTicketNumber.mockResolvedValue(null);

    const ticketData = { reservationId: 1, ticketNumber: 5, price: 0 };
    await expect(ticketService.createTicket(ticketData))
      .rejects.toThrow("bilet fiyatı sıfırdan büyük olmalı");
  });

  it("status CANCELLED ise hata fırlatmalı", async () => {
    repositories.findReservation.mockResolvedValue({ id: 1 });
    repositories.findTicketNumber.mockResolvedValue(null);

    const ticketData = { reservationId: 1, ticketNumber: 5, price: 100, status: "CANCELLED" };
    await expect(ticketService.createTicket(ticketData))
      .rejects.toThrow("bu bilet iptal edilmiş");
  });

  it("status USED ise hata fırlatmalı", async () => {
    repositories.findReservation.mockResolvedValue({ id: 1 });
    repositories.findTicketNumber.mockResolvedValue(null);

    const ticketData = { reservationId: 1, ticketNumber: 5, price: 100, status: "USED" };
    await expect(ticketService.createTicket(ticketData))
      .rejects.toThrow("BU bilet daha önce kullanılmış");
  });

  it("hepsi geçerliyse bilet oluşturulmalı", async () => {
    repositories.findReservation.mockResolvedValue({ id: 1 });
    repositories.findTicketNumber.mockResolvedValue(null);

    const ticketData = { reservationId: 1, ticketNumber: 5, price: 400 };
    const fakeCreatedTicket = { id: 10, ...ticketData };
    repositories.createTicket.mockResolvedValue(fakeCreatedTicket);

    await expect(ticketService.createTicket(ticketData))
      .resolves.toEqual(fakeCreatedTicket);
  });
});

describe("updateTicket", () => {
  beforeEach(() => jest.clearAllMocks());

  it("bilet bulunmazsa hata fırlatmalı", async () => {
    repositories.updateTicket.mockResolvedValue(null);
    await expect(ticketService.updateTicket(2, { price: 400 }))
      .rejects.toThrow("bilet bulunamadı");
  });

  it("başarılıysa güncellenmiş bileti döndürmeli", async () => {
    const fakeUpdated = { id: 5, ticketNumber: 5, price: 400 };
    repositories.updateTicket.mockResolvedValue(fakeUpdated);
    await expect(ticketService.updateTicket(5, { price: 400 }))
      .resolves.toEqual(fakeUpdated);
  });
});

describe("deleteTicket", () => {
  beforeEach(() => jest.clearAllMocks());

  it("bilet bulunmazsa hata fırlatmalı", async () => {
    repositories.deleteTicket.mockResolvedValue(null);
    await expect(ticketService.deleteTicket(2))
      .rejects.toThrow("bilet bulunamadı");
  });

  it("başarılıysa silinen bileti döndürmeli", async () => {
    const fakeDeleted = { id: 5, ticketNumber: 5, price: 400 };
    repositories.deleteTicket.mockResolvedValue(fakeDeleted);
    await expect(ticketService.deleteTicket(5))
      .resolves.toEqual(fakeDeleted);
  });
});
const seatService = require("../services/seat.service");
const repositories = require("../repositories/seat.repositories");

jest.mock("../repositories/seat.repositories");

describe("getSeats", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("seat listesini döndürmeli", async () => {
    const fakeSeats = [{ id: 1 }, { id: 2 }];
    repositories.getSeats.mockResolvedValue(fakeSeats);

    await expect(seatService.getSeats()).resolves.toEqual(fakeSeats);
  });
});

describe("getSeatById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("seat bulunmazsa hata fırlatmalı", async () => {
    repositories.getSeatById.mockResolvedValue(null);

    await expect(seatService.getSeatById(1))
      .rejects.toThrow("koltuk bulunamadı");
  });

  it("seat bulunursa döndürmeli", async () => {
    const fakeSeat = { id: 2, row: 4 };
    repositories.getSeatById.mockResolvedValue(fakeSeat);

    await expect(seatService.getSeatById(2))
      .resolves.toEqual(fakeSeat);
  });
});

describe("getSeatsByVenue", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("venue'ya ait koltukları döndürmeli", async () => {
    const fakeSeats = [{ id: 1 }, { id: 2 }];
    repositories.getSeatsByVenue.mockResolvedValue(fakeSeats);

    await expect(seatService.getSeatsByVenue(2)).resolves.toEqual(fakeSeats);
  });
});

describe("createSeat", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("mekan numarası sıfır veya negatifse hata fırlatmalı", async () => {
    const seatData = { venueId: 0, seatNumber: 5, row: 3 };

    await expect(seatService.createSeat(seatData))
      .rejects.toThrow("mekan  numarası sıfırdan büyük olmalıdır");
  });

  it("koltuk numarası sıfır veya negatifse hata fırlatmalı", async () => {
    const seatData = { venueId: 1, seatNumber: 0, row: 3 };

    await expect(seatService.createSeat(seatData))
      .rejects.toThrow("koltuk  numarası sıfırdan büyük olmalıdır");
  });

  it("row sıfır veya negatifse hata fırlatmalı", async () => {
    const seatData = { venueId: 1, seatNumber: 5, row: 0 };

    await expect(seatService.createSeat(seatData))
      .rejects.toThrow("sıra sıfırdan büyük olmalıdır");
  });

  it("her şey geçerliyse seat oluşturulmalı", async () => {
    const seatData = { venueId: 1, seatNumber: 5, row: 3 };
    const fakeCreatedSeat = { id: 10, ...seatData };
    repositories.createSeat.mockResolvedValue(fakeCreatedSeat);

    await expect(seatService.createSeat(seatData))
      .resolves.toEqual(fakeCreatedSeat);
  });
});

describe("updateSeat", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("seat bulunmazsa hata fırlatmalı", async () => {
    repositories.updateSeat.mockResolvedValue(null);

    await expect(seatService.updateSeat(5, { row: 2 }))
      .rejects.toThrow("koltuk bulunamadı");
  });

  it("seat bulunursa güncellenmiş halini döndürmeli", async () => {
    const fakeUpdatedSeat = { id: 4, venueId: 5, row: 2 };
    repositories.updateSeat.mockResolvedValue(fakeUpdatedSeat);

    await expect(seatService.updateSeat(4, { row: 2 }))
      .resolves.toEqual(fakeUpdatedSeat);
  });
});

describe("deleteSeat", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("seat bulunmazsa hata fırlatmalı", async () => {
    repositories.deleteSeat.mockResolvedValue(null);

    await expect(seatService.deleteSeat(5))
      .rejects.toThrow("koltuk bulunamadı");
  });

  it("seat bulunursa silinmiş seat'ı döndürmeli", async () => {
    const fakeDeletedSeat = { id: 4, venueId: 5 };
    repositories.deleteSeat.mockResolvedValue(fakeDeletedSeat);

    await expect(seatService.deleteSeat(4))
      .resolves.toEqual(fakeDeletedSeat);
  });
});
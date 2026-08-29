const venueService = require("../services/venue.service");
const repositories = require("../repositories/venue.repositories");

jest.mock("../repositories/venue.repositories");

describe("getVenues", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("venue listesini döndürmeli", async () => {
    const fakeVenues = [{ id: 1 }, { id: 2 }];
    repositories.getVenues.mockResolvedValue(fakeVenues);

    await expect(venueService.getVenues()).resolves.toEqual(fakeVenues);
  });
});

describe("getVenueById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("venue bulunmazsa hata fırlatmalı", async () => {
    repositories.getVenueById.mockResolvedValue(null);

    await expect(venueService.getVenueById(1))
      .rejects.toThrow("mekan bulunamadı");
  });

  it("venue bulunursa döndürmeli", async () => {
    const fakeVenue = { id: 2, name: "salon" };
    repositories.getVenueById.mockResolvedValue(fakeVenue);

    await expect(venueService.getVenueById(2))
      .resolves.toEqual(fakeVenue);
  });
});

describe("createVenue", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("kapasite sıfır veya negatifse hata fırlatmalı", async () => {
    const venueData = { name: "salon", address: "burdur", capacity: 0 };

    await expect(venueService.createVenue(venueData))
      .rejects.toThrow("mekan kapasitesi sıfırdan büyük olmalıdır");
  });

  it("kapasite geçerliyse venue oluşturulmalı", async () => {
    const venueData = { name: "salon", address: "burdur", capacity: 100 };
    const fakeCreatedVenue = { id: 5, ...venueData };
    repositories.createVenue.mockResolvedValue(fakeCreatedVenue);

    await expect(venueService.createVenue(venueData))
      .resolves.toEqual(fakeCreatedVenue);
  });
});

describe("updateVenue", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("venue bulunmazsa hata fırlatmalı", async () => {
    repositories.updateVenue.mockResolvedValue(null);

    await expect(venueService.updateVenue(1, { capacity: 200 }))
      .rejects.toThrow("mekan bulunamadı");
  });

  it("venue bulunursa güncellenmiş halini döndürmeli", async () => {
    const fakeUpdatedVenue = { id: 1, name: "salon", capacity: 200 };
    repositories.updateVenue.mockResolvedValue(fakeUpdatedVenue);

    await expect(venueService.updateVenue(1, { capacity: 200 }))
      .resolves.toEqual(fakeUpdatedVenue);
  });
});

describe("deleteVenue", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("venue bulunmazsa hata fırlatmalı", async () => {
    repositories.deleteVenue.mockResolvedValue(null);

    await expect(venueService.deleteVenue(1))
      .rejects.toThrow("mekan bulunamadı");
  });

  it("venue bulunursa silinmiş venue'yu döndürmeli", async () => {
    const fakeDeletedVenue = { id: 1, name: "salon" };
    repositories.deleteVenue.mockResolvedValue(fakeDeletedVenue);

    await expect(venueService.deleteVenue(1))
      .resolves.toEqual(fakeDeletedVenue);
  });
});
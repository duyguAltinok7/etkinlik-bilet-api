const eventService = require("../services/event.service");
const repositories = require("../repositories/event.repositories");

jest.mock("../repositories/event.repositories");

describe("getEventById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("event ID bulunmazsa hata fırlatmalı", async () => {
    repositories.getEventById.mockResolvedValue(null);
    await expect(eventService.getEventById(1))
      .rejects.toThrow("event bulunamadı");
  });

  it("event bulunursa döndürmeli", async () => {
    const fakeEvent = { id: 1, title: "Konser", description: "açıklama", date: "20.10.26" };
    repositories.getEventById.mockResolvedValue(fakeEvent);

    await expect(eventService.getEventById(1))
      .resolves.toEqual(fakeEvent);
  });
});

describe("createEvent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("her şey doğruysa event oluşturulmalı", async () => {
    const eventData = { title: "Konser", description: "açıklama", date: "20.10.26" };
    const fakeCreatedEvent = { id: 5, ...eventData };
    repositories.createEvent.mockResolvedValue(fakeCreatedEvent);

    await expect(eventService.createEvent(eventData))
      .resolves.toEqual(fakeCreatedEvent);
  });
});

describe("updateEvent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("event bulunmazsa hata fırlatmalı", async () => {
    repositories.updateEvent.mockResolvedValue(null);
    await expect(eventService.updateEvent(2, { title: "Yeni başlık" }))
      .rejects.toThrow("event bulunamadı");
  });

  it("event bulunursa güncellenmiş halini döndürmeli", async () => {
    const fakeUpdatedEvent = { id: 1, title: "Yeni başlık", description: "açıklama", date: "20.10.26" };
    repositories.updateEvent.mockResolvedValue(fakeUpdatedEvent);

    await expect(eventService.updateEvent(1, { title: "Yeni başlık" }))
      .resolves.toEqual(fakeUpdatedEvent);
  });
});

describe("deleteEvent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("event bulunmazsa hata fırlatmalı", async () => {
    repositories.deleteEvent.mockResolvedValue(null);
    await expect(eventService.deleteEvent(2))
      .rejects.toThrow("event bulunamadı");
  });

  it("event bulunursa silinmiş event'ı döndürmeli", async () => {
    const fakeDeletedEvent = { id: 2, title: "Konser", description: "açıklama", date: "20.10.26" };
    repositories.deleteEvent.mockResolvedValue(fakeDeletedEvent);

    await expect(eventService.deleteEvent(2))
      .resolves.toEqual(fakeDeletedEvent);
  });
});
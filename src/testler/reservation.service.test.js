const reservationService = require("../services/reservation.service");
const repositories = require("../repositories/reservation.repositories");
const AppError = require("../utils/AppError");

jest.mock("../repositories/reservation.repositories");

describe("getReservationById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("reservation bulunmazsa hata fırlatılmalı", async () => {
    repositories.getReservationById.mockResolvedValue(null);

    await expect(reservationService.getReservationById(2))
      .rejects.toThrow("Rezervasyon bulunamadı");
  });

it("admin herhangi bir rezervasyonu görebilir", async () => {
  const fakeReservation = { id: 2, userId: 99, status: "PENDING" };
  repositories.getReservationById.mockResolvedValue(fakeReservation);

  const adminUser = { id: 1, role: "admin" };

  await expect(reservationService.getReservationById(2, adminUser))
    .resolves.toEqual(fakeReservation);
});


it("normal kullanıcı kendi rezervasyonunu görebilmeli", async () => {
  const fakeReservation = { id: 2, userId: 5, status: "PENDING" };
  repositories.getReservationById.mockResolvedValue(fakeReservation);
  const userr = { id: 5, role: "user" };

  await expect(reservationService.getReservationById(2, userr))
    .resolves.toEqual(fakeReservation);
});

it("normal kullanıcı başkasının rezervasyonunu görmeye çalışırsa hata fırlatmalı", async () => {
  const fakeReservation = { id: 2, userId: 99, status: "PENDING" };
  repositories.getReservationById.mockResolvedValue(fakeReservation);
  const userr = { id: 4, role: "user" };

  await expect(reservationService.getReservationById(2, userr))
    .rejects.toThrow("Bu rezervasyonu görüntüleme yetkiniz yok");
});
});

describe("createReservation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("kullanıcı bulunamazsa hata fırlatmalı", async () => {
    repositories.findUserById.mockResolvedValue(null);

    const reservationData = { userId: 1, eventId: 1, seatId: 1 };

    await expect(reservationService.createReservation(reservationData))
      .rejects.toThrow("Kullanıcı bulunamadı");
  });
it("etkinlik bulunmazsa hata fırlatmalı", async () => {
  repositories.findUserById.mockResolvedValue({ id: 1 });
  repositories.findEventById.mockResolvedValue(null);

  const reservationData = { userId: 1, eventId: 1, seatId: 1 };

  await expect(reservationService.createReservation(reservationData))
    .rejects.toThrow("Etkinlik bulunamadı");
});

it("koltuk bulunmazsa hata fırlatmalı", async () => {
  repositories.findUserById.mockResolvedValue({ id: 1 });
  repositories.findEventById.mockResolvedValue({ id: 1, venueId: 10 });
  repositories.findSeatById.mockResolvedValue(null);

  const reservationData = { userId: 1, eventId: 1, seatId: 1 };

  await expect(reservationService.createReservation(reservationData))
    .rejects.toThrow("Koltuk bulunamadı");
});
it("koltuk bu etkinliğin mekanına ait değilse hata fırlatmalı", async () => {
  repositories.findUserById.mockResolvedValue({ id: 1 });
  repositories.findEventById.mockResolvedValue({ id: 1, venueId: 10 });
  repositories.findSeatById.mockResolvedValue({ id: 1, venueId: 99 }); // farklı venue

  const reservationData = { userId: 1, eventId: 1, seatId: 1 };

  await expect(reservationService.createReservation(reservationData))
    .rejects.toThrow("Bu koltuk bu etkinliğin mekanına ait değil");
});

it("koltuk bu etkinlik için zaten rezerve edilmişse hata fırlatmalı", async () => {
  repositories.findUserById.mockResolvedValue({ id: 1 });
  repositories.findEventById.mockResolvedValue({ id: 1, venueId: 10 });
  repositories.findSeatById.mockResolvedValue({ id: 1, venueId: 10 }); // aynı venue
  repositories.findReservationByEventAndSeat.mockResolvedValue({ id: 5 }); // zaten var

  const reservationData = { userId: 1, eventId: 1, seatId: 1 };

  await expect(reservationService.createReservation(reservationData))
    .rejects.toThrow("Bu koltuk bu etkinlik için zaten rezerve edilmiş");
});

it("her şey doğruysa rezervasyon oluşturulmalı", async () => {
  repositories.findUserById.mockResolvedValue({ id: 1 });
  repositories.findEventById.mockResolvedValue({ id: 1, venueId: 10 });
  repositories.findSeatById.mockResolvedValue({ id: 1, venueId: 10 });
  repositories.findReservationByEventAndSeat.mockResolvedValue(null);

  const fakeNewReservation = { id: 20, userId: 1, eventId: 1, seatId: 1, status: "PENDING" };
  repositories.createReservation.mockResolvedValue(fakeNewReservation);

  const reservationData = { userId: 1, eventId: 1, seatId: 1 };

  await expect(reservationService.createReservation(reservationData))
    .resolves.toEqual(fakeNewReservation);
});
});

describe("cancelReservation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("reservation bulunmazsa hata fırlatmalı", async () => {
    repositories.getReservationById.mockResolvedValue(null);

    const user = { id: 1, role: "user" };

    await expect(reservationService.cancelReservation(1, user))
      .rejects.toThrow("Rezervasyon bulunamadı");
  });

  it("kullanıcı başkasının rezervasyonunu iptal etmeye çalışırsa hata fırlatmalı", async () => {
    repositories.getReservationById.mockResolvedValue({ id: 1, userId: 99, status: "PENDING" });

    const user = { id: 4, role: "user" };

    await expect(reservationService.cancelReservation(1, user))
      .rejects.toThrow("Bu rezervasyonu iptal etme yetkiniz yok");
  });

  it("rezervasyon zaten iptal edilmişse hata fırlatmalı", async () => {
    repositories.getReservationById.mockResolvedValue({ id: 1, userId: 4, status: "CANCELLED" });

    const user = { id: 4, role: "user" };

    await expect(reservationService.cancelReservation(1, user))
      .rejects.toThrow("Bu rezervasyon zaten iptal edilmiş");
  });

  it("her şey doğruysa rezervasyon iptal edilmeli", async () => {
    repositories.getReservationById.mockResolvedValue({ id: 1, userId: 4, status: "PENDING" });

    const fakeCancelled = { id: 1, userId: 4, status: "CANCELLED" };
    repositories.cancelReservation.mockResolvedValue(fakeCancelled);

    const user = { id: 4, role: "user" };

    await expect(reservationService.cancelReservation(1, user))
      .resolves.toEqual(fakeCancelled);
  });

});

describe("deleteReservation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("reservation bulunmazsa hata fırlatmalı", async () => {
    repositories.getReservationById.mockResolvedValue(null);

    const user = { id: 1, role: "user" };

    await expect(reservationService.deleteReservation(1, user))
      .rejects.toThrow("Rezervasyon bulunamadı");
  });

  it("kullanıcı başkasının rezervasyonunu silmeye çalışırsa hata fırlatmalı", async () => {
    repositories.getReservationById.mockResolvedValue({ id: 1, userId: 99, status: "PENDING" });

    const user = { id: 4, role: "user" };

    await expect(reservationService.deleteReservation(1, user))
      .rejects.toThrow("Bu rezervasyonu silme yetkiniz yok");
  });

  it("her şey doğruysa rezervasyon silinmeli", async () => {
    repositories.getReservationById.mockResolvedValue({ id: 1, userId: 4, status: "PENDING" });

    const fakeDeleted = { id: 1, userId: 4, status: "PENDING" };
    repositories.deleteReservation.mockResolvedValue(fakeDeleted);

    const user = { id: 4, role: "user" };

    await expect(reservationService.deleteReservation(1, user))
      .resolves.toEqual(fakeDeleted);
  });

});
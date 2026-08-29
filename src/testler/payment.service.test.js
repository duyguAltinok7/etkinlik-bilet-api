const paymentService = require("../services/payment.service");
const repositories = require("../repositories/payment.repositories");
const AppError = require("../utils/AppError");

// repository modülünü tamamen mockluyoruz  // sahte bir nesne gibi düşünücez gerçek db ye ulaşmicak 
jest.mock("../repositories/payment.repositories");

describe("createPayment", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rezervasyon bulunamazsa hata fırlatmalı", async () => {
    repositories.findReservation.mockResolvedValue(null);

    const paymentData = {
      reservationId: 1,
      amount: 100,
      status: "PENDING",
      paymentMethod: "CREDIT_CARD",
      transcationId: "tx123",
    };

    await expect(paymentService.createPayment(paymentData))
      .rejects.toThrow("Bu rezervasyon bulunamadı");
  });

  it("amount sıfır veya negatifse hata fırlatmalı", async () => {
    repositories.findReservation.mockResolvedValue({ id: 1, status: "ACTIVE" });

    const paymentData = {
      reservationId: 1,
      amount: 0,
      status: "PENDING",
      paymentMethod: "CREDIT_CARD",
      transcationId: "tx456",
    };

    await expect(paymentService.createPayment(paymentData))
      .rejects.toThrow("Ödeme miktarı sıfırdan büyük olmalı");
  });

  it("yeni ödeme REFUNDED durumunda oluşturulamaz", async () => {
    repositories.findReservation.mockResolvedValue({ id: 1, status: "ACTIVE" });

    const paymentData = {
      reservationId: 1,
      amount: 100,
      status: "REFUNDED",
      paymentMethod: "CREDIT_CARD",
      transcationId: "tx456",
    };

    await expect(paymentService.createPayment(paymentData))
      .rejects.toThrow("Yeni ödeme REFUNDED durumunda oluşturulamaz");
  });

  it("geçersiz status hata fırlatmalı", async () => {
    repositories.findReservation.mockResolvedValue({ id: 1, status: "ACTIVE" });

    const paymentData = {
      reservationId: 1,
      amount: 100,
      status: "CANCELLED",
      paymentMethod: "CREDIT_CARD",
      transcationId: "tx456",
    };

    await expect(paymentService.createPayment(paymentData))
      .rejects.toThrow("Geçersiz ödeme durumu");
  });

  it("geçerli bir ödeme yöntemi girilmedi", async () => {
    repositories.findReservation.mockResolvedValue({ id: 1, status: "ACTIVE" });

    const paymentData = {
      reservationId: 1,
      amount: 100,
      status: "PENDING",
      paymentMethod: "PAYPAL",
      transcationId: "tx456",
    };

    await expect(paymentService.createPayment(paymentData))
      .rejects.toThrow("Geçerli bir ödeme yöntemi girilmedi");
  });

  it("transaction ID daha önce kullanılmışsa hata fırlatmalı", async () => {
    repositories.findReservation.mockResolvedValue({ id: 1, status: "ACTIVE" });
    repositories.findTransactionById.mockResolvedValue({ id: 5 });

    const paymentData = {
      reservationId: 1,
      amount: 100,
      status: "PENDING",
      paymentMethod: "CREDIT_CARD",
      transcationId: "tx456",
    };

    await expect(paymentService.createPayment(paymentData))
      .rejects.toThrow("Bu transaction ID daha önce kullanılmış");
  });

  it("her şey doğruysa payment oluşmalı", async () => {
    repositories.findReservation.mockResolvedValue({ id: 1, status: "ACTIVE" });
    repositories.findTransactionById.mockResolvedValue(null);

    const fakeCreatedPayment = { id: 10, amount: 100, status: "PENDING" };
    repositories.createPayment.mockResolvedValue(fakeCreatedPayment);

    const paymentData = {
      reservationId: 1,
      amount: 100,
      status: "PENDING",
      paymentMethod: "CREDIT_CARD",
      transcationId: "tx456",
    };

    await expect(paymentService.createPayment(paymentData))
      .resolves.toEqual(fakeCreatedPayment);
  });

});

describe("getPaymentById", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("payment bulunmazsa hata fırlatmalı", async () => {
    repositories.getPaymentById.mockResolvedValue(null);

    await expect(paymentService.getPaymentById(1))
      .rejects.toThrow("Ödeme bulunamadı");
  });

  it("payment bulunursa onu döndürmeli", async () => {
    repositories.getPaymentById.mockResolvedValue({ id: 5 });

    await expect(paymentService.getPaymentById(5))
      .resolves.toEqual({ id: 5 });
  });

});

describe("updatePayment", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("payment bulunmazsa hata fırlatmalı", async () => {
    repositories.getPaymentById.mockResolvedValue(null);

    await expect(paymentService.updatePayment(1, { amount: 200 }))
      .rejects.toThrow("Ödeme bulunamadı");
  });

  it("payment bulunursa güncellenmiş payment'ı döndürmeli", async () => {
    repositories.getPaymentById.mockResolvedValue({ id: 1, amount: 100 });

    const fakeUpdatedPayment = { id: 1, amount: 200 };
    repositories.updatePayment.mockResolvedValue(fakeUpdatedPayment);

    await expect(paymentService.updatePayment(1, { amount: 200 }))
      .resolves.toEqual(fakeUpdatedPayment);
  });

});

describe("deletePayment", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("payment bulunmazsa hata fırlatmalı", async () => {
    repositories.getPaymentById.mockResolvedValue(null);

    await expect(paymentService.deletePayment(2))
      .rejects.toThrow("Ödeme bulunamadı");
  });

  it("payment bulunursa silinmiş payment'ı döndürmeli", async () => {
    repositories.getPaymentById.mockResolvedValue({ id: 2, amount: 100 });

    const fakeDeletedPayment = { id: 2, amount: 100 };
    repositories.deletePayment.mockResolvedValue(fakeDeletedPayment);

    await expect(paymentService.deletePayment(2))
      .resolves.toEqual(fakeDeletedPayment);
  });

});
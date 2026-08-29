const userService = require("../services/user.services");
const repositories = require("../repositories/user.repositories");
const bcrypt = require("bcrypt");

jest.mock("../repositories/user.repositories");
jest.mock("bcrypt");

describe("getUserById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("kullanıcı bulunmazsa hata fırlatmalı", async () => {
    repositories.findUserById.mockResolvedValue(null);

    await expect(userService.getUserById(1))
      .rejects.toThrow("Kullanıcı bulunamadı");
  });

  it("kullanıcı bulunursa şifresiz döndürmeli", async () => {
    const fakeUser = { id: 1, email: "a@a.com", password: "hashed123", name: "Duygu" };
    repositories.findUserById.mockResolvedValue(fakeUser);

    await expect(userService.getUserById(1)).resolves.toEqual({
      id: 1, email: "a@a.com", name: "Duygu",
    }); // password alanı olmamalı
  });
});

describe("updateUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("kullanıcı bulunmazsa hata fırlatmalı", async () => {
    repositories.findUserById.mockResolvedValue(null);

    await expect(userService.updateUser(2, { name: "duygu" }))
      .rejects.toThrow("Kullanıcı bulunamadı");
  });

  it("email başka kullanıcıya aitse hata fırlatmalı", async () => {
    repositories.findUserById.mockResolvedValue({ id: 2, email: "eski@a.com" });
    repositories.findUserByEmail.mockResolvedValue({ id: 5, email: "yeni@a.com" }); // başka kullanıcı

    await expect(userService.updateUser(2, { email: "yeni@a.com" }))
      .rejects.toThrow("Bu email başka bir kullanıcı tarafından kullanılıyor");
  });

  it("email kendisine aitse güncelleme başarılı olmalı", async () => {
    repositories.findUserById.mockResolvedValue({ id: 2, email: "ayni@a.com" });
    repositories.findUserByEmail.mockResolvedValue({ id: 2, email: "ayni@a.com" }); // kendisi

    const fakeUpdated = { id: 2, email: "ayni@a.com", password: "hashed", name: "Yeni İsim" };
    repositories.updateUser.mockResolvedValue(fakeUpdated);

    await expect(userService.updateUser(2, { email: "ayni@a.com", name: "Yeni İsim" }))
      .resolves.toEqual({ id: 2, email: "ayni@a.com", name: "Yeni İsim" });
  });

  it("email verilmeden güncelleme yapılabilmeli", async () => {
    repositories.findUserById.mockResolvedValue({ id: 2, email: "a@a.com" });

    const fakeUpdated = { id: 2, email: "a@a.com", password: "hashed", name: "Yeni İsim" };
    repositories.updateUser.mockResolvedValue(fakeUpdated);

    await expect(userService.updateUser(2, { name: "Yeni İsim" }))
      .resolves.toEqual({ id: 2, email: "a@a.com", name: "Yeni İsim" });
  });
});

describe("deleteUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("kullanıcı bulunmazsa hata fırlatmalı", async () => {
    repositories.findUserById.mockResolvedValue(null);

    await expect(userService.deleteUser(3))
      .rejects.toThrow("Kullanıcı bulunamadı");
  });

  it("kullanıcı bulunursa başarı mesajı dönmeli", async () => {
    repositories.findUserById.mockResolvedValue({ id: 3 });
    repositories.deleteUser.mockResolvedValue({ id: 3 });

    await expect(userService.deleteUser(3))
      .resolves.toEqual({ message: "Kullanıcı başarıyla silindi" });
  });
});

describe("changedPassword", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("kullanıcı bulunmazsa hata fırlatmalı", async () => {
    repositories.findUserById.mockResolvedValue(null);

    await expect(userService.changedPassword(1, "eski123", "yeni123456"))
      .rejects.toThrow("kullanıcı bulunamadı");
  });

  it("mevcut şifre yanlışsa hata fırlatmalı", async () => {
    repositories.findUserById.mockResolvedValue({ id: 1, password: "hashedOld" });
    bcrypt.compare.mockResolvedValue(false); // şifre uyuşmuyor

    await expect(userService.changedPassword(1, "yanlisSifre", "yeni123456"))
      .rejects.toThrow("mevcut şifre yanlış");
  });

  it("yeni şifre 6 karakterden kısaysa hata fırlatmalı", async () => {
    repositories.findUserById.mockResolvedValue({ id: 1, password: "hashedOld" });
    bcrypt.compare.mockResolvedValue(true); // eski şifre doğru

    await expect(userService.changedPassword(1, "eski123", "abc"))
      .rejects.toThrow("yeni şifre  en az 6 karakter olmalı");
  });

  it("her şey geçerliyse şifre değiştirilmeli", async () => {
    repositories.findUserById.mockResolvedValue({ id: 1, password: "hashedOld" });
    bcrypt.compare.mockResolvedValue(true);
    bcrypt.hash.mockResolvedValue("hashedNew");
    repositories.updateUser.mockResolvedValue({ id: 1, password: "hashedNew" });

    await expect(userService.changedPassword(1, "eski123", "yeni123456"))
      .resolves.toEqual({ message: "şifre başarıyla değiştirildi " });
  });
});
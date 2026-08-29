const authService = require("../services/auth.services");
const userRepository = require("../repositories/user.repositories");
const refreshTokenRepository = require("../repositories/refreshToken.repositories");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("../repositories/user.repositories");
jest.mock("../repositories/refreshToken.repositories");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("authRegister", () => {
  beforeEach(() => jest.clearAllMocks());

  it("email zaten kayıtlıysa hata fırlatmalı", async () => {
    userRepository.findUserByEmail.mockResolvedValue({ id: 1, email: "a@a.com" });

    await expect(authService.authRegister({ name: "Duygu", email: "a@a.com", password: "1234567" }))
      .rejects.toThrow("bu email ile daha önce kayıt olunmuş");
  });

  it("email boşsa kayıt başarılı olmalı ve şifre döndürülmemeli", async () => {
    userRepository.findUserByEmail.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashedPassword123");

    const fakeCreatedUser = { id: 5, name: "Duygu", email: "a@a.com", password: "hashedPassword123", role: "user" };
    userRepository.createUser.mockResolvedValue(fakeCreatedUser);

    await expect(authService.authRegister({ name: "Duygu", email: "a@a.com", password: "1234567" }))
      .resolves.toEqual({ id: 5, name: "Duygu", email: "a@a.com", role: "user" }); // password yok

    expect(bcrypt.hash).toHaveBeenCalledWith("1234567", 10); // bellirli argümanlar çağrılıp çağrılmadığına bakıyoruz
  });
});

describe("authLogin", () => {
  beforeEach(() => jest.clearAllMocks());

  it("kullanıcı bulunamazsa hata fırlatmalı", async () => {
    userRepository.findUserByEmail.mockResolvedValue(null);

    await expect(authService.authLogin({ email: "yok@a.com", password: "1234567" }))
      .rejects.toThrow("email veya şifre hatalı");
  });

  it("şifre yanlışsa hata fırlatmalı", async () => {
    userRepository.findUserByEmail.mockResolvedValue({ id: 1, email: "a@a.com", password: "hashed" });
    bcrypt.compare.mockResolvedValue(false);

    await expect(authService.authLogin({ email: "a@a.com", password: "yanlisSifre" }))
      .rejects.toThrow("email veya şifre  hatalı");
  });

  it("her şey doğruysa access ve refresh token dönmeli", async () => {
    userRepository.findUserByEmail.mockResolvedValue({ id: 1, email: "a@a.com", password: "hashed", role: "user" });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("fake-access-token");
    refreshTokenRepository.createRefreshToken.mockResolvedValue({ id: 1 });

    const result = await authService.authLogin({ email: "a@a.com", password: "dogruSifre" });

    expect(result.accessToken).toBe("fake-access-token");
    expect(result.refreshToken).toBeDefined(); // crypto ile üretiliyor, gerçek bir string olmalı
    expect(refreshTokenRepository.createRefreshToken).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 1 })
    );
  });
});

describe("authRefresh", () => {
  beforeEach(() => jest.clearAllMocks());

  it("token bulunamazsa hata fırlatmalı", async () => {
    refreshTokenRepository.findByToken.mockResolvedValue(null);

    await expect(authService.authRefresh("gecersiz-token"))
      .rejects.toThrow("geçersiz refresh token");
  });

  it("token süresi dolmuşsa hata fırlatmalı ve token silinmeli", async () => {
    const expiredToken = { userId: 1, expiresAt: new Date(Date.now() - 1000) }; // geçmiş tarih
    refreshTokenRepository.findByToken.mockResolvedValue(expiredToken);
    refreshTokenRepository.deleteByToken.mockResolvedValue({});

    await expect(authService.authRefresh("suresi-dolmus-token"))
      .rejects.toThrow("refresh token süresi dolmuş");

    expect(refreshTokenRepository.deleteByToken).toHaveBeenCalledWith("suresi-dolmus-token");
  });

  it("kullanıcı bulunamazsa hata fırlatmalı", async () => {
    const validToken = { userId: 99, expiresAt: new Date(Date.now() + 100000) }; // gelecek tarih
    refreshTokenRepository.findByToken.mockResolvedValue(validToken);
    userRepository.findUserById.mockResolvedValue(null);

    await expect(authService.authRefresh("gecerli-token"))
      .rejects.toThrow("kullanıcı bulunamadı");
  });

  it("her şey doğruysa yeni access token dönmeli", async () => {
    const validToken = { userId: 1, expiresAt: new Date(Date.now() + 100000) };
    refreshTokenRepository.findByToken.mockResolvedValue(validToken);
    userRepository.findUserById.mockResolvedValue({ id: 1, email: "a@a.com", role: "user" });
    jwt.sign.mockReturnValue("yeni-access-token");

    await expect(authService.authRefresh("gecerli-token"))
      .resolves.toEqual({ accessToken: "yeni-access-token" });
  });
});

describe("authLogout", () => {
  beforeEach(() => jest.clearAllMocks());

  it("token bulunamazsa hata fırlatmalı", async () => {
    refreshTokenRepository.findByToken.mockResolvedValue(null);

    await expect(authService.authLogout("gecersiz-token"))
      .rejects.toThrow("Geçersiz refresh token");
  });

  it("token bulunursa çıkış yapılmalı", async () => {
    refreshTokenRepository.findByToken.mockResolvedValue({ id: 1 });
    refreshTokenRepository.deleteByToken.mockResolvedValue({});

    await expect(authService.authLogout("gecerli-token"))
      .resolves.toEqual({ message: "Başarıyla çıkış yapıldı" });
  });
});
# Etkinlik Bilet API

Etkinlik, rezervasyon ve bilet işlemlerini yönetmek için geliştirilmiş RESTful Backend API projesidir.

## Teknolojiler

* Node.js
* Express.js
* PostgreSQL
* Prisma ORM
* Redis
* JWT
* Joi


## Özellikler

* Kullanıcı kayıt ve giriş işlemleri
* JWT tabanlı authentication
* Role-based authorization (`user`, `organizer`, `admin`)
* Etkinlik yönetimi
* Mekan ve koltuk yönetimi
* Rezervasyon işlemleri
* Bilet ve ödeme işlemleri
* Redis ile caching
* WebSocket ile gerçek zamanlı koltuk güncellemeleri
* Request validation
* Merkezi hata yönetimi
* Logging ve rate limiting

## Proje Yapısı

```text
src/
├── controllers/
├── routes/
├── services/
├── middleware/
├── websocket/
├── utils/
├── generated/
└── server.js
```


## Kurulum

```bash
git clone <repository-url>
cd etkinlik-bilet-api
npm install
```


Prisma Client'ı oluşturun:

```bash
npx prisma generate
npx prisma migrate dev
```

Uygulamayı çalıştırın:

```bash
npm run dev
```

## API

Temel endpoint grupları:

```text
/api/auth
/api/users
/api/events
/api/venues
/api/seats
/api/reservations
/api/bookings
/api/tickets
/api/payments
```

## Amaç

Proje; REST API geliştirme, authentication, veritabanı ilişkileri, caching, gerçek zamanlı iletişim ve backend mimarisi konularında pratik yapmak amacıyla geliştirilmiştir.

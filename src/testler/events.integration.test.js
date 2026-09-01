const request=require("supertest");// HTTP isteği göndermemizi sağlicak
const app=require("../app");
const prisma=require("../config/prisma");

let accessToken;
let venueId;
beforeAll(async () => {

    const email = `test-${Date.now()}@example.com`;

    const registerResponse = await request(app)
        .post("/api/auth/register")
        .send({
            name: "Test Organizer",
            email,
            password: "123456"
        })
        .expect(201);

    const userId = registerResponse.body.id;

    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            role: "organizer"
        }
    });

    const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({
            email,
            password: "123456"
        })
        .expect(200);

    accessToken = loginResponse.body.accessToken;
});

describe("GET /api/events", () => {
    test("event listesini getirmeli", async()=>{
       // await request(app)  // bu express uygulamasına istek göndereceğim
        //   .get("/api/events") // giden istek
         //  .expect(200);  // statusCode miz 200 olmalı

         const response=await request(app)
            .get("/api/events")
            .expect(200);
        // Response body array olmalı
         expect(response.body).toBeInstanceOf(Array);
        //// Liste boş değilse ilk event'in yapısını kontrol et
         if(response.body.length>0){//Array'in içerisindeki event gerçekten bir object mi?
            expect(response.body[0]).toBeInstanceOf(Object);
            expect(response.body[0]).toHaveProperty("id");
            expect(response.body[0]).toHaveProperty("title")
            expect(response.body[0]).toHaveProperty("description");
            expect(response.body[0]).toHaveProperty("date");
         }
    });
   
});

describe("GET /api/events/:id", ()=>{
    test("id ile event getirmeli",async()=>{
        const response=await request(app)
           .get("/api/events/1")
           .expect(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("id")
        expect(response.body).toHaveProperty("title")
        expect(response.body).toHaveProperty("description")
        expect(response.body).toHaveProperty("date")
    });

    test("olmayan event için 404 dönmeli",async ()=>{
        const response=await request(app)
           .get("/apii/events/9999")
           .expect(404)
        expect(response.body.message).toBe("event bulunamadı")// hem 404 dönecek hem de doğru hata mesajı döndürecek
    })
});

describe("POST /api/events", () => {

    test("organizer event oluşturabilmeli", async () => {

        const response = await request(app)
            .post("/api/events")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                title: "Integration Test Event",
                description: "Test açıklaması",
                date: "2026-10-01T20:00:00.000Z",
                venueId: 3
            })
            .expect(201);

        expect(response.body).toHaveProperty("id");
        expect(response.body.title).toBe("Integration Test Event");
        expect(response.body.description).toBe("Test açıklaması");
        expect(response.body.venueId).toBe(3);
    });

});
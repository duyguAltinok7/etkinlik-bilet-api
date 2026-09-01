
const repositories = require("../repositories/reservation.repositories");
const AppError=require("../utils/AppError")
const prisma=require("../config/prisma.js");



// TÜM REZERVASYONLARI GETİR


const getReservations = async (user) => {

    // ADMIN bütün rezervasyonları görebilir
    if (user.role === "admin") {

        return await repositories.getReservations();

    }

    // Normal kullanıcı sadece kendi rezervasyonlarını görür
    return await repositories.getReservationsByUserId(user.id);
};



// ID'YE GÖRE REZERVASYON GETİR


const getReservationById = async (id, user) => {

    const reservation =
        await repositories.getReservationById(id);

    if (!reservation) {

       throw new AppError("Rezervasyon bulunamadı",404);
        
    }


    // ADMIN her rezervasyonu görebilir
    if (user.role === "admin") {

        return reservation;
    }


    // Kullanıcı sadece kendi rezervasyonunu görebilir
    if (reservation.userId !== user.id) {

        throw new AppError(
            "Bu rezervasyonu görüntüleme yetkiniz yok",403
        );

        
    }


    return reservation;
};



// REZERVASYON OLUŞTUR
// burda amacımız :createReservation içindeki bütün DB işlemlerinin aynı tx üzerinden çalışması.


const createReservation = async (reservationData) => {

    const {
        userId,
        eventId,
        seatId
    } = reservationData;

    return await prisma.$transaction(async (tx) => {

        const user =
            await repositories.findUserById(userId, tx);

        if (!user) {
            throw new AppError("Kullanıcı bulunamadı", 404);
        }


        const event =
            await repositories.findEventById(eventId, tx);

        if (!event) {
            throw new AppError("Etkinlik bulunamadı", 404);
        }


        const seat =
            await repositories.findSeatForUpdate(seatId, tx);

        if (!seat) {
            throw new AppError("Koltuk bulunamadı", 404);
        }


        if (seat.venueId !== event.venueId) {
            throw new AppError(
                "Bu koltuk bu etkinliğin mekanına ait değil",
                400
            );
        }


        const existingReservation =
            await repositories.findActiveReservationByEventAndSeat(
                eventId,
                seatId,
                tx
            );

        if (existingReservation) {
            throw new AppError(
                "Bu koltuk bu etkinlik için zaten rezerve edilmiş",
                409
            );
        }


        const newReservation =
            await repositories.createReservation(
                {
                    userId,
                    eventId,
                    seatId,
                    status: "PENDING"
                },
                tx
            );


        return newReservation;
    });
};


// REZERVASYONU İPTAL ET


const cancelReservation = async (id, user) => {

    const reservation =
        await repositories.getReservationById(id);


    if (!reservation) {

        throw new AppError("Rezervasyon bulunamadı",404);
     
    }


    // ADMIN istediği rezervasyonu iptal edebilir
    if (
        user.role !== "admin" &&
        reservation.userId !== user.id
    ) {

        throw new AppError(
            "Bu rezervasyonu iptal etme yetkiniz yok",403
        );

       
    }


    // Zaten iptal edilmişse
    if (reservation.status === "CANCELLED") {

        throw new AppError(
            "Bu rezervasyon zaten iptal edilmiş",400
        );

       
    }


    const cancelledReservation =
        await repositories.cancelReservation(id);


    return cancelledReservation;
};



// REZERVASYONU SİL


const deleteReservation = async (id, user) => {

    const reservation =
        await repositories.getReservationById(id);


    if (!reservation) {

        throw new AppError("Rezervasyon bulunamadı",404);
       
    }


    // ADMIN silebilir
    // USER sadece kendi rezervasyonunu silebilir
    if (
        user.role !== "admin" &&
        reservation.userId !== user.id
    ) {

        throw new AppError(
            "Bu rezervasyonu silme yetkiniz yok",403
        );

   
    }


    const deletedReservation =
        await repositories.deleteReservation(id);


    return deletedReservation;
};


module.exports = {

    getReservations,
    getReservationById,
    createReservation,
    cancelReservation,
    deleteReservation

};


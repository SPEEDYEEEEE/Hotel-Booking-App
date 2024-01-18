import express, {Request, Response} from 'express';
import verifyToken from '../middleware/auth';
import Hotel, { HotelType } from '../models/hotel';

const router = express.Router();

router.get("/", verifyToken, async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find({
            bookings: {$elemMatch: {userId: req.userId}}
        });

        const results = hotels.map((hotel) => {
            const userBooking = hotel.booking.filter((booking) => booking.userId === req.userId);

            const hotelWithUserBookings: HotelType = {
                ...hotel.toObject(),
                booking: userBooking,
            };

            return hotelWithUserBookings;
        });

        res.status(200).send(results);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Unable to fetch booking (backend)"})
    }
});

export default router;


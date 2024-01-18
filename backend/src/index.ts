import express, {Request, Response} from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import cookieParser from 'cookie-parser';
import path from 'path';
import {v2 as cloudinary} from 'cloudinary';
import myHotelsRoutes from './routes/my-hotels';
import hotelRoutes from './routes/hotels';
import bookingRoutes from './routes/my-bookings';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// const mongoDBUri = process.env.NODE_ENV === 'e2e' ? process.env.MONGO_DB : process.env.MONGO_DB;

// mongoose.connect(mongoDBUri as string).then(() => console.log(`Connected to: ${process.env.NODE_ENV === 'e2e' ? 'e2e' : 'hotel booking'} db`));

mongoose.connect(process.env.MONGO_DB as string).then(()=> console.log("Connected to database: ", process.env.MONGO_DB));

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
//the process of connecting frontend and backend in one server like this is for deployment so we can igonore it for now.
//to run frontend in backend, but this one is to access static end points.
app.use(express.static(path.join(__dirname, "../../frontend/hotel-booking/dist")));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-hotels", myHotelsRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/my-bookings", bookingRoutes);

//to run frontend in backend, but this one is not static, these routes have some conditional logics in them.
app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../../frontend/hotel-booking/dist/index.html"))
})


app.listen(3000, () => {
    console.log("server is running on localhost: 3000");
});


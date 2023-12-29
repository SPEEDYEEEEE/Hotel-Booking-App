import express, {Request, Response} from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import cookieParser from 'cookie-parser';
import path from 'path';


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
//to run frontend in backend
app.use(express.static(path.join(__dirname, "../../frontend/hotel-booking/dist")));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(3000, () => {
    console.log("server is running on localhost: 3000");
});


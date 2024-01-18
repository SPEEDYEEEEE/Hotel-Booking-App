import express, {Request, Response} from "express";
import multer from "multer";
import cloudinary from 'cloudinary';
import Hotel, { HotelType } from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";

//making router which express handle
const router = express.Router();
//telling multer what we are going to
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 //5MB
    }
});

const validator = [
    body("name").notEmpty().withMessage('Name is required'),
    body("city").notEmpty().withMessage('City is required'),
    body("country").notEmpty().withMessage('Country is required'),
    body("description").notEmpty().withMessage('Description is required'),
    body("type").notEmpty().withMessage('Hotel type is required'),
    body("pricePerNight").notEmpty().isNumeric().withMessage('Price per Night is required and must be a number'),
    body("facilities").notEmpty().isArray().withMessage('Facilities are required'),
]

// api/my-hotels , verifyToken added there so only logged in user can access this endpoint
router.post("/", validator, verifyToken, upload.array("imageFiles", 6), async(req: Request, res: Response) => {
    try {

        const imageFiles = req.files as Express.Multer.File[];
        const newHotel: HotelType = req.body;

        //1. upload the images to the cloudinary
        const imageUrls = await uploadImages(imageFiles);

        //2. if upload is success, add the URL's to newHotel
        newHotel.imageUrls = imageUrls;
        newHotel.lastUpdated = new Date();
        newHotel.userId = req.userId;

        //3. save the newHotel into the database
        const hotel = new Hotel(newHotel);
        await hotel.save();

        //4. return 201 status
        res.status(201).send(hotel);

    } catch (e) {
        console.log("Error Creating Hotel: ", e);
        res.status(500).json({message: "Something went wrong"});
    }
});

//fetching user hotel
router.get("/", verifyToken, async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find({userId: req.userId});
        res.json(hotels);
    } catch (error) {
        res.status(500).json({message: "Error fetching hotels"})
    }
});

//for editing hotel
router.get("/:id", verifyToken, async(req: Request, res: Response) => {
    // /api/my-hotels/(hotel id)
    const id = req.params.id.toString();

    try {
        const hotel = await Hotel.findOne({
            _id: id,
            userId: req.userId,
        });
        res.json(hotel)
    } catch (error) {
        res.status(500).json({message: "Error fetching hotels"});
    }
}) 

//for updating edit hotels
router.put("/:hotelId", verifyToken, upload.array("imageFiles"), async(req: Request, res: Response) => {
    try {
        const updatedHotel: HotelType = req.body;
        updatedHotel.lastUpdated = new Date();
        const hotel = await Hotel.findOneAndUpdate({
            _id: req.params.hotelId,
            userId: req.userId,
        }, updatedHotel, {new: true});

        if(!hotel){
            return res.status(404).json({message: "Hotel not found"})
        };

        const files = req.files as Express.Multer.File[];
        const updatedImageUrls = await uploadImages(files);

        hotel.imageUrls = [...updatedImageUrls, ...(updatedHotel.imageUrls || [])];

        await hotel.save();
        res.status(201).json(hotel);

    } catch (error) {
        res.status(500).json({message: "Error fetching hotels"});
    }
})

async function uploadImages(imageFiles: Express.Multer.File[]) {
    const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
    });
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
}

export default router;

import express, {Request, Response} from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import {check, validationResult} from 'express-validator';
import verifyToken from '../middleware/auth';

const router = express.Router();

router.get("/me", verifyToken, async(req: Request, res: Response) => {
    const userId = req.userId;

    try {
        const user = await User.findById(userId).select("-password");
        if(!user) {
            return res.status(400).json({message: "User not Found! (backend)"});
        };
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something went Wrong (backend)"})
    }
})

router.post("/register", [
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "Email is required").isString(),
    check("password", "Password with 6 or more character required").isLength({min:6}),
], async (req: Request, res: Response)=> {

    const errors = validationResult(req);
    if (!errors.isEmpty){
        return res.status(400).json({mesaage: errors.array()})
    }

    try {
        let user = await User.findOne({
            email: req.body.email,
        });

        if (user) {
            return res.status(400).json({message: "User Already Exist (backend)"});
        }
        user = new User(req.body);
        await user.save();

        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET_KEY as string, {expiresIn: "1d"});
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000,
        })
        return res.status(200).send({message: "User Registered OK (backend)"});

    } catch (error) {
        console.log(error)
        res.status(500).send({message: "Something went wrong (backend)"})
    }
});

export default router;
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const users_1 = __importDefault(require("./routes/users"));
const auth_1 = __importDefault(require("./routes/auth"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
// const mongoDBUri = process.env.NODE_ENV === 'e2e' ? process.env.MONGO_DB : process.env.MONGO_DB;
// mongoose.connect(mongoDBUri as string).then(() => console.log(`Connected to: ${process.env.NODE_ENV === 'e2e' ? 'e2e' : 'hotel booking'} db`));
mongoose_1.default.connect(process.env.MONGO_DB).then(() => console.log("Connected to database: ", process.env.MONGO_DB));
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
//to run frontend in backend
app.use(express_1.default.static(path_1.default.join(__dirname, "../../frontend/hotel-booking/dist")));
app.use("/api/auth", auth_1.default);
app.use("/api/users", users_1.default);
app.listen(3000, () => {
    console.log("server is running on localhost: 3000");
});

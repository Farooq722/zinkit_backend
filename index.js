const express = require('express'); 
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require('morgan');
const helmet = require("helmet");
const connectDB = require("./mongoose/connectDB");
const router = require('./routes/userRoute');
const cookie = require("cookie-parser");

dotenv.config();

const app = express();

app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL
}));
app.use(express.json());
app.use(morgan());
app.use(helmet({
    crossOriginResourcePolicy: false
}));
app.use(cookie());


const port = 3000 || process.env.PORT;

app.get("/", (req, res) => {
    res.json({
        msg: "base route"
    });
});

app.use("/api/user", router);

app.listen(port, () => console.log(`Port is listening on ${port}`));
connectDB()
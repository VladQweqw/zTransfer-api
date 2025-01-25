const mongoose = require('mongoose');
const express = require('express')

const roomRouter = require("./routes/roomRoute")
const fileRouter = require("./routes/filesRoute")
const userRouter = require("./routes/usersRoute")

const body_parser = require('body-parser')
const cors = require('cors')
const dbURI = "mongodb+srv://vladpoienariu:admin123@lists.5vhezvm.mongodb.net/zTransfer?retryWrites=true&w=majority&appName=lists";

const app = express()
const PORT = 3003
const domain = '192.168.1.69'

mongoose.connect(dbURI)
.then((result) => {
    app.listen(PORT)

    console.log(`Succesfully connected to DB`);
    console.log(`Server started at http://${domain}:${PORT}`);
})
.catch((err) => {
    console.log(`Error while connecting to DB: ${err}`);
})

const allowedOrigins = [
    `${domain}:3000`,
];

const corsOptions = {
    origin: allowedOrigins,
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    optionsSuccessStatus: 200, // For legacy browser support
    methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE', // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
};


app.use("/public/files", express.static('public/files'))
app.use(cors(corsOptions))

app.use(express.json())
app.use(body_parser.json())

app.use("/rooms", roomRouter);
app.use("/users", userRouter);
app.use("/files", fileRouter);



// imports
import express from "express";
import mongoose from "mongoose";
import Pusher from "pusher";
import cors from "cors";
import mongoData from "./mongoData.js";
// app config
const app = express();
const port = process.env.PORT || 9001;


// middleware

app.use(cors());
app.use(express.json());


// db config
const mongoURI = '';

mongoose.connect(mongoURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

// api routes

app.get('/', ((req, res) => res.status(200).send("Backend is working on 🚀")));

// listen

app.listen(port, () => console.log(`listening on port ${port}`));

// dMyibLWe2RBAco9K
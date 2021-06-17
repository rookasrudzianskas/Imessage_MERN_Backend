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
const mongoURI = 'mongodb+srv://admin:dMyibLWe2RBAco9K@cluster0.xsfbs.mongodb.net/imessagebackend?retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
    console.log("DB is connected 🚀");
})

// api routes

app.get('/', ((req, res) => res.status(200).send("Backend is working on 🚀")));

app.post('/new/conversation', (req, res) => {
    const dbData = req.body;

    mongoData.create(dbData, (err, data) => {
        if(err) {
            res.status(300).send(err);
        } else {
            res.status(201).send(data);
        }
    })
})

// listen

app.listen(port, () => console.log(`listening on port ${port}`));

// dMyibLWe2RBAco9K
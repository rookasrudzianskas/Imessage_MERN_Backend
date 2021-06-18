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
const mongoURI = 'mongodb+srv://admin:2J1PnFeDCSqQ2wrn@cluster0.xsfbs.mongodb.net/imessagebackend?retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

mongoose.connection.once('open', () => {
    console.log("DB CONNECTION");

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

app.post('/new/message', (req, res) => {
    mongoData.update(
        // id as the query, to which conversation
        // and then push everything to that conversation the body
        { _id: req.query.id },
        {$push: {conversation: req.body }},
        (err, data) => {
            if(err) {
                console.log('Error saving the message');
                console.log(err);

                res.status(500).send(err);
            } else {
                res.status(201).send(data);
            }
        }
    )
})

app.get('/get/conversationList', (req, res) => {
    mongoData.find((err, data) => {
        if(err) {
            res.status(500).send(err);
        } else {
            data.sort((b, a) => {
                return a.timestamp - b.timestamp;
            });

            let conversations = [];

            data.map((conversationData) => {
                const conversationInfo = {
                    id: conversationData._id,
                    name: conversationData.chatName,
                    timestamp: conversationData.conversation[0].timestamp
                }
            })
        }
    })
})

// listen

app.listen(port, () => console.log(`listening on port ${port} 🚀`));

// password
// dMyibLWe2RBAco9K
// working
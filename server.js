// imports
import express from "express";
import mongoose from "mongoose";
import Pusher from "pusher";
import cors from "cors";
import mongoData from "./mongoData.js";


// app config
const app = express();
const port = process.env.PORT || 9001;

const pusher = new Pusher({
    appId: "1222640",
    key: "117ff3ca7fcf393a58b3",
    secret: "4d8aaf26f37d86af710d",
    cluster: "eu",
    useTLS: true
});


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

    const changeStream = mongoose.connection.collection('conversations').watch();

    changeStream.on('change', (change) => {
        if(change.operationType === 'insert') {
            pusher.trigger('chats', 'newChat', {
                'change': change
            })
        } else if(change.operationType === 'update') {
            pusher.trigger('messages', 'newMessage', {
                'change': change
                })
            } else {
            console.log('error trigerring pusher');
        }
        })
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
            // sorting out
            data.sort((b, a) => {
                return a.timestamp - b.timestamp;
            });

            let conversations = [];

            // forming what comes back
            data.map((conversationData) => {
                const conversationInfo = {
                    id: conversationData._id,
                    name: conversationData.chatName,
                    timestamp: conversationData.conversation[0].timestamp
                }

                // writing to the array

                conversations.push(conversationInfo);
            })

            // sending back
            res.status(200).send(conversations);
        }
    })
})


// her we get all the conversations

app.get('/get/conversation', (req, res) => {
    const id = req.query.id;

    mongoData.find({ _id: id}, (err, data) => {
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    })
})

app.get('/get/lastMessage', (req, res) => {
    const id = req.query.id;

    // should get messages by the id

    mongoData.find({ _id: id }, (err, data) => {
        if(err) {
            res.status(500).send(err);
        } else {
            let convData = data[0].conversation;

            convData.sort((b, a) => {
                return a.timestamp - b.timestamp;
            });

            // sorted data, and we send just the last message, not all of them.
            // the last message
            // does not work
            // fixed
            // connecting backend to front end
            res.status(200).send(convData[0]);
        }
    })
})

// listen

app.listen(port, () => console.log(`listening on port ${port} 🚀`));

// password
// dMyibLWe2RBAco9K
// working
// does work
// fixed
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

//
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ju3nh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        await client.connect;
        const tasksCollection = client.db("upkeep").collection("tasks");
        console.log("db connected");
    } finally {
    }
}

app.get("/", (req, res) => {
    res.send("hello");
});

app.listen(port, () => {
    console.log("server running at port", port);
});

run().catch(console.dir);

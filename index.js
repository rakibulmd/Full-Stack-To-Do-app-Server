const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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
        await client.connect();
        const tasksCollection = client.db("upkeep").collection("tasks");
        console.log("db connected");

        //add  task
        app.post("/addTask", async (req, res) => {
            const doc = req.body;
            console.log(doc);
            const result = await tasksCollection.insertOne(doc);
            res.status(200).send(result);
        });

        //get task
        app.get("/myTasks", async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = tasksCollection.find(query);
            const tasks = await result.toArray();
            res.status(200).send(tasks);
        });

        //delete task
        app.delete("/myTasks/:id", async (req, res) => {
            const id = req.params.id;
            try {
                const query = { _id: ObjectId(id) };
                const result = await tasksCollection.deleteOne(query);
                res.status(200).send(result);
            } catch (error) {
                return res.status(400).send({ message: "Bad Request" });
            }
        });

        //complete task
        app.put("/myTasks/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id);
            try {
                const filter = { _id: ObjectId(id) };
                const options = { upsert: true };
                const updateDoc = {
                    $set: {
                        status: "completed",
                    },
                };
                const result = await tasksCollection.updateOne(
                    filter,
                    updateDoc,
                    options
                );
                res.send(result);
            } catch (error) {
                return res.status(400).send({ message: "Bad Request" });
            }
        });
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

const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.nte7g.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    await client.connect();
    const usersCollection = client.db("userProfile").collection("user");
    const projectCollection = client.db("userProfile").collection("projects");
    try {
        app.get('/users', async (req, res) => {
            const users = await usersCollection.find().toArray()
            res.send(users)
        })


        app.put('/users/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email }
            const options = { upsert: true }
            const updatedDoc = {
                $set: user,
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, options)
            res.send({ result })
        })


        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await usersCollection.findOne(query)
            res.send(result);
        })


        app.get('/projects/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await projectCollection.find(query).toArray()
            res.send(result);
        })

        app.post('/projects', async (req, res) => {
            const pro = req.body;
            const result = await projectCollection.insertOne(pro)
            res.send(result)
        })

        app.get('/projects', async (req, res) => {
            const query = {};
            const result = await projectCollection.find(query).toArray();
            res.send(result);
        })

    }
    finally {
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
require("dotenv").config();
const express = require('express');
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;




// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Look MaMa!')
});


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jszmv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const itemCollection = client.db("metalToolsHouse").collection("tools");
        const reviewCollection = client.db("sportSwear").collection("review");
        app.get('/tools', async(req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const tool = await cursor.toArray();
            res.send(tool);
        })

          // Loading all the rivews
          app.get('/review', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray();
            res.send(review);
        })

        //storing reviews to the database
        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.json(result);
        });

    }
    finally {
        //   await client.close();  
    }
}

run().catch(console.dir);
app.listen(port, () => {
    console.log('Listening to port', port);
})
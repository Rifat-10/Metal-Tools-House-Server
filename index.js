require("dotenv").config();
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;


const app = express();

app.get('/', (req, res) => {
    res.send('Look MaMa!')
});


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jszmv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const itemCollection = client.db("metalToolsHouse").collection("tools");

        app.get('/tools', async(req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const tools = await cursor.toArray();
            res.send(tools);
        })

    }
    finally {
        //   await client.close();  
    }
}

run().catch(console.dir);
app.listen(port, () => {
    console.log('Listening to port', port);
})
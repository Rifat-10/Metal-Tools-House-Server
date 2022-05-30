require("dotenv").config();
const express = require('express');
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;



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
    const orderCollection = client.db("metalToolsHouse").collection("order");
    const profileCollection = client.db("metalToolsHouse").collection("profile")
    app.get('/tools', async (req, res) => {
      const query = {};
      const cursor = itemCollection.find(query);
      const tool = await cursor.toArray();
      res.send(tool);
    })
    app.get("/tools/:id", async (req, res) => {
      const toolId = req.params.id;
      const query = { _id: ObjectId(toolId) };
      const tool = await itemCollection.findOne(query);
      res.send(tool);
    });

    app.post("/order", async (req, res) => {
      const placeOrder = req.body;
      const theOrder = await orderCollection.insertOne(placeOrder);
      res.send(theOrder);
    });

    app.get("/myOrders", async (req, res) => {
      const email = req.query.userEmail;
      if (email) {
        const query = { userEmail: email };
        const cursor = orderCollection.find(query);
        const products = await cursor.toArray();
        res.send(products);
      }
    });
    app.delete("/myOrders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/myOrders/:id", async (req, res) => {
      const myOrderId = req.params.id;
      const query = { _id: ObjectId(myOrderId) };
      const myOrder = await orderCollection.findOne(query);
      res.send(myOrder);
    });
    app.get("/orders/:email", async (req, res) => {
      const myEmail = req.params.email;
      const query = { userEmail:myEmail };
      const myOrder = await orderCollection.findOne(query);
      res.send(myOrder);
    });

    app.post("/create-payment-intent", async (req, res) => {
      const product = req.body;
      const payable = product.orderPayable;
      const payableAmount = payable * 100;
      // console.log(product, payable, payableAmount);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: payableAmount,
        currency: "usd",
        payment_method_types: ["card"],
      });

      res.send({ clientSecret: paymentIntent.client_secret });
    });

    app.put("/order/:id", async (req, res) => {
      const id = req.params.id;
      const myTransection = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const myTransectionId = myTransection.transectionId;
      const updateDoc = {
        $set: {
          orderStatus: "pending",
          transactionId: myTransectionId,
        },
      };

      const result = await orderCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });

    app.get("/myProfile/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const query = { email: email };
      const myProfile = await profileCollection.findOne(query);
      console.log(myProfile);
      res.send(myProfile);
    });

    app.put("/profile/:email", async (req, res) => {
      const myEmail = req.params.email;
      const currentProfile = req.body;
      const query = { email: myEmail };
      const options = { upsert: true };
      const updateDoc = {
        $set: currentProfile,
      };

      const result = await profileCollection.updateOne(
        query,
        updateDoc,
        options
      );

      res.send(result);
    });

    app.put("/myProfile/:email", async (req, res) => {
      const myEmail = req.params.email;
      const currentProfile = req.body;
      const query = { email: myEmail };
      const options = { upsert: true };
      console.log(currentProfile);
      const updateDoc = {
        $set: currentProfile,
      };

      const result = await profileCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });

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

    app.post("/tools", async (req, res) => {
      const theTool = req.body;
      const tool = await itemCollection.insertOne(theTool);
      res.send(tool);
    });

    app.delete("/tool/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await itemCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/orders", async (req, res) => {
      const query = {};
      const cursor = orderCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    });

    app.put("/shippedOrder/:id", async (req, res) => {
      const id = req.params.id;
      const status = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const newOrderStatus = status.orderStatus;
      const updateDoc = {
        $set: {
          orderStatus: newOrderStatus,
        },
      };

      const result = await orderCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });

    app.get("/profiles", async (req, res) => {
      const query = {};
      const cursor = profileCollection.find(query);
      const profiles = await cursor.toArray();
      res.send(profiles);
    });

    app.put("/makeAdmin/:id", async (req, res) => {
      const id = req.params.id;
      const accessLevel = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const newAccessLevel = accessLevel.access;
      const updateDoc = {
        $set: {
          access: newAccessLevel,
        },
      };

      const result = await profileCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
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
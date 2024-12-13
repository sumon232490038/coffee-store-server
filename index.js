const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.xhl2h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const database = client.db("coffeeBD");
    const coffeeDatabase = database.collection("coffee");

    app.get("/coffee", async (req, res) => {
      const find = coffeeDatabase.find();
      const result = await find.toArray();
      res.send(result);
      console.log(result);
    });

    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeDatabase.findOne(query);
      res.send(result);
    });

    app.post("/addCoffee", async (req, res) => {
      const coffee = req.body;
      // console.log(coffee);
      const result = await coffeeDatabase.insertOne(coffee);
      res.send(result);
    });

    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeDatabase.deleteOne(query);
      res.send(result);
      console.log(result);
    });

    app.put("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const coffee = req.body;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCoffee = {
        $set: {
          name: coffee.name,
          chef: coffee.chef,
          details: coffee.details,
          supplier: coffee.supplier,
          price: coffee.price,
          photo: coffee.photo,
          category: coffee.category,
        },
      };
      const result = await coffeeDatabase.updateOne(
        query,
        updateCoffee,
        options
      );
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Yes the coffee shop server is runing in Port:${port}`);
});

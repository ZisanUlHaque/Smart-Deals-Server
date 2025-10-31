const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://smartdbuser:Ijc01JYkLsF5KADn@cluster0.ifwcykr.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("smart_db");
    const productCollection = db.collection("products");

    //add
    app.post("/products", async (req, res) => {
      try {
        const newProduct = req.body;
        const result = await productCollection.insertOne(newProduct);
        res.send(result);
      } catch (error) {
        console.error("Error inserting product:", error);
        res.status(500).send({ message: "Database insert failed" });
      }
    });

    //find all
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //find one
    app.get("/products/:id", async (req, res) => {
       const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result)
    });

    //update
    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updateProduct = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          name: updateProduct.name,
          price: updateProduct.price,
        },
      };
      const result = await productCollection.updateOne(query, update);
      res.send(result);
    });

    //delete
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });

    // ✅ Confirm connection
    await db.command({ ping: 1 });
    console.log(" Successfully connected to MongoDB!");
  } catch (err) {
    console.error(" MongoDB Connection Error:", err);
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Smart Deal server is running!");
});

app.listen(port, () => {
  console.log(` Smart Deal running on port ${port}`);
});

const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

//pass: 9kUHozntRg97cr2K
// user: whbuser




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rri1t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
          try {
                    await client.connect();
                    const itemCollection = client.db('warehouse').collection('item');

                    //get item from mongodb
                    app.get('/item', async (req, res) => {
                              const query = {};
                              const cursor = itemCollection.find(query);
                              const items = await cursor.toArray();
                              res.send(items);
                    });


                    //Individual Item
                    app.get('/item/:id', async (req, res) => {
                              const id = req.params.id;
                              const query = { _id: ObjectId(id) };
                              const item = await itemCollection.findOne(query);
                              res.send(item);
                    });

                    //POST Item
                    app.post('/item', async (req, res) => {
                              const newItem = req.body;
                              const result = await itemCollection.insertOne(newItem);
                              res.send(result);
                    });


                    //Delete Item
                    app.delete('/item/:id', async (req, res) => {
                              const id = req.params.id;
                              const query = { _id: ObjectId(id) };
                              const result = await itemCollection.deleteOne(query);
                              res.send(result);
                    });

                    //update 
                    app.put('/item/:id', async (req, res) => {
                              const id = req.params.id;
                              const newQuantity = req.body;
                              const filter = { _id: ObjectId(id) };
                              const options = { upsert: true };

                              const updateDoc = {
                                        $set: {
                                                  quantity: newQuantity.result
                                        },
                              };
                              const result = await itemCollection.updateOne(filter, updateDoc, options)
                              res.send(result);
                    });


          }
          finally {

          }
}
run().catch(console.dir);



app.get('/', (req, res) => {
          res.send('Running Warehouse Server');
});

app.listen(port, () => {
          console.log('Listening to port', port);
})

/******************
Dependencies 
*******************/

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const { PORT = 3000, MONGODB_URL } = process.env;

/******************
DB Connection
*******************/

mongoose.connect(MONGODB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

// Connection Events
mongoose.connection
  .on("open", () => console.log("You are connected to mongoose"))
  .on("close", () => console.log("You are disconnected from mongoose"))
  .on("error", (error) => console.log(error));

/******************
Cheese Model
*******************/

const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String
});

const Cheese = mongoose.model("Cheese", CheeseSchema);

/******************
Middleware 
*******************/
const app = express();

app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies

/******************
Routes
*******************/

app.get("/", (req, res) => {
  res.send("hello world");
});

//Index Route
app.get("/cheese", async (req,res) => {
  try {
    res.json(await Cheese.find({}));
  } catch (error) {
    res.status(400).json(error);
  }
})

//Delete Route
app.delete("/cheese/:id", async (req,res) => {
  try {
    res.json(await Cheese.findByIdAndRemove(req.params.id));
  } catch(error) {
    res.status(400).json(error);
  }
})

//Update Route
app.put("/cheese/:id", async (req,res) => {
  try{
    res.json(await Cheese.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch(error) {
    res.status(400).json(error);
  }
})

//Create Route
app.post("/cheese", async (req,res) => {
  try {
    res.json(await Cheese.create(req.body));
  } catch(error) {
    res.status(400).json(error);
  }
})

//Show Route
app.get("/cheese/:id", async (req, res) => {
  try {
    res.json(await Cheese.findById(req.params.id));
  } catch(error){
    res.status(400).json(error);
  }
})

/******************
Listener
*******************/

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));

////////////////////////////////
// import dependencies
////////////////////////////////

require("dotenv").config();
const {PORT = 8000, DATABASE_URL} = process.env

////////////////////////////////
// import express
////////////////////////////////

const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")  // cors for preventing cors errors (allows all requests from other origins)
const morgan = require("morgan")

////////////////////////////////
// database connection
////////////////////////////////
// Establish a connection

mongoose.connect(DATABASE_URL)

////////////////////////////////
//connection events
////////////////////////////////

mongoose.connection
.on("open", () => console.log("You're connected to mongoose"))
.on("close", () => console.log("You're disconnected from mongoose"))
.on("error", () => console.log("mongoose error"))

////////////////////////////////
// models
////////////////////////////////

const peopleSchema = new mongoose.Schema({
    name: String,
    Image: String,
    title: String
})

const People = mongoose.model("People", peopleSchema)

////////////////////////////////
// MIDDLEWARE 
////////////////////////////////

app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

////////////////////////////////
//ROUTES
////////////////////////////////
// INDEX - GET - /people - gets all people
app.get("/people", async (req, res) => {
    try {
      // fetch all people from database
      const people = await People.find({});
      // send json of all people
      res.json(people);
    } catch (error) {
      // send error as JSON
      res.status(400).json({ error });
    }
  });

  // Create - post - /people - create a new person

  app.post("/people", async (req ,res ) => {
    try {
        const person = await People.create(req.body)
        res.json(person);
    } catch (error) {
        res.status(400).json({error})
    }
  })

app.get("/", (req, res) =>{
    res.json({hello: "world"})
})

////////////////////////////////
// SHOW - GET - /people/:id - get a single person
////////////////////////////////

app.get("/people/:id", async (req, res) => {
    try {
      // get a person from the database
      const person = await People.findById(req.params.id);
      // return the person as json
      res.json(person);
    } catch (error) {
      res.status(400).json({ error });
    }
  });

////////////////////////////////
// UPDATE - PUT - /people/:id - update a single person
////////////////////////////////

app.put("/people/:id", async (req, res) => {
    try {
      // update the person
      const person = await People.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      // send the updated person as json
      res.json(person);
    } catch (error) {
      res.status(400).json({ error });
    }
  });

app.delete("/people/:id", async (req, res) => {
    try{
        const people = await People.findByIdAndDelete(req.params.id);
        res.status(204).json(people);
    } catch (error) {
        res.status(400).json({ error });
    }
})

////////////////////////////////
// Listener route
////////////////////////////////

app.listen(PORT, () => console.log(`listening on ${PORT}`))
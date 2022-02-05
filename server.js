///////////////////////////////
// DEPENDENCIES
////////////////////////////////
// get .env variables
require("dotenv").config()
// pull PORT from .env, give default value of 3001
// pull DATABASE_URL from .env
const { PORT = 3001, DATABASE_URL } = process.env
// import express
const express = require("express")
// create application object
const app = express()
// import mongoose
const mongoose = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")
const Expense = require("./models/expense")

///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////
// Establish Connection
mongoose.connect(DATABASE_URL)
// Connection Events
mongoose.connection
    .on("open", () => console.log("You are connected to MongoDB"))
    .on("close", () => console.log("You are disconnected from MongoDB"))
    .on("error", (error) => console.log(error))




// const PeopleSchema = new mongoose.Schema({
//     name: String,
//     image: String,
//     title: String,
// })

// const People = mongoose.model("People", PeopleSchema)

///////////////////////////////
// MiddleWare
////////////////////////////////
app.use(cors()) // to prevent cors errors, open access to all origins
app.use(morgan("dev")) // logging
app.use(express.json()) // parse json bodies


const admin = require('firebase-admin');
const serviceAccount = require('./service-account-credentials.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})
async function isAuthenticated(req, res, next) {
    try {
        const token = req.get('Authorization');
        if (!token) throw new Error('No token found, please login');
        const user = await admin.auth().verifyIdToken(token.replace('Bearer ', ''));
        if (!user) throw new Error('Something went wrong, invalid token');
        req.user = user;
        next();
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}



///////////////////////////////
// ROUTES
////////////////////////////////
// create a test route
app.get("/", (req, res) => {
    res.send("hello world")
})

app.get('/expense', isAuthenticated, async (req, res) => {
    try {
        res.json(await Expense.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
})


app.post('/expense', isAuthenticated, async (req, res) => {
    console.log(req.body)
        try {
            res.json(await Expense.create(req.body))
        } catch (error) {
            res.status(400).json(error)
        }
    })
    

// Transaction DELETE ROUTE
app.delete("/expense/:id", isAuthenticated, async (req, res) => {
    try {
        res.json(await Expense.findByIdAndDelete(req.params.id))
    } catch (error) {
        //send error
        res.status(400).json(error)
    }
})

// Transactions UPDATE ROUTE
app.put("/expense/:id", isAuthenticated, async (req, res) => {
    try {
        // send all transactions
        res.json(
            await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true })
        )
    } catch (error) {
        //send error
        res.status(400).json(error)
    }
})

////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`))
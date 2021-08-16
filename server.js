const express = require("express");
const cors = require("cors");
const knex = require("knex");
const bcrypt = require("bcrypt");
require("dotenv").config();

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const order = require('./controllers/order');
const delivery  = require("./controllers/delivery");
const admin = require('./controllers/admin')

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
});

const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const port = 3000;

app.get("/", (req, res) => res.json("orders api "));

// ------------------- SignIn & Register ----------------------------
app.put("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});
app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

// -------------------------- PLACE ORDER --------------------------------
app.post('/placeOrder/:customerId',(req,res)=>{
   order.placeOrder(req,res,db,bcrypt)
})

// ---------------------------- UPDATING STATUS --------------------------
app.post('/updateStatus/:orderId',(req,res)=>{
    delivery.updateStatus(req,res,db)
})

// ------------------------------ ASSIGN DELIVERY PERSON ----------------------------- 
app.post('/assignDelivery/:orderId/:deliveryId',(req,res)=>{
    admin.assignDelivery(req,res,db)
})

app.listen( port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


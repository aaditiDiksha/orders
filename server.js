const express = require("express");
const cors = require("cors");
const knex = require("knex");
const bcrypt = require("bcrypt");
require("dotenv").config();

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const policySubmission = require('./controllers/policySubmission');
const  employee  = require("./controllers/employee");
const updateFromEmp = require('./controllers/updateFromEmp')

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

app.get("/", (req, res) => res.json("policy api "));

app.put("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});
app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});
app.post('/submit/:userid/:type',(req,res)=>{
    policySubmission.submitPolicy(req,res,db,bcrypt)
})
app.post('/employee/login',(req,res)=>{
    employee.login(req,res,db)
})

app.post('/employee/update/:insurance_id',(req,res)=>{
    updateFromEmp.updateTables(req,res,db)
})

app.get('/employee/getTicketData/:insurance_id',(req,res)=>{
    employee.getTicketData(req,res,db)
})

app.listen( port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

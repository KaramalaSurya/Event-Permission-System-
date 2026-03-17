const Request = require("./models/Request");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/campus")
.then(()=>console.log("MongoDB Connected"));

app.listen(5000, ()=>console.log("Server running on port 5000"));

// TEST ROUTE
app.get("/", (req,res)=>{
  res.send("Backend working");
});

// PROFESSOR LOGIN
app.post("/prof-login", (req,res)=>{
  const pin = req.body.pin;

  if(pin === "1001"){
    res.json({status:"success"});
  } else {
    res.json({status:"fail"});
  }
});

// STORE REQUESTS
let requests = [];

// GET ALL REQUESTS
app.get("/requests", async (req, res) => {
  const data = await Request.find();
  res.json(data);
});

// ADD REQUEST
app.post("/request", async (req, res) => {
  const { name, pin } = req.body;

  const newRequest = new Request({
    name,
    pin
  });

  await newRequest.save();

  res.json({ status: "requested" });
});

app.put("/approve/:id", async (req, res) => {
  console.log("APPROVE HIT:", req.params.id);  // 👈 MUST PRINT

  await Request.findByIdAndUpdate(req.params.id, {
    status: "approved"
  });

  res.json({ status: "approved" });
});

app.put("/reject/:id", async (req, res) => {
  const id = req.params.id;

  await Request.findByIdAndUpdate(id, {
    status: "rejected"
  });

  res.json({ status: "rejected" });
});
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Request = require("./models/Request");
const students = require("./data/students");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/campus")
.then(()=>console.log("MongoDB Connected"));

app.listen(5000, ()=>console.log("Server running on port 5000"));

// LOGIN
app.post("/prof-login", (req,res)=>{
  const pin = req.body.pin;
  if(pin === "1001") res.json({status:"success"});
  else res.json({status:"fail"});
});

// FIND STUDENT
function findStudentByRoll(roll) {
  for (let section in students) {
    const student = students[section].find(
      s => s.roll.trim() === roll.trim()
    );
    if (student) {
      return {
        name: student.name,
        section: section.replace("_SECTION", "").trim().toUpperCase()
      };
    }
  }
  return null;
}

// GET STUDENT
app.get("/student/:roll", (req, res) => {
  const student = findStudentByRoll(req.params.roll);
  if (!student) return res.json({ status: "invalid" });

  res.json({
    status: "found",
    name: student.name,
    section: student.section
  });
});

// GET REQUESTS
app.get("/requests", async (req, res) => {
  const data = await Request.find();
  res.json(data);
});

// ADD REQUEST
app.post("/request", async (req, res) => {

  const { pin, reason, fromPeriod, toPeriod } = req.body;

  const student = findStudentByRoll(pin);
  if (!student) return res.json({ status: "invalid" });

  const newRequest = new Request({
    name: student.name,
    pin,
    section: student.section,
    reason,
    fromPeriod,
    toPeriod,
    status: "pending"
  });

  await newRequest.save();
  res.json({ status: "requested" });
});

// ✅ APPROVE → 5 MIN TEST EXPIRY
/*app.put("/approve/:id", async (req, res) => {

  const expiryTime = new Date();
  expiryTime.setMinutes(expiryTime.getMinutes() + 5); // 🔥 5 MIN TEST

  await Request.findByIdAndUpdate(req.params.id, {
    status: "approved",
    expiryTime
  });

  console.log("Approved → expires in 5 min");

  res.json({ status: "approved" });
});

// ✅ REJECT → DELETE
app.put("/reject/:id", async (req, res) => {

  await Request.findByIdAndDelete(req.params.id);

  console.log("Rejected & deleted");

  res.json({ status: "deleted" });
});

// 🔥 AUTO DELETE EXPIRED (FAST FOR TEST)
setInterval(async () => {

  const now = new Date();

  const all = await Request.find({ status: "approved" });

  for (let r of all) {
    if (r.expiryTime && now > new Date(r.expiryTime)) {
      await Request.findByIdAndDelete(r._id);
      console.log("Expired removed:", r.name);
    }
  }

}, 5000); // every 5 sec*/
app.put("/approve/:id", async (req, res) => {

  const request = await Request.findById(req.params.id);

  if (!request) {
    return res.json({ status: "not found" });
  }

  const periodTimes = {
    1: "09:10",
    2: "10:10",
    3: "11:10",
    4: "12:10",
    5: "13:00",
    6: "14:00",
    7: "15:00",
    8: "16:00"
  };

  const endTime = periodTimes[request.toPeriod];

  if (!endTime) {
    return res.json({ status: "invalid period" });
  }

  const [hour, minute] = endTime.split(":");

  const expiryTime = new Date();
  expiryTime.setHours(Number(hour), Number(minute), 0, 0);

  // 🔥 if time already passed → don't allow approval
  if (expiryTime < new Date()) {
    return res.json({ status: "time expired already" });
  }

  await Request.findByIdAndUpdate(req.params.id, {
    status: "approved",
    expiryTime
  });

  res.json({ status: "approved" });
});

const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: String,
  pin: String,
  section: String
});

module.exports = mongoose.model("Student", StudentSchema);
const Permission = require("./models/Permission");

app.post("/request-permission", async(req,res)=>{

  await Permission.create({
    studentId:req.body.studentId,
    status:"PENDING"
  });

  res.json({status:"requested"});
});
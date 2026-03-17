const Student = require("./models/Student");

app.post("/student-login", async(req,res)=>{
  const student = await Student.findOne({pin:req.body.pin});

  if(student){
    res.json({status:"success", student});
  }else{
    res.json({status:"fail"});
  }
});
const Location = require("./models/Location");

app.post("/send-location", async(req,res)=>{

  await Location.findOneAndUpdate(
    {studentId:req.body.studentId},
    {
      lat:req.body.lat,
      lng:req.body.lng,
      lastUpdated:new Date()
    },
    {upsert:true}
  );

  res.json({status:"updated"});
});
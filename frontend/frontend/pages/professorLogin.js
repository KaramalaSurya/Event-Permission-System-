const Professor = require("./models/Professor");

app.post("/prof-login", async(req,res)=>{
  const prof = await Professor.findOne({pin:req.body.pin});

  if(prof){
    res.json({status:"success", prof});
  }else{
    res.json({status:"fail"});
  }
});

/*APPROVE PERMISSION*/
app.post("/approve", async(req,res)=>{

  await Permission.findByIdAndUpdate(req.body.id,{
    status:"APPROVED",
    professorId:req.body.professorId
  });

  res.json({status:"approved"});
});

/*MAP DATA*/
app.get("/map-data", async(req,res)=>{

  const permissions = await Permission.find({status:"APPROVED"});
  let green=0, red=0;
  let students=[];

  for(let p of permissions){

    const loc = await Location.findOne({studentId:p.studentId});

    if(!loc) continue;

    const d = distance(loc.lat, loc.lng, COLLEGE_LAT, COLLEGE_LNG);

    const status = d<=RADIUS ? "GREEN":"RED";

    if(status==="GREEN") green++;
    else red++;

    students.push({
      lat:loc.lat,
      lng:loc.lng,
      status
    });
  }

  res.json({students,green,red});
});cd
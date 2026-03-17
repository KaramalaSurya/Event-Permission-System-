app.put("/reject/:id", async (req, res) => {
  const id = req.params.id;

  await Request.findByIdAndUpdate(id, {
    status: "rejected"
  });

  res.json({ status: "rejected" });
});
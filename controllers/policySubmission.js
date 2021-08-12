const submitPolicy = (req, res, db, bcrypt) => {
  const { userid, type } = req.params;
  const { nominee, insuranceType, gst } = req.body;

  db("insurance")
    .insert({ insurance_type: type, userid: userid })
    .returning("*")
    .then((insurance) => {
        // console.log('insurance is')
        // console.log(insurance)
      db("tickets")
        .insert({
            userid: userid,
          insurance_id: insurance[0].insurance_id,
          status: "submitted",
          comments: "your policy has been submitted",
        })
        .returning("*")
        .then((ticket) => {
            
        // console.log("ticket is");
        // console.log(ticket);
          if (type === "covid") {
            db("covid_insurance")
              .insert({
                insurance_id: insurance[0].insurance_id,
                nominee: nominee,
              })
              .returning("*")
              .then((covid) => {
                  
        // console.log("covid is");
        // console.log(covid);
                res.json({ insurance, ticket });
              })
              .catch((err) => {console.log(err); res.status(400).json(err)});
          } else if (type === "health") {
            db("health_insurance")
              .insert({
                insurance_id: insurance[0].insurance_id,
                nominee: nominee,
                health_insurance_type: insuranceType,
              })
              .returning("*")
              .then((health) => {
                res.json({ insurance, ticket });
              })
              .catch((err) => res.status(400).json(err));
          } else {
            db("gold_insurance")
              .insert({
                insurance_id: insurance[0].insurance_id,
                gst_details: gst,
              })
              .returning("*")
              .then((covid) => {
                res.json({ insurance, ticket });
              })
              .catch((err) => res.status(400).json(err));
          }
        })
        .catch((err) => res.status(400).json(err));
    })
    .catch((err) =>{ 
        console.log(err)
        res.status(400).json(err)});
};
module.exports = {
  submitPolicy,
};

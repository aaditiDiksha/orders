

const updateTables = (req,res,db) =>{
    const{insurance_id} = req.params
    const {issue_date, end_date ,insurance_type, policy_no, status, comments } = req.body  
    
    db("insurance")
      .where("insurance_id", "=", insurance_id)
      .update({
        issue_date: issue_date,
        end_date: end_date,
      })
      .returning("*")
      .then((insurance) => {
        db("tickets")
          .where("insurance_id", "=", insurance[0].insurance_id)
          .update({
            status: status,
            comments: comments,
          })
          .returning("*")
          .then((ticket) => {
            if (insurance_type === "covid") {

                db('covid_insurance')
                .where('insurance_id' , '=' , insurance[0].insurance_id)
                .update({
                    policy_no: policy_no
                })
                .returning('*')
                .then((covid)=>{
                    res.json({insurance, ticket, singleInsurance:covid})
                })
                .catch((err)=>{
                    console.log(err)
                    res.status(404).json(err)
                })

            } else if (insurance_type === "health") {
                db("health_insurance")
                  .where("insurance_id", "=", insurance[0].insurance_id)
                  .update({
                    policy_no: policy_no,
                  })
                  .returning("*")
                  .then((health) => {
                    res.json({ insurance, ticket, singleInsurance : health });
                  })
                  .catch((err) => {
                    console.log(err);
                    res.status(404).json(err);
                  });
            } else {
                 db("gold_insurance")
                   .where("insurance_id", "=", insurance[0].insurance_id)
                   .update({
                     policy_no: policy_no,
                   })
                   .returning("*")
                   .then((gold) => {
                     res.json({ insurance, ticket, singleInsurance: gold });
                   })
                   .catch((err) => {
                     console.log(err);
                     res.status(404).json(err);
                   });
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(404).json(err);
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(404).json(err);
      });

}

module.exports = {
  updateTables
};

const login = (req,res,db) =>{
 
    const {employeeId, password} = req.body
    
  db.select("*")
    .from("employees")
    .where("employee_id", "=", employeeId)
    .then((employee) => {
      if (employee[0].password === password) {
        db.select("*")
          .from("tickets")
          .then((allTickets) => {
            // console.log(allTickets);
            res.json(allTickets);
          })
          .catch((err) => {
            console.log(err);
            res.status(404).json(err);
          });
      } else {
        res.status(404).json("employee does not exist");
      }
    })

    .catch((err) => res.status(404).json("employee does not exist"));


}

const getTicketData = (req,res,db) =>{
console.log('are we getting here')
  const {insurance_id} = req.params;
  db('insurance').select('*')
  .where('insurance_id' , '=', insurance_id)
  .then((insurance)=>{
    // console.log(insurance)
    if(insurance[0].insurance_type === 'covid') {

      db('covid_insurance').select('*')
      .where('insurance_id' , '=' ,insurance[0].insurance_id)
      .then((covid)=>{
        console.log(covid)
        res.json({insurance, policy: covid})
      })
      .catch((err)=>{
        
    console.log(err);
    res.status(404).json(err);
      })

    }
    else if( insurance[0].insurance_type === 'health')
    {

      
      db("health_insurance")
        .select("*")
        .where("insurance_id", "=", insurance[0].insurance_id)
        .then((health) => {
          // console.log(health);
          res.json({ insurance, policy: health });
        })
        .catch((err) => {
          console.log(err);
          res.status(404).json(err);
        });
    }
    else{

      db("gold_insurance")
        .select("*")
        .where("insurance_id", "=", insurance[0].insurance_id)
        .then((gold) => {
          // console.log(gold);
          res.json({ insurance, policy: gold });
        })
        .catch((err) => {
          console.log(err);
          res.status(404).json(err);
        });
    }
  })
  .catch((err)=>{
    console.log(err)
    res.status(404).json(err)
  })
  


}

module.exports = {
  login,
  getTicketData
};

//employee id , name, pwd 

const updateStatus = (req,res,db) =>{
    
  const { orderId} = req.params
    const {current_stage} = req.body
    console.log(orderId)
  db("orders")
    .update({current_stage:current_stage})
    .where("order_id", "=", orderId)
    .returning('current_stage')
    .then((status) => {
      res.json(status)
    })

    .catch((err) => {
      console.log(err)
      res.status(404).json("order does not exist")});


}


module.exports = {
 updateStatus
};

//employee id , name, pwd 
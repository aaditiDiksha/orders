

const assignDelivery = (req,res,db) =>{
    const{orderId,deliveryId} = req.params
    console.log(deliveryId)
     db('orders')
     .update({delivery_id: deliveryId})
     .where('order_id','=',orderId)
     .returning('*')
     .then((order)=>res.json(order))
     .catch((err)=>{ console.log(err);res.status(400).json('err in assigning delivery person')})

}

module.exports = {
  assignDelivery
};
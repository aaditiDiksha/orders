const placeOrder = (req, res, db) => {
  const { customerId } = req.params;
    const { items } = req.body; 
  
  let inc=0, itemArray = [];
  db("orders")
    .insert({ customer_id: customerId })
    .returning("*")
    .then((order) => {
      items.map((item)=>{
        db('ordered_items')
        .insert({name:item.name, category:item.category, shop_address: item.shop_address, order_id:order[0].order_id})
        .returning('*')
        .then((data)=>{
          inc++ 
          itemArray.push(data)
          if(inc === items.length)
          res.json({order,itemArray})
  
        }).catch((err)=>console.log(err))
      })

        })
    .catch((err) =>{ 
        console.log(err)
        res.status(400).json(err)});
};


module.exports = {
  placeOrder
};

const handleRegister = (req, res, db, bcrypt) => {
  const {  name, password, mobile, address} = req.body;
  if (!mobile || !name || !password || !address) {
    return res.status(400).json("empty fields");
  }

  bcrypt.hash(password, 2, (err, hash) => {
    {
      
        db("customers")
        .insert({
          name: name,
          pwdhash: hash,
          mobile_no: mobile,
          address: address
    })
         .returning('*')
         .then((customer)=> res.json('success'))
         .catch((err)=>{
             console.log(err)
             res.status(400).json('err in registering')
         });
    }
  });
};

module.exports = {
  handleRegister,
};


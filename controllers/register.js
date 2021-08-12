const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password, mobile} = req.body;
  if (!email || !name || !password) {
    return res.status(400).json("empty fields");
  }

  bcrypt.hash(password, 2, (err, hash) => {
    {
      
        db("users")
        .insert({
          email: email,
          name: name,
          pwdhash: hash,
          mobile_no: mobile
    })
         .returning('*')
         .then((user)=> res.json('success'))
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


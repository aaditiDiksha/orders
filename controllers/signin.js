const handleSignin = (req, res, db, bcrypt) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return Promise.reject("incorrect form submission");
  }
  db.select("*")
    .from("users")
    .where("email", "=", email)
    .then((user) => {
      bcrypt.compare(password, user[0].pwdhash, function (err, result) {
        // result == true
        if (result) {
            // console.log(user)
          db.select("*")
            .from("insurance")
            .where("userid", "=", user[0].userid)
            .then((insurance) => {        
            if(insurance[0])
            {
              db.select("*")
                .from("tickets")
                .where("userid", "=",user[0].userid)
                .then((tickets) => {
                  res.json({
                    user,
                    insurance,
                    tickets,
                  });
                })
                .catch((err) => {
                  console.log(err);
                  res.json({ user, insurance, tickets });
                });
            }
            else{
              res.json({user:user[0], insurance:[], tickets:[]})
            }
            
            })
            .catch((err) => {
              console.log(err);
              res.json({ user:user, insurance:[], tickets:[] });
            });
        } else {
          res.status(400).json("err");
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json("err");
    });
};

module.exports = {
  handleSignin,
};

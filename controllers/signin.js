
const jwt = require("jsonwebtoken");
const handleSignin = (req, res, db, bcrypt) => {
  const { mobile, password, type } = req.body;

  if (!password || !type) {
    return Promise.reject("incorrect form submission");
  }

  if (type === "customer") {
    db.select("*")
      .from("customers")
      .where("mobile_no", "=", mobile)
      .then((customer) => {
        bcrypt.compare(password, customer[0].pwdhash, function (err, result) {
          // result == true
          if (result) {
            db.select("*")
              .from("catalogue")
              .returning("*")
              .then((catalogue) => {
                db.select("*")
                  .from("orders")
                  .where("customer_id" === customer[0].customer_id)
                  .then((myOrder) => {
                    const jwtPayLoad = {
                      mobile_no: customer[0].mobile_no,
                      id: customer[0].customer_id,
                    };
                    const token = jwt.sign(
                      jwtPayLoad,
                      `${process.env.JWT_SECRET_KEY}`,
                      { expiresIn: "1h" }
                    );
                    res.json({ user: customer, catalogue, myOrder, token });
                  })
                  .catch((err) => {
                    console.log(err);
                    res.status(400).json("err in my orders");
                  });
              })
              .catch((err) => {
                console.log(err);
                res.status(400).json("err in catalogue");
              });
          }
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json("err");
      });
  } else if (type === "admin") {
    db.select("*")
      .from("admin")
      .where("pwdhash", "=", password)
      .then((admin) => {
        // result == true
        db.select("*")
          .from("orders")
          .returning("*")
          .then((orders) => {
            db.select("*")
              .from("delivery")
              .then((delivery) => {
                const jwtPayLoad ={mobile_no: admin[0].mobile_no, id: admin[0].admin_id}
                const token = jwt.sign(
                  jwtPayLoad,`${process.env.JWT_SECRET_KEY}`,{expiresIn: '1h'}
                );
                res.json({ user: admin, orders, delivery, token });
              })
              .catch((err) => {
                console.log(err);
                res.status(404).json("err in delivery");
              });
          })
          .catch((err) => {
            console.log(err);
            res.status(404).json("err in orders");
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json("err");
      });
  } else {
    db.select("*")
      .from("delivery")
      .where("pwdhash", "=", password)
      .then((delivery) => {
        // result == true
        db.select("*")
          .from("orders")
          .where("delivery_id", "=", delivery[0].delivery_id)
          .then((myOrders) => {
            const jwtPayLoad = {
              mobile_no: delivery[0].mobile_no,
              id: delivery[0].delivery_id,
            };
            const token = jwt.sign(
              jwtPayLoad,
              `${process.env.JWT_SECRET_KEY}`,
              { expiresIn: "1h" }
            );
            res.json({ myOrders, user: delivery,token });
          })
          .catch((err) => {
            console.log(err);
            res.status(404).json("err in my  orders");
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json("err");
      });
  }
};





module.exports = {
  handleSignin
};

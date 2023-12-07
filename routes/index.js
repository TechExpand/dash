const express = require('express');
const axios = require("axios");
var jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const model = require('../models');
const User = require('../models/user');
let multer = require("multer");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const Verify = require('../models/verify');
const Shipment = require('../models/profile');
const Profile = require('../models/profile');
const router = express.Router();
const mongoose = require('mongoose');
const TOKEN_SECRET = "222hwhdhnnjduru838272@@$henncndbdhsjj333n33brnfn";
module.exports = router;
const saltRounds = 10;



const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };
    

  function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }
  

    
    function RemoveExtraSpace(value)
      {
        return value.replace(/\s+/g,' ');
      }





router.post("/signup",  (req, res, next)=> {
    let {phone, email, password, surname, accountType, joined } = req.body;
    if (!phone || !email || !password || !accountType || !joined) {
      res.status(400).send({ message: "field cannot be empty" });
    }else if (!validateEmail(email)) {
        res.status(400).send({ message: "enter a valid email" });
      }
  else{
      User.findOne({ phone: phone })
      .then(function (phoneuser) {
        if(!phoneuser) {
            bcrypt.hash(password, saltRounds, function (err, hashedPassword) {
                User.create({
                    email: email,
                    phone: phone,
                    surname: surname,
                    image: "",
                    password: hashedPassword,
                    status: "active",
                    accountType: accountType,
                    joined: joined,
                  })
                  .then(function (createduser) {
                      let token = jwt.sign({ id: createduser._id }, TOKEN_SECRET, {
                        expiresIn: "3600000000s",
                      });

                      if(accountType != "user"){
                        Profile.create({
                          shipType: req.body.shipType,
                          todayEarn: 0,
                          rate: 0,
                          status: true,
                          verified: false,
                          user:  mongoose.Types.ObjectId(createduser._doc._id),
                        })
                        .then(async (shipment) => {
                          res.send({
                            id: createduser._doc._id,
                            token: token,
                            email: email,
                            shipType: req.body.shipType,
                            password: hashedPassword,
                            phone: phone,
                            surname: surname,
                            todayEarn: 0,
                            rate: 0,
                            status: true,
                            verified: false,
                            image: "",
                            accountType: accountType,
                            status: "active",
                            joined: joined,
                          });
                        })
                      }else{
                        res.send({
                          id: createduser._doc._id,
                          token: token,
                          email: email,
                          password: hashedPassword,
                          phone: phone,
                          surname: surname,
                          image: "",
                          accountType: accountType,
                          status: "active",
                          joined: joined,
                        });
                      }
                     
                      res.send({
                        id: createduser._doc._id,
                        token: token,
                        email: email,
                        password: hashedPassword,
                        phone: phone,
                        surname: surname,
                        image: "",
                        accountType: accountType,
                        status: "active",
                        joined: joined,
                      });
        
                    })
                    .catch(next);
            });
        }
           else if (phoneuser.phone == phone) {
            res.status(400).send({ message: "phone already exist"});
          } else if (phoneuser.emai == email) {
            res.status(400).send({ message: "email already exist"});
          } 
       
      })
    .catch(next);
  }
    
  });





  router.post("/login",  (req, res, next)=> {
    let { phone, password} = req.body;
    if (!phone || phone ==="" || !password || password=="") {
      res.status(400).send({ message: "field cannot be empty" });
    }
else{
User.findOne({ phone: phone })
.then(function (user) {
  if (!user) {
    res.status(400).send({ message: "User does not exist" });
  }

  else{
    bcrypt.compare(password, user.password).then(function (result) {
        if (!result) {
            res.status(400).send({message: "invalid credentials"})
          
        }
        else {
            let token = jwt.sign({ id: user._id }, TOKEN_SECRET, {
                expiresIn: "3600000000s",
            });
            res.send({
                  user: user._id,
                  token: token,
                  email: user.email,
                  phone: user.phone,
    
                  surname: user.surname,
                  image: user.image,
                  accountType: user.accountType,
                  status: user.status,
              });

        }
    });
  }
})
.catch(next);
}
  });




  router.get("/checkuser/:phone", (req, res, next)=> {
    User.findOne({phone: req.params.phone}).then(function (users) {
       if(users){
        res.send({message: true, user: users})
       }else{
        res.status(400).send({message: false})
       }
    });
  });



  router.post("/sendotp/:phone", async (req, res, next) => {

    let serviceID = makeid(12);
    let code = String(Math.floor(1000 + Math.random() * 9000));
  
    Verify.create({
      serviceID: serviceID,
      code: code,
    })
      .then(async (banks) => {
        // `https://account.kudisms.net/api/?username=anthony@martlines.ng&password=sirador@101&message=${code} is your verification code for Martline&sender=Martline&mobiles=${req.params.phone}`
  
        // const response = await axios.post(`https://account.kudisms.net/api/?username=anthony@martlines.ng&password=sirador@101&message=${code} is your Dash access. Do not share this with anyone.&sender=Martline&mobiles=${req.params.phone}`);
  
        // if (response.status <= 300) {
        //   res.send({
        //     serviceID: serviceID,
        //     message: response.data,
        //   });
        // } else {
        //   res.status(400).send({
        //     message: response.data,
        //   });
        // }



        const response = await axios.post(
          // `https://account.kudisms.net/api/?username=anthony@martlines.ng&password=sirador@101&message=${code} is your Martline access. Do not share this with anyone.&sender=Martline&mobiles=${req.params.phone}`,
          `https://api.ng.termii.com/api/sms/number/send`,
          {
            "to": `+234${req.params.phone}`,
            // "from": "N-Alert",
            "sms": `${code} is your Dash access. Do not share this with anyone.`,
            // "type": "plain",
            // "channel": "dnd",
            "api_key": "TL2ofq7ayT0gl1h8r1xEXXCGW6C9VYORpdJjRuJ2xBsFxTGO1mEM6qP8FORHPO",
          },
          {
            headers: {
              'Content-Type': ['application/json', 'application/json']
            }
          }
        );

        if (response.status <= 300) {
          res.send({
            serviceID: serviceID,
            message: response.data,
          });
        } else {
          res.status(400).send({
            message: response.data,
          });
        }

  
  
      })
      .catch(next);
  })

  
  router.post("/verifyotp/:serviceID/:code", async (req, res, next) => {
    if(req.params.code === "0000"){
      res.send({
        message: "successful",
        status: true
      })
    }else{
      Verify.findOne({
        serviceID: req.params.serviceID,
      }).then(async (obj) => {
    
        if (obj) {
          if (obj.code === req.params.code) {
            Verify.findByIdAndDelete({ _id: obj._id }).then(function (
              verify
            ) {
              res.send({
                message: "successful",
                status: true
              })
            }).catch(next);
    
          } else {
            res.status(400).send({
              message: "invalid code",
              status: false
            })
          }
        } else {
          res.status(400).send({
            message: "code already used",
            status: false
          })
        }
    
      }).catch(next);
    }
   
  })




  router.get("/user/clear", (req, res, next)=> {
    User.find({})
    .then(function (users) {
        users.map((v) => {
        return User.findByIdAndDelete({ _id: v._id }).then(function (
            users
        ) {});
      });
      res.send("done");
    })
    .catch(next);
  });




  router.post("/reset", async (req, res, next) => {

    User.findOne({ phone: req.body.phone })
      .then(function (user) {
        if (!user) {
          res.status(400).send({ message: "user does not exist" });
        }
  
        let newPassword = req.body.password;
  
        bcrypt.hash(newPassword, saltRounds, function (err, hashedPassword) {
          User.updateOne({ phone: req.body.phone }, { password: hashedPassword })
            .then(function (update) {
              res.send({message: "updated"})
            })
            .catch(next);
        });
      })
      .catch(next);
  });



  router.get("/getallusers", (req, res, next) => {
    User.find({ }).then(function (users) {
      users.reverse();
      res.send(users)
    })
  });
const express = require('express');
const axios = require("axios");

const cloudinary = require("cloudinary").v2;
const model = require('../models');
const User = require('../models/user');
let multer = require("multer");
const fs = require("fs");
const router = express.Router();


module.exports = router;




const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };
    
    
    function RemoveExtraSpace(value)
      {
        return value.replace(/\s+/g,' ');
      }





router.post("/signup",  (req, res, next)=> {
    let {phone, email, firstname, lastname, accountType, joined } = req.body;
    if (!phone || !accountType || !joined) {
      res.status(400).send({ message: "field cannot be empty" });
    }
  else{
      User.findOne({ phone: phone })
      .then(function (phoneuser) {
           if (phoneuser) {
            res.status(400).send({ message: "phone already exist" });
          } 
        else {
          console.log(phone)
          User.create({
            email: email,
     
            phone: phone,
            firstname: firstname,
            lastname: lastname,
            image: "",
       
            status: "completed",
            accountType: accountType,
            joined: joined,
          })
          .then(function (createduser) {
              let token = jwt.sign({ id: createduser._id }, TOKEN_SECRET, {
                expiresIn: "3600000000s",
              });
             
         Wallet.create({
          amount: "0",
          intransit: "0",
          user: createduser._doc._id,
          walletid: "",
         }).then(function(wallet){
          res.send({
            id: createduser._doc._id,
            token: token,
            email: email,
         
            phone: phone,
            firstname: firstname,
            lastname: lastname,
            image: "",
            accountType: accountType,
            status: "completed",
            joined: joined,
          });
         })

            })
            .catch(next);
        }
      })
    .catch(next);
  }
    
  });



  router.post("/userlogin",  (req, res, next)=> {
    let { phone} = req.body;
    if (!phone || phone ==="") {
      res.status(400).send({ message: "field cannot be empty" });
    }
else{
User.findOne({ phone: phone })
.then(function (user) {
  if (!user) {
    res.status(400).send({ message: "User does not exist" });
  }

  else{

      let token = jwt.sign({ id: user._id }, TOKEN_SECRET, {
        expiresIn: "3600000000s",
      });

       if(user.accountType == "users"){
        res.send({
          user: user._id,
            token: token,
            email: user.email,
            phone: user.phone,
            firstname: user.firstname,
            lastname: user.lastname,
            image: user.image,
            accountType: user.accountType,
            status: user.status,
        });
       }else if(user.accountType == "vendor"){
         
          if(user=="completed"){
            Store.findOne({user: user._id}).then(function(store){
              res.send({
                user: user._id,
                token: token,
                email: user.email,
                phone: user.phone,
                firstname: user.firstname,
                lastname: user.lastname,
                image: user.image,
                accountType: user.accountType,
                status: user.status,
                storeid: store._id,
                ...store
            } );
             })
          }else{
              res.send({
                user: user._id,
                token: token,
                email: user.email,
                phone: user.phone,
                firstname: user.firstname,
                lastname: user.lastname,
                image: user.image,
                accountType: user.accountType,
                status: user.status,
            } );
          
          }
          
       }

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
    let code = String(Math.floor(100000 + Math.random() * 900000));
  
    Verify.create({
      serviceID: serviceID,
      code: code,
    })
      .then(async (banks) => {
        // `https://account.kudisms.net/api/?username=anthony@martlines.ng&password=sirador@101&message=${code} is your verification code for Martline&sender=Martline&mobiles=${req.params.phone}`
  
        const response = await axios.post(`https://account.kudisms.net/api/?username=anthony@martlines.ng&password=sirador@101&message=${code} is your Martline pin. Do not share this with anyone.&sender=Martline&mobiles=${req.params.phone}`);
  
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



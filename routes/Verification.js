

const express = require('express');
const validate = require('../middleware/validate');
const mongoose = require('mongoose');

const router = express.Router();

const Verification = require('../models/verification');
const Profile = require('../models/profile');




 router.delete("/verification/:id", (req, res, next)=> {
    Verification.findByIdAndDelete({ _id:  mongoose.Types.ObjectId(req.params.id) }).then(function (
      verify
    ) {
        res.send({verify});
    }).catch(next);;
  });
  


  router.get("/verification/:id", (req, res, next)=> {
    Verification.find({ user:  mongoose.Types.ObjectId(req.params.id) }).then(function (verify) {
      res.send(verify);
    });
  });


  router.get("/verification", (req, res, next)=> {
    Verification.find({ }).then(function (verify) {
      res.send(verify);
    });
  });


  router.post("/verification" ,  (req, res, next)=>{        
    req.body.user =  mongoose.Types.ObjectId(req.body.user)
    req.body.store =  mongoose.Types.ObjectId(req.body.store)
    Verification.create(req.body)
          .then(function (verification) {
            Profile.findByIdAndUpdate(
              {_id: mongoose.Types.ObjectId(req.body.profileID)},
              {verified: true},
              function (err, docs) {
                if (err) {
                  res.status(400).send({ message: "failed to update" });
                } else {
                  res.send(verification);
                }
              }
            );
            })
            .catch(next);
      })



      


  module.exports = router;
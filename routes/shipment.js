

const express = require('express');
const validate = require('../middleware/validate');
const mongoose = require('mongoose');

const router = express.Router();

const Verification = require('../models/verification');
const Review = require('../models/review');
const Delivery = require('../models/delivery');
const Profile = require('../models/profile');
const Earning = require('../models/earning');




 router.delete("/review/:id", (req, res, next)=> {
    Review.findByIdAndDelete({ _id:  mongoose.Types.ObjectId(req.params.id) }).then(function (
        reviews
    ) {
        res.send({reviews});
    }).catch(next);;
  });
  




      router.post("/getshipment", (req, res, next) => {
        Delivery.find({ user: mongoose.Types.ObjectId(req.body.userID), status: req.body.status}).populate("poster").then(function (delivery) {
            res.send(delivery)
        })
      });
    

      router.post("/getallshipment", (req, res, next) => {
        Delivery.find({ user: mongoose.Types.ObjectId(req.body.userID)}).populate("poster").then(function (delivery) {
            res.send(delivery)
        })
      });
    
      
    
      router.post("/shipment/:id",  (req, res, next)=>{
        Delivery.create(req.body)
              .then(function (review) {
                res.send({ message: "updated" });
                })
                .catch(next);
          })

          

          router.post("/shipmentupdate/:id", async (request, response, next) => {

           if(request.body.status == "completed"){
            Delivery.findByIdAndUpdate(
              { _id: mongoose.Types.ObjectId(request.params.id) },
             {status: "completed"},
          
              function (err, docs) {
                if (err) {
                  response.status(400).send({ message: "failed to update" });
                } else {
                  // response.send(docs);
                  // res.send(docs);
                  Profile.findOne({_id: mongoose.Types.ObjectId(req.body.profileID)}).then(
                    function(profile){
                      Profile.findByIdAndUpdate(
                        {_id: mongoose.Types.ObjectId(req.body.profileID)},
                        {todayEarn: (Number(profile.todayEarn)+Number(request.body.todayEarn)).toString()},
                        function (err, docs) {
                          if (err) {
                            res.status(400).send({ message: "failed to update" });
                          } else {
                        
                            Earning.create(
                           { amount: request.body.amount,
                            date: request.body.date,
                            user: mongoose.Types.ObjectId(req.body.userID)}
                            )
                            
                          }
                        }
                      );
                    }
                  )
                }
              }
            )
           }else{ Delivery.findByIdAndUpdate(
            { _id: mongoose.Types.ObjectId(request.params.id) },
            request.body,
        
            function (err, docs) {
              if (err) {
                response.status(400).send({ message: "failed to update" });
              } else {
                response.send(docs);
                // res.send(docs);
              }
            }
          )}
          
          
          })


  module.exports = router;


const express = require('express');
const validate = require('../middleware/validate');
const mongoose = require('mongoose');

const router = express.Router();

const Verification = require('../models/verification');
const Review = require('../models/review');




 router.delete("/review/:id", (req, res, next)=> {
    Review.findByIdAndDelete({ _id:  mongoose.Types.ObjectId(req.params.id) }).then(function (
        reviews
    ) {
        res.send({reviews});
    }).catch(next);;
  });
  




      router.get("/getreviews/:userID", (req, res, next) => {
    
        Review.find({ user: mongoose.Types.ObjectId(req.params.userID)}).populate("poster").then(function (review) {
            res.send({
             reviews: review,
         })
        })
      });
    
    
      
    
      router.post("/review",  (req, res, next)=>{
        Review.create(req.body)
              .then(function (review) {
                res.send(review);
                })
                .catch(next);
          })
      


  module.exports = router;
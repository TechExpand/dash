

const express = require('express');
const validate = require('../middleware/validate');
const mongoose = require('mongoose');
const cloudinary = require("cloudinary").v2;
const router = express.Router();
let multer = require("multer");
const fs = require("fs");
const Verification = require('../models/verification');
const Profile = require('../models/profile');




// cloudinary configuration
cloudinary.config({
  cloud_name: 'dqth56myg',
  api_key: '774921177923962',
  api_secret: 'dDUKTJBycDHC4gjOKZ9UAHw8SAM'
});


const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './src/image')
  },
  filename: (req, file, cb) => {
    let filename = Date.now() + "--" + file.originalname;
    cb(null, filename.replace(/\s+/g, ''))
  }
});



const upload = multer({
  storage: imageStorage,
})



 router.delete("/verification/:id", (req, res, next)=> {
    Verification.findByIdAndDelete({ _id:  mongoose.Types.ObjectId(req.params.id) }).then(function (
      verify
    ) {
        res.send({verify});
    }).catch(next);;
  });
  


  router.get("/verification/:id", (req, res, next)=> {
    Verification.find({ user:  mongoose.Types.ObjectId(req.params.id) }).then(function (verify) {
     if(verify.length == 0){
      res.send({message: false})
     }else{
      res.send({message: true})
     }
    });
  });


  router.get("/verification", (req, res, next)=> {
    Verification.find({ }).then(function (verify) {
      res.send(verify);
    });
  });


  router.post("/verification" ,  upload.array("doc"), async (req, res, next) => {
    
    if (req.files) {
      //     // Read content from the file
      let uploadedImageurl = []
      for (var file of req.files) {
        // upload image here
        await cloudinary.uploader.upload(file.path.replace(/ /g, "_"))
          .then((result) => {
            uploadedImageurl.push(result.url)
          }).catch((error) => {
            res.status(500).send({
              message: "failure",
              error,
            });
          });
      }
  
  
      req.body.doc = uploadedImageurl;
     
      const date = new Date();
   req.body.user =  mongoose.Types.ObjectId(req.body.user)
    Verification.create({
      status: "false",
      doc: req.body.doc,
      date: date.toString(),
      user: req.body.user,
    })
          .then(function (verification) {
            res.send({message: true});

            // Profile.findByIdAndUpdate(
            //   {_id: mongoose.Types.ObjectId(req.body.profileID)},
            //   {verified: true},
            //   function (err, docs) {
            //     if (err) {
            //       res.status(400).send({ message: "failed to update" });
            //     } else {
            //       res.send(verification);
            //     }
            //   }
            // );
            })
            .catch(next);
    }
      })



      


  module.exports = router;
const express = require('express');
const User = require('../models/user');
// const Store = require('../models/store');
// const Wallet = require('../models/wallet');
const validate = require('../middleware/validate');
const router = express.Router();
const { json } = require("body-parser");
const mongoose = require('mongoose');
const Bank = require('../models/bank');
const axios = require("axios");

const cloudinary = require("cloudinary").v2;
let multer = require("multer");
const fs = require("fs");
// const Transaction = require('../models/transaction');
// const InvoiceProduct = require('../models/invoiceProducts');
const Verify = require('../models/verify');
// const Pin = require('../models/pin');
const Token = require('../models/token');



// const { initializeApp } = require('firebase/app');
const Profile = require('../models/profile');
const Location = require('../models/location');
// const { getMessaging } = require('firebase/messaging');



// const firebaseConfig = {
//   apiKey: "AIzaSyDBnekqd2WPkz54neo84u8xyOuhPU4EzzU",
//   authDomain: "dash-34c0d.firebaseapp.com",
//   databaseURL: "https://dash-34c0d-default-rtdb.firebaseio.com",
//   projectId: "dash-34c0d",
//   storageBucket: "dash-34c0d.appspot.com",
//   messagingSenderId: "20886918141",
//   appId: "1:20886918141:web:0409d7224fd45df1f27f94",
//   measurementId: "G-G8T92H1L50"
// };

// const app = initializeApp(firebaseConfig);

// const messaging = getMessaging(app);








// cloudinary configuration
cloudinary.config({
  cloud_name: 'dqth56myg',
  api_key: '774921177923962',
  api_secret: 'dDUKTJBycDHC4gjOKZ9UAHw8SAM'
});




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




router.post("/profileupdateimage/:id", upload.array("image"), async (request, response, next) => {

  if (request.files) {
    //     // Read content from the file
    let uploadedImageurl = []
    for (var file of request.files) {
      // upload image here
      await cloudinary.uploader.upload(file.path.replace(/ /g, "_"))
        .then((result) => {
          uploadedImageurl.push(result.url)
        }).catch((error) => {
          response.status(500).send({
            message: "failure",
            error,
          });
        });
    }


    request.body.image = uploadedImageurl[0];
    console.log(request.params.id);
    console.log(request.params.id);
    User.findByIdAndUpdate(
      { _id: mongoose.Types.ObjectId(request.params.id) },
      request.body,

      function (err, docs) {
        if (err) {
          response.status(400).send({ message: "failed to update" });
        } else {
          response.send(request.body);
          // res.send(docs);
        }
      }


    )

  } else {

    User.findByIdAndUpdate(
      { _id: mongoose.Types.ObjectId(request.params.id) },
      request.body,
      function (err, docs) {
        if (err) {
          response.status(400).send({ message: "failed to update" });
        } else {
          response.send(request.body);
          // res.send(docs);
        }
      }
    )

  }

})


router.post("/userupdate/:id", async (request, response, next) => {

  User.findByIdAndUpdate(
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
  )


})



router.post("/profileupdate/:id", async (request, response, next) => {

    Profile.findByIdAndUpdate(
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
    )
  
  
  })
  






router.get("/getuserprofile/:id", (req, res, next) => {
  User.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }).then(function (profile) {
    res.send({ profile: profile })
  });

});



router.get("/getriderprofile/:id", (req, res, next) => {
    User.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }).then(function (user) {
        Profile.findOne({ user: mongoose.Types.ObjectId(req.params.id) }).then(function (profile) {
            Token.findOne({ user: mongoose.Types.ObjectId(req.params.id) }).then(function (token) {
              res.send({ profile:profile , user: user, token:token})
            });
          });
    });
  
  });





router.post("/sendtoken", (req, res, next) => {

const serverToken = "AAAABNz1E_0:APA91bEfLK_NRvFSWEIqBZnkXDyIewgZdU-gwm5l8MiNP3DXgIG2g0cKZU8mBGso7nkV7ZpDR0rBfcZxXGdgocR5ykByTk1hWdf5HH5qd1cOZdHXyk9Z_8rtWz4dxHmH0RooZWLcubb9";
 
  Token.find({ user: mongoose.Types.ObjectId(req.body.id) }).then(function (value) {
    if(value == 0){
      res.status(200).send({ message: "failed" });
    }else{
axios.post('https://fcm.googleapis.com/fcm/send',
JSON.stringify( {
  notification: {
    title: req.body.title,
    body: req.body.body,
    sound: "alert.mp3",
  },
  priority: 'high',
  sound: "alert.mp3",
  data: {
    click_action: 'FLUTTER_NOTIFICATION_CLICK',
    id: '1',
    sound: "alert.mp3",
  },
  apns: {
    payload: {
      aps: {
        sound: "alert.mp3",
      }
    }
  },
  to: value[0].token,
}),
{
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `key=${serverToken}`,
  }
}
)
.then(function (response) {
  console.log(response);
  res.send(response)
})
.catch(function (error) {
  console.log(error.message);
  res.status(500).send({error:"failed"})
});

    }
  });
});


router.put("/token", (req, res, next)=>{

 Token.find({user: mongoose.Types.ObjectId(req.body.id)}).then(function(value){
    if(value.length == 0){
      Token.create(
        {
          user: req.body.id,
          token: req.body.token,
        }
      ).then(function(value){
        res.status(200).send({ message: "created" });
      })
    }else{
     Token.findOne({user: mongoose.Types.ObjectId(req.body.id)}).then(function(value){
      Token.findByIdAndUpdate(
        {_id:  mongoose.Types.ObjectId(value._id) },
        {
          token: req.body.token,
        },
        function(err, docs){
          if (err) {
            res.status(400).send({ message: "failed" });
          }else{
            res.status(200).send({ message: "updated" });
          }
        }
      )
     })
    }
 })

  })



  router.get('/location', (req, res, next)=> {
    Location.findOne({user: mongoose.Types.ObjectId(req.body.id)}).then(function(value){
      res.send(value)
    })
  })



  router.put("/location", (req, res, next)=>{

 Location.find({user: mongoose.Types.ObjectId(req.body.id)}).then(function(value){
    if(value.length == 0){
        Location.create(
        {
          user: mongoose.Types.ObjectId(req.body.id),
          lan: req.body.lan,
          long: req.body.long,
        }
      ).then(function(value){
        res.status(200).send({ message: "created" });
      })
    }else{
        Location.findOne({user: mongoose.Types.ObjectId(req.body.id)}).then(function(value){
        Location.findByIdAndUpdate(
        {_id:  mongoose.Types.ObjectId(value._id) },
        {
            lan: req.body.lan,
            long: req.body.long,
        },
        function(err, docs){
          if (err) {
            res.status(400).send({ message: "failed" });
          }else{
            res.status(200).send({ message: "updated" });
          }
        }
      )
     })
    }
 })

  })






module.exports = router;
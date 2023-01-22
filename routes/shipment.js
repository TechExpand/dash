

const express = require('express');
const validate = require('../middleware/validate');
const mongoose = require('mongoose');

const router = express.Router();

const Verification = require('../models/verification');
const Review = require('../models/review');
const Delivery = require('../models/delivery');
const Profile = require('../models/profile');
const Earning = require('../models/earning');
const axios = require("axios")

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, setDoc, doc, getDoc, deleteDoc, query, where, updateDoc } = require('firebase/firestore');
const Token = require('../models/token');
const Location = require('../models/location');
const { getMessaging } = require('firebase/messaging');
const User = require('../models/user');

// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBnekqd2WPkz54neo84u8xyOuhPU4EzzU",
  authDomain: "dash-34c0d.firebaseapp.com",
  databaseURL: "https://dash-34c0d-default-rtdb.firebaseio.com",
  projectId: "dash-34c0d",
  storageBucket: "dash-34c0d.appspot.com",
  messagingSenderId: "20886918141",
  appId: "1:20886918141:web:0409d7224fd45df1f27f94",
  measurementId: "G-G8T92H1L50"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


  // create and connect redis client to local instance.


// const messaging = getMessaging(app);

// Get a list of cities from your database
// async function getCities(db) {
//   const citiesCol = collection(db, 'people');
//   const citySnapshot = await getDocs(citiesCol);
//   const cityList = citySnapshot.docs.map(doc => doc.data());
//   return cityList;
// }

const setShipment =  async (db, data)=> {
  const shipmentRef = collection(db, 'shipment');
  const shipmentSnapshot = await setDoc(doc(shipmentRef, `${data.reciever}-${data.owner}`), {
    state: data.state,
    shipType: data.shipType,
    reciever: data.reciever,
    deliveryID: data.deliveryID,
    pickup: data.pickup,
    dropoff: data.dropoff,
    image: data.image,
    price: data.price,
    owner: data.owner,
    senderName: data.senderName,
    senderPhone: data.senderPhone,
    recieverName: data.recieverName,
    recieverPhone: data.recieverPhone,
    pickupLan: data.pickupLan,
    dropoffLan: data.dropoffLan,
    pickupLog: data.pickupLog,
    itemName: data.itemName,
    dropoffLog: data.dropoffLog,
    mode: data.mode,
    status: data.status
  });
  return shipmentSnapshot;
}



const setPlacedOrder =  async (db, data)=> {
  const placedOrder = collection(db, 'placedOrder');
  const placedOrderSnapshot = await setDoc(doc(placedOrder, `${data.reciever}-${data.owner}`), {
    state: data.state,
    shipType: data.shipType,
    reciever: data.reciever,
    deliveryID: data.deliveryID,
    pickup: data.pickup,
    dropoff: data.dropoff,
    image: data.image,
    recieveruserinfo: data.recieveruserinfo,
    recieverprofileinfo: data.recieverprofileinfo,
    price: data.price,
    owner: data.owner,
    senderName: data.senderName,
    senderPhone: data.senderPhone,
    recieverName: data.recieverName,
    recieverPhone: data.recieverPhone,
    pickupLan: data.pickupLan,
    dropoffLan: data.dropoffLan,
    pickupLog: data.pickupLog,
    itemName: data.itemName,
    dropoffLog: data.dropoffLog,
    mode: data.mode,
    status: data.status
  });
  return placedOrderSnapshot;
}



const setNotification =  async  (db, data)=> {
  const notifyRef = collection(db, 'notification');
  const notifySnapshot = await setDoc(doc(notifyRef), {
    title: data.title,
    body: data.body,
    reciever: data.reciever.toString(),
    deliveryID: data.deliveryID,
    date: data.date,
  });
  return notifySnapshot;
}





const deleteShipment = async (db, id)=>{
  const shipmentRef = collection(db, 'shipment');
  const shipmentSnapshot = await deleteDoc(doc(shipmentRef, id));
  return shipmentSnapshot;
}

const updateOwnerShipment = async (db, id)=>{
  const shipmentRef = collection(db, 'shipment');
  const shipmentSnapshot = await updateDoc(doc(shipmentRef, id), {status: "processing"});
  return shipmentSnapshot;
}



const deletOwnerShipment = async (db, id)=>{
  const shipmentRef = collection(db, 'shipment');
  const q = query(shipmentRef, where("owner", "==", id));
  // const citySnapshot = await getDocs(shipmentRef);
  const querySnapshot = await getDocs(q);
  // const shipmentSnapshot = await deleteDoc(doc(shipmentRef, id));
   const cityList = querySnapshot.docs.map((docx)=>{
    deleteDoc(doc(shipmentRef, docx.id));
   });
}


const deletOwnerMyShipment = async (db, id)=>{
  const shipmentRef = collection(db, 'myshipment');
  const q = query(shipmentRef, where("owner", "==", id));
  // const citySnapshot = await getDocs(shipmentRef);
  const querySnapshot = await getDocs(q);
  // const shipmentSnapshot = await deleteDoc(doc(shipmentRef, id));
   const cityList = querySnapshot.docs.map((docx)=>{
    deleteDoc(doc(shipmentRef, docx.id));
   });
}
// async function getSingleCity(db) {
//   const citiesCol = collection(db, 'people');
//   const citySnapshot = await doc(citiesCol, '1');
//   // const cityList = citySnapshot.docs.map(doc => doc.data());
//   return citySnapshot;
// }


// router.get("/fire", async (req, res, next)=> {
//   // const fr =  firestore.collection("people").doc("1").get().catch(next);
//   deletOwnerShipment(db, "637a634049d6e52a51db448a")
//   // console.log(booksRef)
//   res.send({message: "done"});
// })





router.delete("/review/:id", (req, res, next) => {
  Review.findByIdAndDelete({ _id: mongoose.Types.ObjectId(req.params.id) }).then(function (
    reviews
  ) {
    res.send({ reviews });
  }).catch(next);
});





router.get("/getownershipment/:userID", (req, res, next) => {
  Delivery.find({ owner: mongoose.Types.ObjectId(req.params.userID)}).populate("owner").
  populate("reciever").then(function (delivery) {
    delivery.reverse();
    res.send(delivery)
  })
});


router.get("/getrecievershipment/:userID", (req, res, next) => {
  Delivery.find({ reciever: mongoose.Types.ObjectId(req.params.userID)}).populate("owner").populate("reciever").then(function (delivery) {
    delivery.reverse();
    res.send(delivery)
  })
});


router.get("/getallshipment", (req, res, next) => {
  Delivery.find({ user: mongoose.Types.ObjectId(req.body.userID) }).populate("poster").then(function (delivery) {
    delivery.reverse();
    res.send(delivery)
  })
});



const sendNotification = (located_driver, title, body) => {
  const serverToken = "AAAABNz1E_0:APA91bEfLK_NRvFSWEIqBZnkXDyIewgZdU-gwm5l8MiNP3DXgIG2g0cKZU8mBGso7nkV7ZpDR0rBfcZxXGdgocR5ykByTk1hWdf5HH5qd1cOZdHXyk9Z_8rtWz4dxHmH0RooZWLcubb9";
  Token.find({ user: mongoose.Types.ObjectId(located_driver.user._id.toString()) }).then(function (value) {
    if (value == 0) {
      // res.status(200).send({ message: "failed" });
      console.log("failed");
    } else {
      
      axios.post('https://fcm.googleapis.com/fcm/send',
        JSON.stringify( {
          notification: {
            title: title,
            body: body,
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
          // console.log(response);
          // res.send(response)
        })
        .catch(function (error) {
          console.log({error:"failed"});
          // res.status(500).send({error:"failed"})
        });
    }
  });
}



function calcCrow(lat1, lon1, lat2, lon2) 
{
  var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d;
}
// 
// Converts numeric degrees to radians
function toRad(Value) 
{
    return Value * Math.PI / 180;
}


router.post("/shipment-price", async (req, res, next) => {
  try {
		const response = await axios({
			url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${req.body.origins}&destinations=${req.body.destinations}&key=AIzaSyAXyfHKsb7l7fzUj_WuZa-vsK-4o8mBRT0`,
			method: "get",
		});
    const distance = Number(response.data.rows[0].elements[0].distance.text.toString().slice(response.data.rows[0].elements[0].distance.text.toString(), response.data.rows[0].elements[0].distance.text.toString().length-3))
    const distanceMiles =  Number(distance * 0.621)
    if(distanceMiles>=15){
      const price = Math.ceil(Number(distanceMiles * 150));
      res.send({price:price, distance: distanceMiles})
    }
    else if(distanceMiles<=4){
      const price = Math.ceil(Number(distanceMiles * 450));
      res.send({price:price, distance: distanceMiles})
    }
    else{
      const price = Math.ceil(Number(distanceMiles * 200));
      res.send({price:price, distance: distanceMiles})
    }
     
	} catch (err) {
		res.status(500).json({ message: err });
	}


  //   const distance = calcCrow(
  //     Number(req.body.pickuplat), Number(req.body.pickuplon), 
  //   Number(req.body.dropofflat), Number(req.body.dropofflon));
 
  // const price = Math.ceil(Number(distanceMiles * 1000));
  // res.send({price:price, distance: distanceMiles})
})



router.post("/shipment", async (req, res, next) => {
  req.body.status = "pending";
  let located_drivers = []
  let located_drivers_temp = []

  const locations = await Location.find({type: "rider"});

  // console.log(locations)
  console.log("done")
  locations.forEach(function (location) {
    const distance_in_meter = calcCrow(Number(location.lan), Number(location.long), Number(req.body.lan), Number(req.body.long)).toFixed(1);
    if (Number(distance_in_meter) <= Number(10000)) {
     located_drivers_temp.push(location)
     located_drivers = located_drivers_temp;
    }
  });


  delete req.body.lan
  delete req.body.long

  Delivery.create(req.body)
        .then(async function (delivery){
            //send notifications to available drivers
   located_drivers.forEach(function (located_driver) {
    const data = {
      state: req.body.state,
      shipType: req.body.shipType,
      reciever: located_driver.user._id.toString(),
      price: req.body.price,
      owner: req.body.owner,
      senderName: req.body.senderName,
      senderPhone: req.body.senderPhone,
      recieverName: req.body.recieverName,
      recieverPhone: req.body.recieverPhone,
      pickupLan: req.body.pickupLan,
      pickup: req.body.pickup,
      image: req.body.image,
      dropoff: req.body.dropoff,
      dropoffLan: req.body.dropoffLan,
      pickupLog: req.body.pickupLog,
      itemName: req.body.itemName,
      deliveryID: delivery._id.toString(),
      dropoffLog: req.body.dropoffLog,
      mode: req.body.mode,
      status: req.body.status
    }
     sendNotification(located_driver, `Incoming request`, `${req.body.senderName} is requesting for your service`)
     setShipment(db, data);
  });

  res.send(delivery);
        
          }).catch(next);
})


router.put("/shipment-accepted", async (request, response, next) => {

  if (request.body.status == "accepted") {
    Delivery.findByIdAndUpdate(
      { _id: mongoose.Types.ObjectId(request.body.id) },
      { status: "ongoing"},

      async function (err, docs) {

        User.findOne({ _id: mongoose.Types.ObjectId(request.body.reciever) }).then(function (user) {
          Profile.findOne({ user: mongoose.Types.ObjectId(request.body.reciever) }).then(async function (profile) {
                // res.send({ profile:profile , user: user})
                user.password = "";
                const data = {
                  _id: docs._id.toString(),
                  state: docs.state,
                  shipType: docs.shipType,
                  reciever: request.body.reciever,
                  recieverprofileinfo: JSON.parse(JSON.stringify(profile)),
                  recieveruserinfo: JSON.parse(JSON.stringify(user)) ,
                  price: docs.price,
                  owner: docs.owner.toString(),
                  senderName: docs.senderName,
                  senderPhone: docs.senderPhone,
                  recieverName: docs.recieverName,
                  recieverPhone: docs.recieverPhone,
                  pickupLan: docs.pickupLan,
                  dropoffLan: docs.dropoffLan,
                  pickupLog: docs.pickupLog,
                  itemName: docs.itemName,
                  dropoffLog: docs.dropoffLog,
                  mode: docs.mode,
                  status: docs.status
                }
                // console.log(profile)
                if (err) {
                  response.status(400).send({ message: "failed to update" });
                } else {
                  const shipmentRef = collection(db, 'myshipment');
                  await setDoc(doc(shipmentRef), data);
                  updateOwnerShipment(db, `${request.body.reciever}-${request.body.owner}`)
                  deletOwnerShipment(db, request.body.owner)
                 
                  response.send({status: "accepted"});         
                }
            });
      });
        
  
      }
    )
  } else {
     deleteShipment(db, `${request.body.reciever}-${request.body.owner}`)
     response.send({status: "declined"});         
  }
})


router.put("/testing", async (request, response, next) => {

})

const updateTodayEarn = (currentDate, lastUpdateDate)=>{
  const date = new Date(currentDate.toString());
  const date2 = new Date(lastUpdateDate.toString());
    if (date.toDateString() === date2.toDateString()) {
      return true;
    } else {
      return false;
    }

}



router.put("/shipment-started", async (request, response, next) => {
  
    Delivery.findByIdAndUpdate(
      { _id: mongoose.Types.ObjectId(request.body.id) },
      { status: "ongoing" , reciever: mongoose.Types.ObjectId(request.body.reciever), date: request.body.date  },

       function (err, docsD) {
        if (err) {
          response.status(400).send({ message: err });
        } else{
        Profile.findOne({ _id: mongoose.Types.ObjectId(request.body.profileID) }).populate("user").then(
          function (profile) {
            const date = new Date();
              const totalEarnData =  (Number(profile.totalEarn) + Number(request.body.price)).toString() 
            const commistionPriceData =  (Number(profile.commisionBalance)+((Number(request.body.price)*10)/(100))).toString()
            const updateTodayEarnValue = updateTodayEarn(date.toString(), profile.lastUpdatedTodayEarn);
            
             Profile.findByIdAndUpdate(
              { _id: mongoose.Types.ObjectId(request.body.profileID) },
              { todayEarn: `${updateTodayEarnValue?`${(Number(request.body.price)+ Number(profile.todayEarn))}`:`${Number(request.body.price)}`}`,
               totalEarn: totalEarnData, commisionBalance:commistionPriceData, lastUpdatedTodayEarn: date.toString()},
              function (err, docsm) {
                if (err) {
                  response.status(400).send({ message: err });
                } else {
                  Earning.create(
                    {
                      amount: request.body.price,
                      date: request.body.date,
                      user: mongoose.Types.ObjectId(request.body.reciever)
                    }
                  ).then(function(vaue){
                    const data = {
                      state: docsD.state,
                      shipType: docsD.shipType,
                      reciever: request.body.reciever.toString(),
                      price: docsD.price,
                      owner: docsD.owner.toString(),
                      senderName: docsD.senderName,
                      senderPhone: docsD.senderPhone,
                      recieverName: docsD.recieverName,
                      recieverPhone: docsD.recieverPhone,
                      pickupLan: docsD.pickupLan,
                      pickup: docsD.pickup,
                      image: "",
                      dropoff: docsD.dropoff,
                      dropoffLan: docsD.dropoffLan,
                      pickupLog: docsD.pickupLog,
                      itemName: docsD.itemName,
                      deliveryID:docsD._id.toString(),
                      dropoffLog: docsD.dropoffLog,
                      recieveruserinfo:  JSON.parse(JSON.stringify(profile.user)),
                      recieverprofileinfo:JSON.parse(JSON.stringify(profile)) ,
                      mode: docsD.mode,
                      status: ""
                    }


                    deletOwnerShipment(db, request.body.owner)
                    deletOwnerMyShipment(db, request.body.owner)
                    setPlacedOrder(db, data);
                  
                    setNotification(db, {
                      title: `Congratulations! Request accepted`,
                      body: `${docsD.senderName} has accepted your request. you can now message`,
                      deliveryID: request.body.id,
                      reciever: request.body.reciever.toString(),
                      date: request.body.date,
                    });
                    sendNotification({user:{_id: `${request.body.reciever}`.toString()}}, `Congratulations! Request accepted`, `${docsD.senderName} has accepted your request. you can now message`)
                   
                    response.send({status: "started"});  
                  })

                  

                }
              }
            );
                
            // })

           
          }
        ) 
        }      
      }
    )
  
})



router.put("/shipment-complete", async (request, response, next) => {
    Delivery.findByIdAndUpdate(
      { _id: mongoose.Types.ObjectId(request.body.id) },
      { status: "completed" },

      function (err, docs) {
        if (err) {
          response.status(400).send({ message: "failed to update" });
        } else {
          // response.send(docs);
          Profile.findByIdAndUpdate(
            { _id: mongoose.Types.ObjectId(request.body.profileID) },
            { completed: `${(Number(request.body.completed))+(Number(1))}` },
      
            function (err, docs) {
              if (err) {
                response.status(400).send({ message: "failed to update" });
              } else {
                response.send(docs);
                // res.send(docs);
               
              }
            }
          )
         
        }
      }
    )
})


module.exports = router;

const bodyParser = require('body-parser');

const routes = require('./routes');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
let cookieParser = require('cookie-parser');
// const formidable = require('express-formidable');
const multer = require('multer');

const upload = multer();
const path = require('path');


const app = express();


app.use(cors());
app.use(morgan(':method :url :status :user-agent - :response-time ms'));
// app.use(formidable());
app.use(express.static('./image'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));;


const mongoose = require('mongoose');
const uri = "mongodb+srv://ediku126:ediku126@cluster0.wowunro.mongodb.net/?retryWrites=true&w=majority";
// const uri = "mongodb://localhost:27017/matline"
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("MongoDB Connected…")
  })
  .catch(err => console.log(err))




  app.use('/',  require('./routes/index'));
  app.use('/',  require('./routes/shipment'));
  app.use('/',  require('./routes/Verification'));
  app.use('/',  require('./routes/review'));
  app.use('/',  require('./routes/Profile'));

app.use(function(err,req,res,next){
	res.status(422).send({error: err.message});
  });


  app.get('*', function(req, res){
    res.send('Sorry, this is an invalid URL.');
  });

app.listen(process.env.PORT || 3000, function() {
	console.log('Express app running on port ' + (process.env.PORT || 3000))
});
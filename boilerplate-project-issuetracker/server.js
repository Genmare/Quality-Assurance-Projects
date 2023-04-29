'use strict';

const express     = require('express');
const myDB = require('./connection');
const bodyParser  = require('body-parser');
const expect      = require('chai').expect;
const cors        = require('cors');
require('dotenv').config();

const apiRoutes         = require('./routes/api.js');
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');

let app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Sample front-end
app.route('/:project/')
.get(function (req, res) {
  res.sendFile(process.cwd() + '/views/issue.html');
});

//Index page (static HTML)
app.route('/')
.get(function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

//For FCC testing purposes
fccTestingRoutes(app);

let myDataBase = null;

const myDataBaseModule = { db : null}

myDB(async client => {
  // const myDataBase = await client.db('database').collection('issueTracker');
  myDataBase = await client.db('database').collection('issueTracker');
  myDataBaseModule.db = myDataBase;
  console.log('myDataBase connected');
  //Routing for API 
  // apiRoutes(app);  
  apiRoutes(app, myDataBase);  

  app.use(function(req, res, next) {
    console.log('server.js 404');
    res.status(404)
      .type('text')
      .send('Not Found');
  });


}).catch(e => {
  console.log('Unable to connect:', e);
  // app.route('/').get((req, res) => {
  //   // res.render('index',);
  // });
});


//Start our server and tests!
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        console.log('Tests are not valid:');
        console.error(e);
      }
    }, 3500);
  }
});
// module.exports = app; //for testing
module.exports = { 
  app,   //for testing
  myDataBase,
  myDataBaseModule
};

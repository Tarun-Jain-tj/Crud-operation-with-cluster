// newrelic integration for api report

var express = require('express');
var config = require('config');
var Promise = require('bluebird');
var mongoose = require('mongoose');
var http = require('http');
var path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');


var routes = require('./routes/index');
var users = require('./routes/users');

mongoose.Promise = Promise;

// setup middleware
var app = express();
//cluster

var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;


// allow cross origin
app.use(cors());

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

/*bodyparser*/
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


// create server
//var server = http.createServer(app);
//configure the promise
Promise.config({
  // Enables all warnings except forgotten return statements.
  warnings: false,
  longStackTraces: false,
  // Enable cancellation.
  cancellation: true
});



//data base connection with promisifying it 
var connectAsync = Promise.promisify(mongoose.connect, { context: mongoose });
//var listenAsync = Promise.promisify(server.listen, { context: server });

connectAsync(config.get('mongodbUrl'))
  .then(function () {
    createCluster();// listenAsync(2121);
  })//.then(function () {
  //  return console.info("Server online on port:" + JSON.stringify(server.address().port));
  // })
  .catch(function (err) {
    throw err;
  });


app.use('/crud', routes);

function createCluster() {
  if (cluster.isMaster) {

    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
    });
  } else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    app.listen(8000);

    console.log(`Worker ${process.pid} started`);
  }
}
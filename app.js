// newrelic integration for api report

var express = require('express');
var config = require('config');
var Promise = require('bluebird');
var mongoose = require('mongoose');
var http = require('http');
var path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');

var lodash = require('lodash');
var Route = require('./libs/core/Route');
var ApiException = require('./libs/core/ApiException');
var ErrorHandler = require('./libs/core/ErrorHandler');
var WhiteList = require('./libs/core/Whitelist');
var authUtil = require('./libs/authUtil');
var appUtils = require('./libs/appUtils');
var logger = require('./libs/logger');

//var routes = require('./routes/index');
//var users = require('./routes/users');



logger.error("I am in app");

// init environment
var allowedEnv = ["development", "staging", "production"];
var env = config.util.getEnv('NODE_ENV');

if (lodash.includes(allowedEnv, env)) {
  console.info("NODE_ENV: %s", env);
} else {
  throw new Error(" Environment variable NODE_ENV must be one of [" + allowedEnv.join(",") + "]");
}

// init app
var app = express();
app.locals.title = config.get("server.name");
app.locals.host = config.get("server.host");
app.locals.port = config.get("server.port");
app.locals.env = env;
app.locals.config = config;
//app.use('/api/docs', express.static(path.join(__dirname + '/../apidoc')));
// make the API Router and mount it on '/api' path.
var apiRouter = new express.Router();
app.use('/api', apiRouter);
app.use('/public', express.static(path.join(__dirname + '/public')));
// enable CORS support
apiRouter.use(cors());


// serve docs on development
// if(app.locals.env === 'development' || app.locals.env === 'staging') {
//     docs.serve(apiRouter);
// }

// add api key verification for all routes
//apiRouter.use(authUtil.verifyApiKey);

// define white-listed routes
var whiteList = new WhiteList();
//whiteList.allow(config.get("Path.WhiteList_URLs"));
// use auth token verification for all routes except for those allowed in white-list
//whiteList.use(authUtil.verifyAuthToken);

apiRouter.use(whiteList.build());

// user json body parser
apiRouter.use(bodyParser.urlencoded({

  extended: true
}));
apiRouter.use(bodyParser.json({ limit: '2000kb' }));

// setup all other routes, and mount them on API router
Route.scanAll(path.join(__dirname, 'routes'), true).forEach(function (route) {
  route.mount(apiRouter);
});

// setup not found handler for requests un-served by any routes.
apiRouter.use(function (req, res, next) {
  next(ApiException.newNotFoundError('Request not handled.'));
});

// setup error handling
var errorHandler = new ErrorHandler(logger);
apiRouter.use(errorHandler.build());

// print when online
app.on('online', function () {
  console.info("%s online at %s:%s", app.locals.title, app.locals.host, app.locals.port);
});

// start listening app and emit the 'online' event.
app.listen(app.locals.port, function () { app.emit('online'); });


var createServer = function () {
  mongoose.Promise = Promise;
  //configure the promise
  Promise.config({
    // Enables all warnings except forgotten return statements.
    warnings: false,
    longStackTraces: false,
    // Enable cancellation.
    cancellation: true
  });

  // create server
  var server = http.createServer(app);
  //data base connection with promisifying it 
  var connectAsync = Promise.promisify(mongoose.connect, { context: mongoose });
  var listenAsync = Promise.promisify(server.listen, { context: server });

  connectAsync(config.get('mongodbUrl'))
    .then(function () {
      listenAsync(2121);
      // createCluster();
    })
    .then(function () {
      return console.info("Server online on port:" + JSON.stringify(server.address().port));
    })
    .catch(function (err) {
      throw err;
    });
}
/*
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

//bodyparser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());



logger.error("I am in app");
app.use('/crud', routes);

// setup not found handler for requests un-served by any routes.
app.use(function (req, res, next) {
  next(ApiException.newNotFoundError('Request not handled.'));
});


var errorHandler = new ErrorHandler(logger);
app.use(errorHandler.build());
*/

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
// HTTP Portion
var http = require('http');
// URL module
var url = require('url');
var path = require('path');
var request = require('request');
var exec = require('child_process').exec;


// Using the filesystem module
var fs = require('fs');

var server = http.createServer(handleRequest);
server.listen(8081);

var oscServer, oscClient;

var counter = 0;

function handleRequest(req, res) {
  // What did we request?
  var pathname = req.url;

  // If blank let's ask for index.html
  if (pathname == '/') {
    pathname = '/index.html';
  } else if (pathname == '/2') {
    pathname = '/receiver.html';
  }

  // Ok what's our file extension
  var ext = path.extname(pathname);

  // Map extension to file type
  var typeExt = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css'
  };

  // What is it?  Default to plain text
  var contentType = typeExt[ext] || 'text/plain';

  // User file system module
  fs.readFile(__dirname + pathname,
    // Callback function for reading
    function(err, data) {
      // if there is an error
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + pathname);
      }
      // Otherwise, send the data, the contents of the file
      res.writeHead(200, {
        'Content-Type': contentType
      });
      res.end(data);
    }
  );
}


console.log('Server started on port 8081');


var videoSeqsData = [];
var videoSeqName = "videoSeq";
var baseUrl = "https://api.instagram.com/v1/";
var users = "users/self/";
var search = "media/recent/?"
var access_token = "access_token=5383066242.450d69b.67b1608e087f4ab595094e7a7d5568da";

var cmdLine0 = "wget";
var cmdLine1 = "mv";
var fileFormat = ".mov";

var cmd = "wget https://scontent.cdninstagram.com/t50.2886-16/18113028_1180112165432220_7056533539642146816_n.mp4"
var cmd2 = "mv 18113028_1180112165432220_7056533539642146816_n.mp4 locationX.mp4"


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(server);
var osc = require('node-osc');
// var request = require('request');
// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection', function(socket) {
  // We are given a websocket object in our function
  console.log("We have a new client: " + socket.id);

  socket.on("config", function(obj) {
    oscServer = new osc.Server(obj.server.port, obj.server.host);
    oscClient = new osc.Client(obj.client.host, obj.client.port);


    oscClient.send('/status', socket.sessionId + ' connected');
   
    oscServer.on('/loadMovieIntoFolder', function(msg, rinfo) {
      // console.log(msg, rinfo);
      console.log("toDownlovide" + videoSeqsData);
      var i = msg;
      var splited = [];
      console.log('video' + videoSeqsData[0]);
      var insName = videoSeqsData[i].videoContent.url;
      splited = insName.split('/');
      var fileName = splited[splited.length - 1];
      var timecodeCreated = videoSeqsData[i].timecode;
      var cmd = cmdLine0 + ' ' + videoSeqsData[i].videoContent.url;
      var cmd1 = cmdLine1 + ' ' + fileName + ' ' + timecodeCreated + fileFormat;
      exec(cmd, function(error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
          // console.log('exec error: ' + error);
        } else {
          // console.log('video' + "is writing!!");
          exec(cmd1, function(error, stdout, stderr) {
            // console.log('stdout: ' + stdout);
            // console.log('stderr: ' + stderr);
            if (error !== null) {
              // console.log('exec error: ' + error);
            }
          });
        }
      });

    });

    oscServer.on('/toJStoPrepInitInsta', function(msg, rinfo) {
      var url = baseUrl + users + search + access_token;
      console.log(url);
      // console.log(url)
      var instObjArr = [];
      request(url, function(error, response, body) {
        var obj = JSON.parse(body);
        console.log("obj" + obj);
        // console.log('error:', error); // Print the error if one occurred 
        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
        // console.log('body:', body); // Print the HTML for the Google homepage. 
        if (obj.meta.code == 200) { // success
          for (var i = 0; i < obj.data.length; i++) {
            var instance = {};
            var thisVideoID = obj.data.length - 1 - i;
            instance.name = videoSeqName + thisVideoID;
            instance.videoID = obj.data.length - 1 - i;
            instance.videoTriggerIndex = null;
            instance.seqID = obj.data.length - 1 - i;//probable make it from comment #part_0(trigger part 0)
            instance.partTriggerIndex = null;

            instance.timecode = obj.data[i].created_time;
            instance.likes = obj.data[i].likes.count;
            if (obj.data[i].location !== null) {
              instance.locationX = obj.data[i].location.longitude;
              instance.locationY = obj.data[i].location.latitude
              instance.locationID = obj.data[i].location.id;
            }
            instance.tags = obj.data[i].tags; //array
            instance.videoContent = obj.data[i].videos.standard_resolution;
            videoSeqsData.push(instance);
          }
          // console.log("array" + instObjArr);
          // videoSeqsData = instObjArr;
          videoSeqsData.reverse();
        } else { // fail
          console.log("error");
        }
      });
      // console.log("videoMade", videoSeqsData)
    });

    oscServer.on('/toJStoInitInsta', function(msg, rinfo) {
      // console.log(msg, rinfo);
      console.log("videoSend" + videoSeqsData);
      socket.emit("initInstaFromMax", videoSeqsData);
    });

    oscServer.on('/getSeqsTimings', function(msg, rinfo) {
      // console.log(msg, rinfo);
      socket.emit("getSeqsTimingsFromMax", videoSeqsData);
    });

    oscServer.on('/toJS', function(msg, rinfo) {
      // console.log(msg, rinfo);
      socket.emit("fromMax", msg);
    });


  });

  socket.on("message", function(obj) {
    console.log(obj);
    oscClient.send(obj.address, obj.args);
    // if (obj.args.length >= 2) {
    //   for (var i = 0; i < obj.args.length; i++) {
    //     oscClient.send(obj.address, obj.args[i]);
    //   }
    // } else {
    //   oscClient.send(obj.address, obj.args);
    // }
  });

  socket.on('disconnect', function() {
    console.log("Client has disconnected");
  });

});
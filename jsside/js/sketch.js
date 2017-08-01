// var vSeqs = [];
var sqs = [];
var fps = 60;
var globalScaleVal = 2; // 1/2, 1/3

var rawJSONs = []; //put the json
var instaVideoInfo = []; //put the json
var videoSeqsRawData = [];
var videoSeqName = "videoSeq";

var timeSums;
var times = [];
var timings = [];
var positions = [];
var videoRoles = [];

var url;

//minx, miny, maxx, maxy
var brooklynBushwickArea = [-74.000645,40.711158,-73.980904,40.751093];
var newYorkSchoolArea = [];
var places = [];

var minx;
var miny;
var maxx;
var maxy;

var centerPos;
var initializedReady = false;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(fps);

  places = [brooklynBushwickArea, newYorkSchoolArea];
  minx = brooklynBushwickArea[0];
  miny = brooklynBushwickArea[3];
  maxx = brooklynBushwickArea[2];
  maxy = brooklynBushwickArea[1];
  centerPos = createVector(width / 2, height / 2);

  socket.on("fromMax", function() {
    console.log("hello");
  });

  socket.on("initInstaFromMax", function(obj) {
    videoSeqsRawData = obj;
    var sum = 0;
    var timing = 0;
    for (var i = 0; i < obj.length; i++) {
      if (i < obj.length - 1) {
        var thisTime = obj[i].timecode * 1000;
        var nextTime = obj[i + 1].timecode * 1000;
        var m = moment(thisTime);
        var m1 = moment(nextTime);
        timing = m1.diff(m);
        videoSeqsRawData[i].timing = timing;
        videoSeqsRawData[i].timeDate = m.format();
        sum = sum + timing;
        times.push(m);
        timings.push(timing);
      } else {
        var thisTime = obj[i].timecode * 1000;
        var m = moment(thisTime);
        timing = sum / obj.length - 1;
        videoSeqsRawData[i].timing = timing;
        videoSeqsRawData[i].timeDate = m.format();
        sum = sum + timing;
        times.push(m);
        timings.push(timing);
      }
    }
    timeSums = sum;
    // console.log(videoSeqsRawData);
  });

  socket.on("getSeqsTimingsFromMax", function() {
    sendBackToMaxToInitializeTimings(videoSeqsRawData);
    sendBackToMaxToInitializeJitter(videoSeqsRawData);
  });
  // loadJSON(url, parseJSONfromInsta);
  // sendBackToMaxToInitializeJitter(videoSeqsRawData);
}
//fromMaxToParse

function draw() {
  background(0);
  if (initializedReady) {

    for (var i = 0; i < videoSeqsRawData.length; i++) {
      fill(120);
      ellipse(videoSeqsRawData[i].locationInVec.x, videoSeqsRawData[i].locationInVec.y, 150, 100);
    }
  }
  // for(var i = 0; i < sqs.length; i++){
  //   sqs[i].render();
  // }
}

function keyPressed() {
  if (keyCode === 13) {
    // activate();
  }
  if (key === 1 || 2 || 3 || 4 || 5 || 6) {
    var ind = key - 1;
    // sqs[0].active = true;
    // sqs[0].activate();
  }
}

function mousePressed() { // make it the same as max parse timing = when socket is on
  // handleInstagramJSONFromMaxRequest();
}

function activate() {
  runThroughVseqsToGenerateSeqBox(vSeqs);

}

function sendBackToMaxToInitializeTimings(seqsVid) {
  //sums for timing emiting
  var insObjForSum = {
    address: '/seqTimingsSums',
    args: [{
      type: 'f',
      value: 0
    }]
  };
  insObjForSum.args[0].value = timeSums;
  socket.emit('message', insObjForSum);

  //group based timing emiting
  console.log(seqsVid);
  var insTags = [];
  var thisRole;
  for (var i = 0 ; i < seqsVid.length; i++){
    for(var j = 0; j < seqsVid[i].tags.length; j++){
      var insThisRole = seqsVid[i].tags[j];
      var spliteds = insThisRole.split('_');
      if(spliteds[0] !== "part" & spliteds[0] !== "presentation"){
        thisRole = seqsVid[i].tags[j];
      } // think about part_0 become triggering part in Max and videoseq_0 become video targetIndex in Max
    }
  insTags.push(thisRole);
  }
  var videoRoles = insTags.unique();
  console.log(videoRoles);

  
   for(var i = 0; i < videoRoles.length; i++){
    var count = 0;
     var insObjToSendTime = {
      address: '/seqTimings',
      args: []
    };

    var insObjToSendName = {
      address: '/seqTimings',
      args: []
    };

    var insObjForArgsName = {
      type: 'f',
      value: videoRoles[i]
    };
    insObjToSendName.args.push(insObjForArgsName);
    socket.emit('message', insObjToSendName);

    for(var j = 0; j < seqsVid.length; j++){
      for(var k = 0; k < seqsVid[j].tags.length; k++){
        if(videoRoles[i] == seqsVid[j].tags[k]){
          var insArg0 = {};
          var insArg1 = {};
          var insArg2 = {};
          var insArg3 = {};
          insArg0.type = 'i';
          insArg0.value = count;

          insArg1.type = 'f';
          insArg1.value = seqsVid[j].timing;

          insArg2.type = 'i';
          insArg2.value = seqsVid[j].seqID;

          insArg3.type = 'i';
          insArg3.value = seqsVid[j].likes;
          // console.log(seqsVid[i].timing);
          insObjToSendTime.args.push(insArg0);
          insObjToSendTime.args.push(insArg1);
          insObjToSendTime.args.push(insArg2);
          insObjToSendTime.args.push(insArg3);
          count++;
        }
      }
    }
    console.log(insObjToSendTime);
    socket.emit('message', insObjToSendTime);
    doneObj = {
      address: '/doneSending',
      args: [{
        type: 'i',
        value: 0
      }]
    }
    socket.emit('message', doneObj);
 }

  // var insObj = {
  //   address: '/seqTimings',
  //   args: []
  // };
  // for (var i = 0; i < seqsVid.length; i++) {
  //   var thisArg = {};
  //   thisArg.type = 'f';
  //   thisArg.value = seqsVid[i].timing;

  //   insObj.args[i] = thisArg;
  // }
  // console.log(insObj);
  // socket.emit('message', insObj);
}

function sendBackToMaxToInitializeJitter(seqsVid) {
  var insObj = {
    address: '/seqVidPositions',
    args: []
  };
  for (var i = 0; i < seqsVid.length; i++) {
    if (seqsVid[i].locationID) {
      var thisScaledX = map(seqsVid[i].locationX, minx, maxx, 0, width);
      var thisScaledY = map(seqsVid[i].locationY, miny, maxy, 0, height);
      var thisScaledXForJitter = map(thisScaledX, 0, width, -1, 1);
      var thisScaledYForJitter = map(thisScaledY, 0, height, -1, 1);
      var thisVidPos = createVector(thisScaledX, thisScaledY);
      var thisJitterPos = createVector(thisScaledXForJitter, thisScaledYForJitter);
      videoSeqsRawData[i].locationInVec = thisVidPos;
      videoSeqsRawData[i].locationInVecForJitter = thisJitterPos;
      positions.push(thisVidPos);
    } else {
      videoSeqsRawData[i].locationInVec = centerPos;
      videoSeqsRawData[i].locationInVecForJitter = createVector(0, 0);
      positions.push(centerPos);
    }
  }
  for (var i = 0; i < videoSeqsRawData.length; i++) {
    var thisXY = videoSeqsRawData[i].locationInVecForJitter.x + "/" + videoSeqsRawData[i].locationInVecForJitter.y;
    // console.log(thisXY);
    var thisArg = {};
    thisArg.type = 'f';
    thisArg.value = thisXY;

    insObj.args[i] = thisArg;
  }
  socket.emit('message', insObj);
  initializedReady = true;
  // console.log(videoSeqsRawData);
}




Array.prototype.contains = function(v) {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === v) return true;
    }
    return false;
};

Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr; 
}
var vSeqs = [];
var vidSeqObj;
var partObj;
var thisPartWithNote;

var insRawPartData;
var insWholePartsData;

var insRawShotData
var insWholeShotsData;
var insShotsNumInDetail;

var previous = 0;
var thisTriggerPartNo;
var initialScalingValue = 0.5;

function fromMaxToParse(obj) {
  count = 0;
  if (obj.length > 4) {
    if (obj[1] === "listForParts") { //------------------------------------------------------4
      var onePartInfo = [];
      for (var i = 2; i < obj.length; i++) {
        onePartInfo.push(obj[i]);
      }
      //finc to get each property from rawdata
      insRawPartData = onePartInfo;
      insWholePartsData.push(onePartInfo);
      partObj.rawData = insRawPartData;
    } else if (obj[1] === "listForShots") { //-------------------------------------------------------------------7
      var oneShotInfo = [];
      for (var i = 2; i < obj.length; i++) {
        oneShotInfo.push(obj[i]);
      }
      insWholeShotsData.push(oneShotInfo);
      partObj.wholeData = [];
      partObj.wholeData = insWholeShotsData;
      insShotsNumInDetail.push(insWholeShotsData);
      vidSeqObj.shotsNumInDetail = insShotsNumInDetail;
      //finc to get each property from rawdata
      // crapppppp!!! vidSeqObj.thisTirggerPartNumber.part = partObj;
      // vidSeqObj[] = [];
    }

  } else if (obj.length == 3) {
    if (obj[1] === "seqLength") { //----------------------------------------------2
      var len = obj[2] + 1;
      var propName = "len"; //obj[1];
      vidSeqObj[propName] = len; //length
    } else if (obj[1] === "partLength") { //---------------------------------------------------------------6
      var len2 = obj[2] + 1;
      var propName2 = "len"; //obj[1];
      partObj[propName2] = len2;
    } else { //--------------------------------------------------------------------------3
      // vidSeqObj.wholeData = insWholePartsData;
      partObj = {};
      thisPartWithNote = {};
      // debugger;
      var baseString = obj[1];
      var thisInd = obj[2];
      thisTriggerPartNo = baseString + obj[2];

      // if (previous != thisInd) {
      //   // console.log(previous);
      //   var previousTriggerPartNo = baseString + previous;
      //   // var previousTriggerPartNo = thisTriggerPartNo
      //   vidSeqObj.triggerParts.push(partObj);
      //   vidSeqObj[previousTriggerPartNo] = partObj;
      //   console.log(previousTriggerPartNo);
      //   // debugger;
      //   previous = thisInd;
      // }
      // vidSeqObj[thisTriggerPartNo] = {};
    }

  } else if (obj.length == 4) {
    if (obj[1] === "recStart") { //------------------------------------1
      // vidSeqObj = {
      //   'triggerParts': []
      // };
      // partObj = {};
      vidSeqObj = {};
      insWholePartsData = [];
      insShotsNumInDetail = []
      vidSeqObj.name = obj[2]; //name- videoSeq~
      vidSeqObj.id = count; //obj[3];
      vidSeqObj.triggerIndex = obj[3];
      vidSeqObj.pos = createVector(random(1000), random(700));
      // vidSeqObj.triggerParts = [];
      count++;
    } else if (obj[1] === "recEnd") {
      // vidSeqObj.wholeData = insWholePartsData;
      // var thisseqWithParts = addingTriggerTimingFromObjItself(vidSeqObj, "part");
      var thisseqWithParts = addingTriggersNoteFromObjItself(vidSeqObj, "part");
      // console.log(thisseqWithParts);
      console.log(thisseqWithParts);
      vSeqs.push(thisseqWithParts);
      vidSeqObj = {};
      insWholePartsData = [];
      insWholeShotsData = [];
      insShotsNumInDetail = [];
    }

  } else if (obj.length == 2) { //-----------------------------------------------------------------5
    if (obj[1] !== "partDone") {
      insWholeShotsData = [];
      var name = obj[1]
      partObj.name = name;

    } else { //-----------------------------------------------------------------7'
      thisPartWithNote = addingTriggersNoteFromObjItself(partObj, "note");
      // console.log(thisPartWithNote);
      vidSeqObj[thisTriggerPartNo] = thisPartWithNote;
      vidSeqObj.wholeData = insWholePartsData;
      // var thisSeqWithParts = addingTriggersNoteFromObjItself(vidSeqObj, "part");
      // vidSeqObj.triggerParts.push(thisPartWithNote);
    }
  }
}

function addingTriggersNoteFromObjItself(obj, _note) {
  var appendWord0;
  var appendWords0;
  var appendWord1;
  var appendWords1;
  var onlyNote = false;
  if (_note === "part") {
    appendWord0 = "Part";
    appendWords0 = "Parts";
    appendWord1 = "Note";
    appendWords1 = "Notes";
    onlyNote = false;
  } else if (_note === "note") {
    appendWord0 = "Note";
    appendWords0 = "Notes";
    appendWord1 = "Part";
    appendWords1 = "Parts";
    onlyNote = true;
  }

  // if (note === "part") {
  // var triggervel = "triggerVel" + appendWords1;
  // obj.timeBefTrigger = obj.rawData[0]; //summary of previous
  // obj.timeAftTrigger = obj.rawData[0];
  // obj.noteOnLengthonTriggering = obj.rawData[3];
  // obj[triggervel] = obj.rawData[2];
  // obj.rawData = obj.rawData;
  // } else {
  var triggersPartsNotes = "triggers" + appendWords0;
  obj[triggersPartsNotes] = [];

  var triggerindex = "triggerIndex" + appendWord0;
  var triggeringvel = "triggeringVel " + appendWord0;
  var finalSum;
  for (var i = 0; i < obj.wholeData.length; i++) {
    var currentSum;
    var previousSum = 0;
    var thisTriggerNoIndex = "triggerNo" + i;
    var insObj = {};
    if (!onlyNote) {
      // console.log(obj);
      insObj = obj[thisTriggerNoIndex];
      // console.log(insObj);
      // insObj.name = obj[thisTriggerNoIndex].name;
    } else {
      insObj.id = i;
      insObj.name = appendWord0 + obj.wholeData[i][1]; //.rawData[1];
    }
    insObj[triggerindex] = obj.wholeData[i][1]; //.rawData[1];
    if (i > 0) {
      currentSum = obj.wholeData[i - 1][0] + previousSum;
      insObj.timeBefTrigger = currentSum; //.rawData[0]; //summary of previous
      previousSum = currentSum;
      finalSum = currentSum + obj.wholeData[i][0];
    } else if (i === 0) {
      currentSum = 0;
      insObj.timeBefTrigger = currentSum;
      previousSum = currentSum;
    }
    insObj.timeAftTrigger = obj.wholeData[i][0]; //.rawData[0];
    insObj.noteOnLengthonTriggering = obj.wholeData[i][3]; //.rawData[3]
    insObj.triggeringvel = obj.wholeData[i][2]; //.rawData[2];
    insObj.rawData = obj.wholeData[i]; //.rawData;
    obj[thisTriggerNoIndex] = insObj;
    obj[triggersPartsNotes].push(insObj);
  }
  obj.lengthInTime = finalSum;
  // }
  return obj;
}

function runThroughVseqsToGenerateSeqBox(vseqs) {
  for (var i = 0; i < vseqs.length; i++) {
    var thisSeqBox = new SeqBox(vseqs[i]);
    sqs.push(thisSeqBox);
  }
}
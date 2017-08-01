var part0 = [
  [740, 0, 95, 199],
  [440, 1, 95, 148]
];
var part1 = [
  [840, 2, 95, 199],
  [640, 1, 95, 148]
];

var videoSeq0 = [
  [840, 4, 95, 199],
  [640, 5, 95, 148]
];

var incomingObj = ["fromMax", 415, 0, 95, 194];

var vSeqs = [];
var videoSeq0 = seqModel0;
vSeqs.push(videoSeq0);

seqModel0 = {
  thisSeqName: "videoSeq0",
  thisSeqLength: 2,

  thisTriggerPartNo0: { //PartModel
    number: 0,
    partName: "sample0:part0",
    partModel: partModel0,
    triggerIndex: 4, //0~3=note - 0~listOfAllPartsToRefer.length
    timeBefTrigger: 0,
    timeAftTrigger: 990,
    noteOnLengthonTriggering: 25,
    triggeringPartVel: 95,
    partModelInDetailWithThis: {
      thisPartName: "sample0:part0",
      thisPartLength: 3,
      tirggerNo0: {},
      triggerNo1: {},
      rawdataInThisPart: []
    },
    rawData: [990, 4, 95, 25],
  },

  triggerPartNo1: {

  },

  rawDataInThisSeq: [
    [990, 4, 95, 25],
    [],
    []
  ]
}


partModel0 = {
  thisPartName = "sample0:part0",
    thisPartLength = 3,
    thisTirggerNo0: { //:noteModol
      number: 0,
      noteName: "note1",
      triggerIndex: 1, //0~3=note - 0~listOfAllPartsToRefer.length
      timeBefTrigger: 1,
      timeAftTrigger: 200,
      noteOnLengthonTriggering: 10,
      triggeringPartVel: 95,
      rawData: [200, 0, 95, 10],
    },
    thisTriggerNo1: {
      number: 1,
      name: "note0",
      triggerIndex: 0, //0~3=note - 0~listOfAllPartsToRefer.length
      timeBefTrigger: 200,
      timeAftTrigger: 300,
      noteOnLengthonTriggering: 20,
      triggeringPartVel: 95,
      rawData: [300, 2, 95, 20]
    }
  thisTriggerNo2: {
      number: 2,
      name: "note1",
      triggerIndex: 1, //0~3=note - 0~listOfAllPartsToRefer.length
      timeBefTrigger: 500,
      timeAftTrigger: 100,
      noteOnLengthonTriggering: 10,
      triggeringPartVel: 95,
      rawData: [140, 1, 95, 10]
    },

    rawDataInThisPart: [
      [300, 1, 95, 10],
      [300, 0, 95, 20],
      [240, 1, 95, 10]
    ]
}

noteModel = {
  name: "note0",
  triggerIndex: 0, //0~3=note - 0~listOfAllPartsToRefer.length
  timeBefTrigger: 0,
  timeAftTrigger: 200,
  noteOnLengthonTriggering: 10,
  triggeringPartVel: 95
}
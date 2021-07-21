
function write_result(pResult,pid) {
  pid = pid || "result0";
  var vNode = document.getElementById(pid);
  if (vNode) {
    //console.log("vNode defined");
    vNode.innerHTML = pResult;
  } else {
    console.error("ERROR in write_result(): vNode undefined");
  }
}



function Thread4JS() {

  var self = this;
  // step in milliseconds
  this.beat_array = null;
  this.visual_count = 4;
  this.el = null;
  this.i_start = 0;
  this.time_start = 0;
  this.time_stop = 0;
  this.step_start = 0;
  this.step_stop = 0;
  this.i_loops = 0;
  this.i_step = 1;
  this.i_stop = 1000;
  this.run_flag = false;

  //------ INIT ----------------
  this.init = function (pDoc) {
    this.aDoc = pDoc;
  };
  //----- START ----------------
  this.start = function (pPrefix) {
    this.visual_count = parseInt(getValueDOM("countInput")) || 4;
    this.beat_array = get_timer_beat_array();
    this.time_start = Date.now();
    this.i_loops = this.i_start;
    this.run_flag = true;
    this.loop(pPrefix);
  };

  //----- STOP -----------------
  this.stop = function() {
    console.log("Thread4JS stopped");
    //this.i_loops = this.i_stop + 1;
    this.run_flag = false;
    this.on_stop();
  };

  //----- ON STOP DO THIS -------
  this.on_stop = function () {
    this.time_stop = Date.now();
    console.log("Timer started at " + this.time_start + "\nTimes stopped at " + this.time_stop);
  };

  //------ RUN CONDITION TEST--------
  this.run_condition = function () {
    var vReturn = ((this.i_loops < this.i_stop) && (this.run_flag == true));
    console.log("vReturn run_condition = "+vReturn);
    return vReturn;
  };

  //----- LOOP FUNCTION ---------
  // with do() call and run condition test
  this.loop = function (pPrefix) {
    this.step_start = Date.now();
    var out = this.do(pPrefix," - Start: " + this.step_start);
    this.step_stop = Date.now();
    out += " - Stop:" +  this.step_stop;
    //write_result(out);
    /*
    if (this.i_loops % 250 == 0) {
      write_result(out);
    }
    */
    //Continue execution
    var timer_delay = get_timer_delay(this.beat_array);
    if(this.run_condition() == true) {
      setTimeout(function () { self.loop(pPrefix); }, timer_delay);
    } else {
      this.on_stop();
    }
  };


  //------ DO 2 ----------------
  this.do2 = function(pPrefix,pPostfix) {
    this.i_loops += this.i_step;
    return this.i_loops;
  };

  //------ DO ----------------
  this.do = function(pPrefix,pPostfix) {
    pPostfix = pPostfix || " - ";
    this.i_loops += this.i_step;
    if (this.i_loops < 500) {
      pPrefix = " LOW  ";
    } else {
      pPrefix = " HIGH ";
    }
    playAudio();

    var beat_visual = (this.i_loops % this.visual_count) + 1;
    highlight_visual_beat(beat_visual);

    return pPrefix + "- Loops " + this.i_loops + pPostfix;
  };



  return this;
}

//document.getElementById("result0").innerHTML = "TEST DATA";
//var t4j = new Thread4JS();
//t4j.init(document);
//t4j.start("Bert");

var myVar = setInterval(myTimer, 1000);

function myTimer() {
  var d = new Date();
  var t = d.toLocaleTimeString();
  document.getElementById("timerout").innerHTML = t;
}

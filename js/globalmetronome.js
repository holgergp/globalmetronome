
function write_result(pResult,pid) {
  pid = pid || "result0";
  this.vNode = document.getElementById(pid);
  if (vNode) {
    //console.log("vNode defined");
    vNode.innerHTML = pResult;
  } else {
    console.error("ERROR in write_result(): vNode undefined");
  }
}



function GlobalMetronome() {
  // called in "metronome.js" l133 init() method
  var self = this;
  // step in milliseconds
  this.beat_array = null;
  this.timer_delay = 0;
  this.visual_count = 4;
  this.latency = 0;
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

  // Volumes of Metronome4JS
  this.masterVolume = 0.5;
  this.accentVolume = 1.0;
  this.quarterVolume = 0.75;
  this.decreasingVolume = 1.0;
  this.eighthVolume = 0.0;
  this.sixteenthVolume = 0.0;
  this.tripletVolume = 0.0;


  //------ INIT ----------------
  this.init = function (pDoc) {
    this.aDoc = pDoc;
  };
  //----- START ----------------
  this.start = function (pPrefix) {
    pPrefix = pPrefix || "";
    this.visual_count = parseInt(getValueDOM("countInput")) || 4;
    this.beat_array = get_timer_beat_array();
    this.time_start = Date.now();
    this.i_loops = this.i_start;
    this.run_flag = true;
    pPrefix += "Start Time=" + this.time_start + ")";
    this.loop(pPrefix);
  };

  //----- STOP -----------------
  this.stop = function() {
    console.log("Thread4JS stopped");
    //this.i_loops = this.i_stop + 1;
    this.i_loops = -1;
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
    //console.log("vReturn run_condition = "+vReturn);
    return vReturn;
  };

  //----- LOOP FUNCTION ---------
  // with do() call and run condition test
  this.loop = function (pPrefix) {
    pPrefix = pPrefix || "";
    this.step_start = Date.now();
    if (this.i_loops < 1) {
      this.i_loops = get_start_loop (this.beat_array);
    }
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
    var vLatency = parseInt(this.latency);
    //console.log("Latency="+vLatency);
    this.timer_delay = get_timer_delay(this.beat_array,vLatency);
    //this.timer_delay = this.latency;
    if (this.run_condition() == true) {
      setTimeout(function () { self.loop(pPrefix); }, this.timer_delay);
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
    this.beat4measure = (this.i_loops % this.visual_count) + 1;
    //console.log("this.do() i_loops="+this.i_loops);
    //this.master_volume = getValueDOM();
    if (getValueDOM("sMasterVolume") > 0) {
      if (this.beat4measure === 1) {

        playAudio(this.masterVolume * this.accentVolume);
      } else {
        // calculate convex combination for volume;
        if (getValueDOM("sQuarterVolume") > 0) {
          var vol_start = this.quarterVolume;
          var vol_end = this.quarterVolume * this.decreasingVolume;
          var t = (this.beat4measure)/this.visual_count;
          var volume = (1-t) * vol_start + t * vol_end;
          write_result("volume="+volume);
          playAudio(this.masterVolume * volume);
        }
      }
    }
    //playAudio(1/beat4measure);
    highlight_visual_beat(this.beat4measure);

    return pPrefix + "- Loops " + this.i_loops + pPostfix;
  };



  return this;
}

//document.getElementById("result0").innerHTML = "TEST DATA";
//this.t4j = new Thread4JS();
//t4j.init(document);
//t4j.start("Bert");

/*
this.myVar = setInterval(myTimer, 1000);

function myTimer() {
  this.d = new Date();
  this.t = d.toLocaleTimeString();
  document.getElementById("timerout").innerHTML = t;
}

*/

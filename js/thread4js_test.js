
function write_result(pResult) {
  var vNode = document.getElementById("result0");
  if (vNode) {
    //console.log("vNode defined");
    vNode.innerHTML = pResult;
  } else {
    console.error("ERROR in write_result(): vNode undefined");
  }
}

function Thread4JS() {
  var self = this;
  this.el = null;
  this.i_start = 0;
  this.time_start = 0;
  this.time_stop = 0;
  this.i_loops = 0;
  this.i_step = 1;
  this.i_stop = 1000;
  this.run_flag = false;

  this.init = function (pDoc) {
    this.aDoc = pDoc;
  };

  this.do2 = function(pPrefix) {
    this.i_loops += this.i_step;
  };

  this.do = function(pPrefix) {
    this.i_loops += this.i_step;
    if (this.i_loops < 500) {
      pPrefix = " Low ";
    }
    if (this.i_loops % 10 == 0) {
      playAudio();
    }
    write_result(" Loops " + this.i_loops);
    /*
    if (this.aDoc) {
      var doc = this.aDoc;
      var vNode = doc.getElementById("result0");
      if (vNode) {
        //console.log("vNode defined");
        vNode.innerHTML = " Loops " + this.i_loops;
      } else {
        console.error("vNode undefined");
      }
    } else {
      console.error("document undefined");
    }
    */
  };

  this.run_condition = function () {
    var vReturn = ((this.i_loops < this.i_stop) && (this.run_flag == true));
    console.log("vReturn run_condition = "+vReturn);
    return vReturn;
  };

  this.start = function (pPrefix) {
    this.time_start = Date.now();
    this.i_loops = this.i_start;
    this.run_flag = true;
    this.loop(pPrefix);
  };

  this.on_stop = function () {
    this.time_stop = Date.now();
    alert("Timer started at " + this.time_start + "\nTimes stopped at " + this.time_stop);
  }

  this.loop = function (pPrefix) {
    this.do(pPrefix);
    //Continue execution
    if(this.run_condition() == true) {
      setTimeout(function () { self.loop(pPrefix); }, 0);
    } else {
      this.on_stop();
    }
  };

  this.stop = function() {
    console.log("Thread4JS stopped");
    //this.i_loops = this.i_stop + 1;
    this.run_flag = false;
    this.on_stop();
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

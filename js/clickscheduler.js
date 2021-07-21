function math_minus (pNum1,pNum2) {
	var pMinusNum2 = math.multiply(math.bignumber(-1),pNum2);
	var diff = math.add(pNum1,pMinusNum2);
	return diff;
}

function math_is_lower(pNum1,pNum2) {
	// e.g.  pNum1 = 130     pNum2 = 50
	// checking 130 < 50 (return false)
	var ret = true;
	//alert("pNum1="+pNum1+" pNum2="+pNum2);
	var pMinusNum1 = math.multiply(math.bignumber(-1),pNum1);
	var diff = math.add(pNum2,pMinusNum1);
	// diff = 50-130 = -80
	var diff_char = (""+diff)[0];
	if (diff_char == "-") {
		// diff_char = "-"
		// diff = -80 for "130 < 50"
		ret = false;
	} else {
		// diff_char = "8"
		// diff = 80 for "50 < 130"
		ret = true;
	}
	//alert("diff_char="+diff_char+" diff="+diff);
	return ret;
}

function get_beat_modulo_array() {
	//var audio = new Audio("test.wav");
	// audio.volume = 0.2;
	var bpmInput = getValueDOM("bpmInput");
	var count = getValueDOM("countInput");
	count = parseInt(""+count+"");
	bpmInput = parseInt(""+bpmInput+"");
	var beat_modulo_array = [];
 	//alert("BPM: "+bpmInput);
	// bpmInput is beats per minute
	// 1 msec smallest time unit
	// 1 sec = 1000 msec
	// 1 min = 60000 msec
	// 1 beat = round(60000/bpmInput)
	//math.divide(math.bignumber(0.3), math.bignumber(0.2))

	//beat_array[0] - single beat
	beat_modulo_array.push(1);
	//beat_array[1] - 121bpm 121 % 4 = 1
	beat_modulo_array.push( 0 );
	//beat_array[2] - measure (bma[1] * count) % 4
	beat_modulo_array.push( (bpmInput % count) );
	//beat_array[2] - hour (bma[1] * 60) % 4
	beat_modulo_array.push( ((beat_modulo_array[2] * 60) % count) );
	//beat_array[3] - day (bma[2] * 24) % 4)
	beat_modulo_array.push( ((beat_modulo_array[3] * 24) % count) );
	//beat_array[4] - year (bma[3] * 365) % 4)
	beat_modulo_array.push( ((beat_modulo_array[4] * 365) % count) );
	//beat_array[5]  - decade (bma[4] * 10) % 4)
	beat_modulo_array.push( ((beat_modulo_array[5] * 10) % count) );

	return beat_modulo_array;
}

function get_timer_beat_array() {
	//var audio = new Audio("test.wav");
	// audio.volume = 0.2;
	var bpmInput = getValueDOM("bpmInput");
	var count = getValueDOM("countInput");
	count = parseInt(""+count+"");
	bpmInput = parseInt(""+bpmInput+"");

	//alert("BPM: "+bpmInput);
	// bpmInput is beats per minute
	// 1 msec smallest time unit
	// 1 sec = 1000 msec
	// 1 min = 60000 msec
	// 1 beat = round(60000/bpmInput)
	//math.divide(math.bignumber(0.3), math.bignumber(0.2))

	//beat_array[0]
	var beat_length = math.bignumber(math.round(60000/bpmInput, 0));
	//beat_array[1]
	var beat_measure = math.multiply( math.bignumber(beat_length) , math.bignumber(count) );
	//beat_array[2]
	var beat_minute = math.multiply( math.bignumber(beat_measure) , math.bignumber(15) );
	//beat_array[3]
	var beat_hour   =  math.multiply(math.bignumber(beat_minute),  math.bignumber(60) );
	//beat_array[4]
	var beat_day    =  math.multiply(math.bignumber(beat_hour),    math.bignumber(24) );
	//beat_array[5]
	var beat_year   =  math.multiply(math.bignumber(beat_day),     math.bignumber(365) );
	//beat_array[6]
	var beat_decade =  math.multiply(math.bignumber(beat_year),    math.bignumber(10) );

	return [beat_length, beat_measure, beat_minute, beat_hour, beat_day, beat_year, beat_decade];
}

function get_start_iteration_beat (pBeatArray,pBeatIndex) {
	var beat_index = pBeatIndex || 0;
	var beat_array = pBeatArray || get_timer_beat_array();
	//var beat_modulo_array = pBeatModuloArray || get_beat_modulo_array();

	var zero = new math.bignumber(0);
	var start_beat = new math.bignumber(0);
	var next_beat = new math.bignumber(0);;
	var now = Date.now();;
	//var now_str = " "+now;
	var stop_threshold = math.bignumber(now);
	//stop_threshold = math.bignumber("500")
	//var i = 5;
	var k = 0;
	for (var i = 6; i >= beat_index; i--) {
		// iterate from decade, year, ... down milliseconds per beat
		while ( (k<500) && (math_is_lower(start_beat,stop_threshold) == true) ) {
			k++;
			//alert("("+k+") bool=" + math_is_lower(start_beat,stop_threshold) + " stop_threshold="+stop_threshold+"\nPRE now="+now+ " start_beat="+start_beat);
			next_beat = math.add(start_beat,zero);
			start_beat = math.add(start_beat,beat_array[i]);
		};
		start_beat = next_beat;
		//console.log("i=" + i + " beat_array[" + i + "]=" + beat_array[i] + "\n beat_modulo_array[" + i + "]=" + beat_modulo_array[i] +"\n now="+now+ "\nnext_beat="+next_beat+ " bool = "+ math_is_lower(start_beat,stop_threshold) )
	}
	return start_beat
}

function get_start_beat (pBeatArray) {
	return get_start_iteration_beat (pBeatArray,0);
}

function get_start_measure (pBeatArray) {
	return get_start_iteration_beat (pBeatArray,1);
}

function get_start_loop (pBeatArray) {
	// start at last begin of measure
	var start_beat =	get_start_measure(pBeatArray);
	var beat_array = pBeatArray || get_timer_beat_array();
	var beat_length = beat_array[0];
	var now = Date.now();;
	//var now_str = " "+now;
	var stop_threshold = math.bignumber(now);

	var i_loop = 0;
	while ( (i_loop<500) && (math_is_lower(start_beat,stop_threshold) == true) ) {
	  i_loop++;
		// count the number of beats until now
		//alert("("+k+") bool=" + math_is_lower(start_beat,stop_threshold) + " stop_threshold="+stop_threshold+"\nPRE now="+now+ " start_beat="+start_beat);
		start_beat = math.add(start_beat,beat_length);
	};

	return i_loop;
}

function get_next_beat(pBeatArray,pStartBeat) {
	var beat_array = pBeatArray || get_timer_beat_array();
	var start_beat = pStartBeat || get_start_beat();
	// var now = Date.now();
	//var stop_threshold = math.bignumber(now);
	var next_beat = math.add(beat_array[0],start_beat);
	return next_beat;
}

function get_timer_delay(pBeatArray,pLatency) {
	var beat_array = pBeatArray || get_timer_beat_array();
	var latency = pLatency || 0;

	var now = Date.now();
	var math_now = math.bignumber(now);
	var math_latency = math.bignumber(latency);
	math_now = math_minus (math_now,math_latency);
	var next_beat = get_next_beat();
	var diff = math_minus (next_beat,math_now);
	var timer_delay = parseInt(""+diff+"");
	//alert("delay of timer="+timer_delay);
	return timer_delay;
}

function get_timer_info() {
	var now = Date.now();
	var math_now = math.bignumber(now);
	var beat_array = get_timer_beat_array();
	var next_beat = get_next_beat();
	var timer_delay = get_timer_delay();
	var diff = math_minus (next_beat,math_now);
	//next_beat = math.add(beat_array[0],start_beat);
	alert("POST now="+now+ "\n next_beat="+next_beat +" diff="+diff+"\nmeasure_start="+get_start_measure()+"\nbeat_start="+get_start_beat() +" i_loop="+get_start_loop () + "\nbeat_length="+beat_array[0]);
	/*
		math_is_lower(beat_array[0],beat_array[1]);
	 math_is_lower(beat_array[1],beat_array[0]);

	 var bool = math.parse("30>5");
	 bool = {"mathjs":"OperatorNode","op":"<","fn":"smaller","args":[{"mathjs":"ConstantNode","value":3},{"mathjs":"ConstantNode","value":5}],"implicit":false}
	 alert(JSON.stringify(bool));
 	*/
	el("result1").innerHTML = "beat_length=" + beat_array[0] + " beat_minute=" + beat_array[1] + " beat_decade="+beat_array[5];

}

/*

var timerID=null;
var interval=100;

self.onmessage=function(e){
	if (e.data=="start") {
		console.log("starting");
		timerID=setInterval(function(){postMessage("tick");},interval);
	}
	else if (e.data.interval) {
		console.log("setting interval");
		interval=e.data.interval;
		console.log("interval="+interval);
		if (timerID) {
			clearInterval(timerID);
			timerID=setInterval(function(){postMessage("tick");},interval);
		}
	}
	else if (e.data=="stop") {
		console.log("stopping");
		clearInterval(timerID);
		timerID=null;
	}
};

postMessage('hi there');
*/

function Audio4Clicker() {
  this.audio_click = null;

  this.init = function(pAudio) {
    this.audio_click = pAudio;
  };

  this.play = function(pVolume) {
    //var x = document.getElementById("myAudio");
    var volume = pVolume || 1.0;
    this.audio_click.volume = volume;
    var promise = audio_click.play();
    if (promise !== undefined) {
        promise.then(_ = function () {
            // Autoplay started!
        }).catch(error = function () {
          console.log("Autoplay method is not necessary for using the Javascript Offline Metronome");
        });
    }
  };

  this.pause = function() {
    //var x = document.getElementById("myAudio");
    var promise = audio_click.pause();

    if (promise !== undefined) {
        promise.then(_ = function () {
            // Autoplay started!
        }).catch(error = function () {
          console.log("Autoplay method is not necessary for using the Javascript Offline Metronome");
            // Autoplay was prevented. Show a "Play" button so that user can start playback.
        });
    }

  };

  
}

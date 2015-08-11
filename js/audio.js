var Audio = (function(audioContext){

	// Status
	var status = {ready: "ready", 
				error: "error"};

	if (!audioContext) {
		return {status: status.error};
	}

	// Morse config
	var timeReference = 0.05; 			//seconds
	var dotDuration = timeReference;	// .
	var lineDuration = dotDuration * 3;	// -
	var symbolSpaceDuration = dotDuration;
	var patternSpaceDuration = dotDuration * 2;
	var wordSpaceDuration = dotDuration * 4;

	// Audio config
	audioContext = new audioContext();
	var oscillatorConfig = {
		type: "sine",
		frequency: 880
	};

	var getDurationFromSymbol = function(symbol){
		switch(symbol){
			case '.': return dotDuration;
			case '-': return lineDuration;
			default: break;
		}
		return 0.0;
	};

	var getNewOscillator = function(){
		var o = audioContext.createOscillator();
		o.type = oscillatorConfig.type;
		o.frequency.value = oscillatorConfig.frequency;
		o.connect(audioContext.destination);
		return o;
	};
	
	var playSymbol = function(when,symbolDuration){
		var o = getNewOscillator();
		var duration = when + symbolDuration;
		o.start(when);
		o.stop(duration);
	};

	var play = function(morse){
		var time = audioContext.currentTime;

		// List of words in morse
		var words = morse.split('  ');

		// Iterate over words
		words.forEach(function(word){
			word = word.trim().split(' ');
			
			// Iterate over pattern
			word.forEach(function(pattern){

				// Iterate over symbols
				Array.prototype.forEach.call(pattern,function(symbol){
					var symbolDuration = getDurationFromSymbol(symbol);
					playSymbol(time,symbolDuration);
					time += symbolDuration + symbolSpaceDuration;
				});

				time += patternSpaceDuration;
				
			});

			time += wordSpaceDuration;
		});

		
	};

	return {status: status.ready,
		play: play};
	
})(window.AudioContext||window.webkitAudioContext);
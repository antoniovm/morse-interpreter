navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                      navigator.mozGetUserMedia || navigator.msGetUserMedia;

var Audio = (function(audioContext,navigator,Morse){

	// Status Codes
	var statusCodes = {ready: "Load success", 
				audioContextError: "Error obtaining AudioContext",
				getUserMediaError: "Error obtaining getUserMedia",
				morseError: "Error obtaining Morse module"};

	// Current status
	var status = statusCodes.ready;

	if (!audioContext) {
		return {status: statusCodes.audioContextError};
	}

	if (!Morse) {
		return {status: statusCodes.morseError};
	};

	if (!navigator.getUserMedia) {
		status = statusCodes.getUserMediaError;	
	};

	// Morse config
	var timeReference = Morse.getConfig().timeReference / 1000.0;	//seconds
	var dotDuration = timeReference;								// .
	var lineDuration = dotDuration * 3;								// -
	var symbolSpaceDuration = dotDuration;
	var patternSpaceDuration = dotDuration * 2;
	var wordSpaceDuration = dotDuration * 4;

	// Audio config
	audioContext = new audioContext();
	var oscillatorConfig = {
		type: "sine",
		frequency: 880
	};

	var playing = false;

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

	var processInput = function(event){
		var frame = event.inputBuffer.getChannelData(0);
		return;
	};

	var play = function(morse){
		if (playing) {
			return;
		};

		playing = true;

		var time = audioContext.currentTime;
		var morseSymbols = Morse.getConfig().symbols;

		// List of words in morse
		var words = morse.split(morseSymbols.wordDelimiter);

		// Iterate over words
		words.forEach(function(word){
			word = word.trim().split(morseSymbols.charDelimiter);
			
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

		// Trim silence timing
		time -= (wordSpaceDuration + patternSpaceDuration + symbolSpaceDuration);

		// Avoid multiple playbacks at the same time
		setTimeout(function(){
			playing = false;
		}, (time - audioContext.currentTime) * 1000); 
		
	};

	var capture = function(){
		if (status == statusCodes.getUserMediaError) {
			return status;
		};

		navigator.getUserMedia({audio: true}, function(stream) {
			var audioSrc = audioContext.createMediaStreamSource(stream);
			var scriptProcessor = audioContext.createScriptProcessor(1024, 1, 1);
			
			scriptProcessor.onaudioprocess = processInput;
			audioSrc.connect(scriptProcessor);
			scriptProcessor.connect(audioContext.destination);
		},

		function(err){
			console.log(err);
		});


	};

	return {status: status,
		play: play,
		capture: capture};
	
})((window.AudioContext || window.webkitAudioContext),navigator,Morse);
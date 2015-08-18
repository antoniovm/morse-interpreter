var Morse = (function(){

	var symbols = {
		line: '-',
		dot: '.',
		wordDelimiter: '  ',
		charDelimiter: ' ',
		unknownInput: '*'};

	var charmap = {
		'a': '.-',
		'b': '-...',
		'c': '-.-.',
		'd': '-..',
		'e': '.',
		'f': '..-.',
		'g': '--.',
		'h': '....',
		'i': '..',
		'j': '.---',
		'k': '-.-',
		'l': '.-..',
		'm': '--',
		'n': '-.',
		'ñ': '--.--',
		'o': '---',
		'p': '.--.',
		'q': '--.-',
		'r': '.-.',
		's': '...',
		't': '-',
		'u': '..-',
		'v': '...-',
		'w': '.--',
		'x': '-..-',
		'y': '-.--',
		'z': '--..',
		'0': '-----',
		'1': '.---',
		'2': '..---',
		'3': '...--',
		'4': '....-',
		'5': '.....',
		'6': '-....',
		'7': '--...',
		'8': '---..',
		'9': '----.',
		'.': '.-.-.',
		',': '--..-',
		'?': '..--.',
		'"': '.-..-.',
		'!': '-.-.--',
		' ': symbols.wordDelimiter
	};

	var patternmap = {
		'.-': 'a',
		'-...': 'b',
		'-.-.': 'c',
		'----': 'ch',
		'-..': 'd',
		'.': 'e',
		'..-.': 'f',
		'--.': 'g',
		'....': 'h',
		'..': 'i',
		'.---': 'j',
		'-.-': 'k',
		'.-..': 'l',
		'--': 'm',
		'-.': 'n',
		'--.--': 'ñ',
		'---': 'o',
		'.--.': 'p',
		'--.-': 'q',
		'.-.': 'r',
		'...': 's',
		'-': 't',
		'..-': 'u',
		'...-': 'v',
		'.--': 'w',
		'-..-': 'x',
		'-.--': 'y',
		'--..': 'z',
		'-----': '0',
		'.---': '1',
		'..---': '2',
		'...--': '3',
		'....-': '4',
		'.....': '5',
		'-....': '6',
		'--...': '7',
		'---..': '8',
		'----.': '9',
		'.-.-.': '.',
		'--..-': ',',
		'..--.': '?',
		'.-..-.': '"',
		'-.-.--': '!'
	};

	patternmap[symbols.wordDelimiter] = ' ';

	var symbolsSequence = [];
	var whitespacesSequence = [];
	var lastTapStamp;
	var defaultDotTime = 50; //Miliseconds

	Array.prototype.max = function() {
	  return Math.max.apply(null, this);
	};

	Array.prototype.min = function() {
	  return Math.min.apply(null, this);
	};

	var getPattern = function(c){
		return (charmap[c.toLowerCase()] || symbols.unknownInput) + symbols.charDelimiter;
	};

	var getChar = function(p){
		return (patternmap[p.toLowerCase()] || symbols.unknownInput);
	};

	var toMorse = function(string){
		var morse = '';

		string = string.trim();

		for (var i = 0; i < string.length; i++) {
			morse += getPattern(string[i]);
		};

		return morse.trim();
	};

	var fromMorse = function(morse){
		var string = '';

		// Clean input
		morse = morse.trim()
					.replace(/\ \ +/g,symbols.wordDelimiter)// Word delimiter
					.replace(/\_/g,symbols.line)			// Line representation
					.replace(/\·/g,symbols.dot)				// Dot representation
					.replace(/[^\.\-\ \|]/g,'');			// Remove forbidden characters

		// List of words in morse
		var words = morse.split(symbols.wordDelimiter);

		// Iterate over words
		words.forEach(function(e){
			e = e.trim().split(symbols.charDelimiter);
			
			for (var i = 0; i < e.length; i++) {
				string += (getChar(e[i]) || '');
			};

			string += ' ';
		});

		return string.trim();
	};

	var tapDown = function(timeStamp){
		if (lastTapStamp) {
			whitespacesSequence.push(timeStamp - lastTapStamp);
		};

		lastTapStamp = timeStamp;
	};

	var tapUp = function(timeStamp){
		symbolsSequence.push(timeStamp - lastTapStamp);

		lastTapStamp = timeStamp;
	};

	var processTapPattern = function(){
		var minUp = Infinity;
		var minDown = Infinity;

		var maxSymbols = symbolsSequence.max();
		var minSymbols = symbolsSequence.min();

		// minUp = whitespacesSequence.min();

		var minMean = defaultDotTime;

		if (Math.round(maxSymbols/minSymbols) >= 3) {
			minMean = minSymbols;
		}

		var processedUp = [];
		var processedDown = [];

		whitespacesSequence.forEach(function(e,i){
			processedUp.push(Math.round(e/minMean));
		});

		symbolsSequence.forEach(function(e,i){
			processedDown.push(Math.round(e/minMean));
		});

		var morseString = processedDown[0] < 3 ? symbols.dot : symbols.line;

		for (var i = 0; i < processedUp.length; i++) {
			
			morseString += processedUp[i] < 8 ? 
								(processedUp[i] < 4 ? 
									'':
									' ')  : '  ';

			morseString += processedDown[i + 1] < 3 ? 
								symbols.dot : symbols.line;

		};

		return morseString;
	};

	return {toMorse: toMorse,
		fromMorse: fromMorse,
		tapDown: tapDown,
		tapUp: tapUp,
		processTapPattern: processTapPattern,
		getConfig: function(){
			return {symbols: symbols,
				timeReference: defaultDotTime};
		}};

})();
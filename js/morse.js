var Morse = (function(){

	var wordDelimiter = '|';
	var line = '-';
	var dot = '.';

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
		' ': wordDelimiter
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
		'-.-.--': '!',
		wordDelimiter: ' '
	};


	var getPattern = function(c){
		return (charmap[c.toLowerCase()] || '*') + ' ';
	};

	var getChar = function(p){
		return (patternmap[p.toLowerCase()] || '*');
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
					.replace(/\ \ +/g,wordDelimiter)// Word delimiter
					.replace(/\_/g,line)			// Line representation
					.replace(/\·/g,dot)				// Dot representation
					.replace(/[^\.\-\ \|]/g,'');	// Remove forbidden characters

		// List of words in morse
		var words = morse.split(wordDelimiter);

		// Iterate over words
		words.forEach(function(e){
			e = e.trim().split(' ');
			
			for (var i = 0; i < e.length; i++) {
				string += (getChar(e[i]) || '');
			};

			string += ' ';
		});

		return string.trim();
	};

	return {toMorse: toMorse,
		fromMorse: fromMorse};

})();
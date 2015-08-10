(function(document,Morse){

	var tfString = document.getElementById('string');
	var tfMorse = document.getElementById('morse');
	var bPlay = document.getElementById('b-play');

	tfString.onkeyup = function(event){
		var element = event.srcElement || event.target;
		var morse = Morse.toMorse(element.textContent);
		tfMorse.textContent = morse;
	};

	tfMorse.onkeyup = function(event){
		var element = event.srcElement || event.target;
		var string = Morse.fromMorse(element.textContent);
		tfString.textContent = string;
	};

	bPlay.onclick = function(event){
		var morse = tfMorse.textContent;
		Audio.play(morse);
	};

	// Init
	var morse = Morse.toMorse(tfString.textContent);
	tfMorse.textContent = morse;

})(document,Morse);
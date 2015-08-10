(function(document,Morse){

	var tfString = document.getElementById('string');
	var tfMorse = document.getElementById('morse');
	var bPlay = document.getElementById('b-play');

	tfString.onkeyup = function(event){
		var morse = Morse.toMorse(event.srcElement.innerText);
		tfMorse.textContent = morse;
	};

	tfMorse.onkeyup = function(event){
		var string = Morse.fromMorse(event.srcElement.innerText);
		tfString.textContent = string;
	};

	bPlay.onclick = function(event){
		var morse = tfMorse.innerText;
		Audio.play(morse);
	};

	// Init
	var morse = Morse.toMorse(tfString.innerText);
	tfMorse.innerText = morse;

})(document,Morse);
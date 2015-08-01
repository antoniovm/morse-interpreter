(function(document,Morse){

	var tfString = document.getElementById('string');
	var tfMorse = document.getElementById('morse');

	tfString.onkeyup = function(event){
		var morse = Morse.toMorse(event.srcElement.innerText);
		tfMorse.textContent = morse;
	};

	tfMorse.onkeyup = function(event){
		var string = Morse.fromMorse(event.srcElement.innerText);
		tfString.textContent = string;
	};

	// Init
	var morse = Morse.toMorse(tfString.innerText);
	tfMorse.innerText = morse;

})(document,Morse);
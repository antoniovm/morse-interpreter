(function(document,Morse){

	var tfString = document.getElementById('string');
	var tfMorse = document.getElementById('morse');
	var bPlay = document.getElementById('b-play');
	var bTap = document.getElementById('b-tap');

	tfString.addEventListener('keyup',function(event){
		var element = event.srcElement || event.target;
		var morse = Morse.toMorse(element.textContent);
		tfMorse.textContent = morse;
	});

	tfMorse.addEventListener('keyup',function(event){
		var element = event.srcElement || event.target;
		var string = Morse.fromMorse(element.textContent);
		tfString.textContent = string;
	});

	var tapDownEvent = ('ontouchstart' in window) ? 'touchstart' : 'mousedown';
	var tapUpEvent = ('ontouchend' in window) ? 'touchend' : 'mouseup';

	bPlay.addEventListener(tapDownEvent,function(event){
		var morse = tfMorse.textContent;
		Audio.play(morse);
	});

	bTap.addEventListener(tapDownEvent,function(event){
		Morse.tapDown(event.timeStamp);
	});

	bTap.addEventListener(tapUpEvent,function(event){
		var morse = Morse.tapUp(event.timeStamp);
		var string = Morse.fromMorse(morse);
		tfString.textContent = string;
		tfMorse.textContent = morse;
	});

	// Init
	var morse = Morse.toMorse(tfString.textContent);
	tfMorse.textContent = morse;

})(document,Morse);
var context_id = -1;

console.log("Shalin background js started");

chrome.input.ime.onFocus.addListener(function(context) {
	console.log("Hello"); //'onFocus:' + context.contextID
	context_id = context.contextID;
});

chrome.input.ime.onKeyEvent.addListener(function(engineID, keyData) {
		console.log("Hello");
		if (keyData.type == "keydown" && keyData.key.match(/~/)) {
			chrome.input.ime.commitText({"contextID": context_id, "text": "hello"});
			return true;
		} else {
			return false;
		}
});
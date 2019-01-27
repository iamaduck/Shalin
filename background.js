var context_id = -1;

var active = false;

console.log("Shalin - Background script started");

chrome.input.ime.onFocus.addListener(function focusWindow(context) {
	context_id = context.contextID;
});

chrome.input.ime.onKeyEvent.addListener(function backTick(engineID, keyData) {
		console.log("Hello");
		if (keyData.type == "keydown" && keyData.key.match(/`/)) {
			chrome.input.ime.commitText({"contextID": context_id, "text": "hello"});
			return true;
		} else {
			return false;
		}
});

function activateIME() {
	console.log("Shalin - Chrome IME activated");
	chrome.input.ime.activate();
}

function deactivateIME() {
	console.log("Shalin - Chrome IME deactivated");
	chrome.runtime.reload();							// I know this is gross, but it's the best way to do this where Chrome will allow typing in password/protected text fields.
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log("Shalin - Message received");
		console.log(request.toggle)
		if (request.toggle == true) {
			activateIME();
			sendResponse({state: true});
		} else if (request.toggle == false) {
			deactivateIME();
			sendResponse({state: false});
		}
	}
);
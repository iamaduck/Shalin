var context_id = -1;

console.log("Shalin - Background script started");

chrome.input.ime.onFocus.addListener(function(context) {
	console.log("Hello"); //'onFocus:' + context.contextID
	context_id = context.contextID;
});

chrome.input.ime.onKeyEvent.addListener(function(engineID, keyData) {
		console.log("Hello");
		if (keyData.type == "keydown" && keyData.key.match(/`/)) {
			chrome.input.ime.commitText({"contextID": context_id, "text": "hello"});
			return true;
		} else {
			return false;
		}
});

function activateIME(sender) {
	console.log("Shalin - Chrome IME activated by " + sender.tab.url);
	chrome.input.ime.activate();
}

function deactivateIME(sender) {
	console.log("Shalin - Chrome IME deactivated by " + sender.tab.url);
	chrome.input.ime.deactivate();
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.toggleState == "enable") {
			activateIME(sender);
			sendResponse({state: "Shalin - Chrome IME enabled"});
		} else if (request.toggleState == "disable") {
			deactivateIME(sender);
			sendResponse({state: "Shalin - Chrome IME disabled"});
		}
	}
);
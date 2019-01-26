function toggleIME(toggleState) {
	console.log("Shalin - Toggling IME...");
	chrome.runtime.sendMessage({toggle: toggleState}, function(response) {
		console.log(response.state);
	});
};

document.getElementById('enableIME').onclick = toggleIME("enable");
document.getElementById('disableIME').onclick = toggleIME("disable");
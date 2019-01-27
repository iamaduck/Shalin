function toggleIME(toggleState) {
	console.log("Shalin - Toggling IME...");
	chrome.runtime.sendMessage({toggle: toggleState}, function(response) {
		if (response.state == true) {
			console.log("Shalin - Chrome IME activated");
		} else if (response.state == false) {
			console.log("Shalin - Chrome IME deactivated");
		}
	});
};

document.getElementById("enableIME").onclick = function(){toggleIME(true)};
document.getElementById("disableIME").onclick = function(){toggleIME(false)};
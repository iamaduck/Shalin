function activateIME() {
	chrome.input.ime.activate();
	document.getElementById('status').textContent = "On";
}
document.getElementById('enableIME').onclick = activateIME;
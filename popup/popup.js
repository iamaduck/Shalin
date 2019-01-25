function activateIME() {
	chrome.input.ime.activate();
}
document.getElementById('enableIME').onclick = activateIME;
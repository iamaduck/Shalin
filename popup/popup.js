function activateIME() {
	chrome.input.ime.activate();
	document.getElementById('demo').textContent = "JS runs";
}
document.getElementById('enableIME').onclick = activateIME;
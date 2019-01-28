var context_id = -1;
var textBuffer = "";
var TEXTBUFFER_MAX = 50;

var symbols;

var script = document.createElement('script');
 
script.src = 'jquery-3.3.1.js';
document.getElementsByTagName('head')[0].appendChild(script); 

console.log("Shalin - Background script started");

setTimeout(function () { setSymbol(); } , 50);

chrome.input.ime.onFocus.addListener(function focusWindow(context) {
	context_id = context.contextID;
});

chrome.input.ime.onKeyEvent.addListener(function backTick(engineID, keyData) {
		
		console.log("String Buffer: " + textBuffer);
		
		if (keyData.type == "keydown" && keyData.key.match(/`/)) {
			//chrome.input.ime.clearComposition({"contextID": context_id});
			//chrome.input.ime.setComposition({"contextID": context_id, "text": "TEST", "selectionStart": 0, "cursor": 0});
			//chrome.input.ime.commitText({"contextID": context_id, "text": "hello"});
			
			var triggerReplaceVal = replaceTrigger(textBuffer);
			
			console.log("triggerReplaceVal.symbol: " + triggerReplaceVal.symbol);
			console.log("triggerReplaceVal.lengthToDel: " + triggerReplaceVal.lengthToDel);
			
			if (triggerReplaceVal.lengthToDel == -1)
			{
				textBuffer += keyData.value;
				if (textBuffer.length > TEXTBUFFER_MAX) {textBuffer = textBuffer.slice(textBuffer.length - TEXTBUFFER_MAX);}
			}
			else
			{
				delChars(triggerReplaceVal.lengthToDel+1);
				console.log("deleted " + triggerReplaceVal.lengthToDel+1 + " characters");
				textBuffer = textBuffer.slice(triggerReplaceVal.lengthToDel+1);
				console.log("deleted " + (triggerReplaceVal.lengthToDel+1) + " characters from text buffer");
				
				setTimeout(function () { //this code needs to be delyed to allow time for the above to finish
					console.log("triggerReplaceVal: " + triggerReplaceVal.symbol);
					chrome.input.ime.commitText({"contextID": context_id, "text": triggerReplaceVal.symbol});
					console.log("Commited " + triggerReplaceVal.symbol)
					textBuffer += triggerReplaceVal.symbol;
					console.log("Added " + triggerReplaceVal.symbol + " to textBuffer")
				} , 50);
				
			}
			
			return true;
		} else if (keyData.type == "keydown" && keyData.key.match("Backspace")) {
			chrome.input.ime.sendKeyEvents({"contextID": context_id, "keyData": [{"type": "keydown", "requestId": "1", "key": "8", "code": "Backspace"}]});
			setTimeout(function () { textBuffer = textBuffer.slice(0, -2); }, 10);
		} else if (keyData.type == "keydown" && keyData.key.match(/[ -~]/)) {    //[ -~]+
			//console.log(keyData.key);
			console.log("keyData.value: " + textBuffer);
			textBuffer += keyData.key;
			if (textBuffer.length > TEXTBUFFER_MAX) {textBuffer = textBuffer.slice(textBuffer.length - TEXTBUFFER_MAX);}
			return false;
		};
});

function delChars(presses) {
	for (i = 0; i < presses; i++) {
		chrome.input.ime.sendKeyEvents({"contextID": context_id, "keyData": [{"type": "keydown", "requestId": "1", "key": "8", "code": "Backspace"}]})
	}
}

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

function setSymbol()
{
	//var symbols = [];
	//symbols = [{symbol:"∀",triggers:["for all"]},{symbol:'=',triggers:["eql","equal","equals"]}];
	
	//var symbols;
	
	$.getJSON("symbols_list.json", function(data) {
    
		symbols = data;
	
	});
	
};

function TESTprintSymbol()
{
	
	console.log("Printing Symbols:");
	console.log(symbols);
};

function replaceTrigger(string)
{
	setSymbol();
	
	var localSymbols = symbols.slice(0);
	var valToReturn = {symbol: "",lengthToDel: -1};
	
	
	if (string[string.length-1] == "`") //removes the ` character from the front
	{string = string.slice(0,string.length-1);}
	
	console.log("The string is:" + string)
	
	for (i = string.length - 1; i >= 0; i--) 
	{
		
		var revIndex = string.length - (i+1); //revIndex is the current distance from the end of the srtring, 0 = end of string
		var shortString = string.slice(string.length - (revIndex+1), string.length);
		console.log("revIndex is now:" + revIndex);
		console.log("Short string is now:" + shortString);
		var symbolsToRemove = [];
		localSymbols.forEach(function (stp) 
		{
			var triggersToRemove = [];
			stp.triggers.forEach(function (trigger)
			{
				if (trigger.length < revIndex)
				{
					triggersToRemove.push(trigger)
					console.log("Added " +  trigger + " to triggersToRemove, because it is too short")
				}
				
				if (trigger[trigger.length - (revIndex+1)] != string[i])
				{
					triggersToRemove.push(trigger);
					console.log("Added " +  trigger + " to triggersToRemove, because it dosent match");
				}
				
				if (trigger == shortString)
				{
					console.log("Found Match! it is: " + trigger);
					console.log("stp.symbol: " + stp.symbol);
					console.log("lengthToDel: " + revIndex);
					valToReturn = {symbol: stp.symbol,lengthToDel: revIndex};	
				}
				//console.log(trigger);
			});
			
			triggersToRemove.forEach(function (symbol) { stp.triggers.splice(stp.triggers.indexOf(symbol),1) });
			
			if (stp.triggers.length == 0) 
			{ 
				symbolsToRemove.push(stp); 
				console.log("Added " +  stp.symbol + " to symbolsToRemove")
			}});
		
		symbolsToRemove.forEach(function (stp) 
		{ 
			localSymbols.splice(localSymbols.indexOf(stp),1)
			console.log("Removed " + stp.symbol + " localSymbols")
		});
		
	}
	
	return valToReturn;
	
	
}



/*	
		localSymbols.forEach(function (stp) 
		{
			stp:triggers.forEach(function (trigger)
			{
				console.log(trigger);
			});
		});*/
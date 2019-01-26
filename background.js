var context_id = -1;
var symbols = [];

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

/*function activateIME() {
	console.log("Shalin - Chrome IME activated");
	chrome.input.ime.activate();
}

function deactivateIME() {
	console.log("Shalin - Chrome IME deactivated");
	chrome.input.ime.deactivate();
}*/

function setSymbol()
{
	
	symbols = [{symbol:'=',triggers:["eql","equal","equals"]}];
	
};

function TESTprintSymbol()
{
	
	console.log("hello");
	console.log(symbols);
};

function replaceTrigger()
{
	localSymbols = symbols;
	
	for (i = 0; i < 1; i++) 
	{
     localSymbols.forEach(function (stp) 
		{
			stp.triggers.forEach(function (trigger)
			{
				console.log(trigger);
			});
		});
	}
	
}

/*	
		localSymbols.forEach(function (stp) 
		{
			stp:triggers.forEach(function (trigger)
			{
				console.log(trigger);
			});
		});*/
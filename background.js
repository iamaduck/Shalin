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
	
	symbols = [{symbol:"∀",triggers:["for all"]},{symbol:'=',triggers:["eql","equal","equals"]}];
	
};

function TESTprintSymbol()
{
	
	console.log("Printing Symbols:");
	console.log(symbols);
};

function replaceTrigger(string,maxLength)
{
	var localSymbols = symbols.slice(0);
	var stringToReturn = ""
	
	if (string[string.length-1] == "`")
	{string = string.slice(0,string.length-1);}
	
	console.log("The string is:" + string)
	
	for (i = string.length - 1; i >= Math.max(string.length - maxLength,0); i--) 
	{
		
		/*if (string[i] == " ") //if the current char is a space it just skipps it and goes back to the top
		{
			continue;
		}*/
		
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
					stringToReturn = string.slice(0,i) + stp.symbol;	
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
	
	if (stringToReturn == "")
	{
		return string + "`"; //if no match is found
	}
	else
	{
		return stringToReturn;
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
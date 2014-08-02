console.log("############# background.js #############");

chrome.runtime.onMessage.addListener(onMessage);
//chrome.pageAction.onClicked.addListener(onClickPageAction);

function onClickPageAction(tab)
{
	console.log("page action clicked:", tab)
};

function onMessage(request, sender, sendResponse)
{
	// debug
	//console.log("sender: %o", sender);
	console.log("message: %o", request);

	stats = [];
	for (var i=0; request.stats.length>i; i++)
	{
		var r = request.stats[i];
		if (r.count > 0)
			stats.push(r.title + ': ' + r.count);
	}

	chrome.browserAction.setTitle({ title: stats.join("\n"), tabId: sender.tab.id });
	chrome.browserAction.setPopup({ tabId: sender.tab.id, popup: "details.html?" + escape(JSON.stringify(request)) })
	chrome.browserAction.setBadgeText({ tabId: sender.tab.id, text: "" + request.count});

/*
	chrome.pageAction.setTitle({ title: stats.join("\n"), tabId: sender.tab.id });
	chrome.pageAction.setIcon({ imageData: drawIcon(request.count), tabId: sender.tab.id });
	chrome.pageAction.show(sender.tab.id);
	chrome.pageAction.setPopup({ tabId: sender.tab.id, popup: "details.html?" + escape(JSON.stringify(request)) })
*/

	//sendResponse({farewell: "goodbye"});
}

/*

function drawIcon(text)
{
	var fgColor = "#fff";
	var bgColor = "rgba(255,0,0,0.5)"; // "#000";

	//var fgColor = "#000";
	//var bgColor = "#ff9";

    var canvas = document.createElement('canvas');

	canvas.width = 19;
	canvas.height = 19;
	var context = canvas.getContext('2d');

	var img = new Image();
	img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABdElEQVQ4T62UTSiEURSGZ6IQCwtlQWlYWLAR+VkrS2apbCa2flLsZIMFpUQsUfaahD3lZ2MnG39F2YlQshDPW2eKMXfu/TS3ns53vznnvefeee8XjxV4xAusF/MJVrDgMFTawk/EVXhzNeITnKDwBC5MoJnYDotRBFMkd1lBK/EcPmxeSmyCM5trsc2f4q4Ol0ka9Zxvzhyf4BCi29Bg4jfEJKzDvwTHTbDRBC+JfbAEKzCSvQtXh7MkLkA/HEGNFT7Y+W4RZ2AyVHCMxF3oBHWVsc0Lz/VwCAMwHyqo5GuohlcotsJPYjncQwvoLH8N15Z7yCqBdyiDjG30LFMXgSy0Eyqo1YUMnYBHK6yyzvWv34J8GNRhLVna9j50wJ1V1ZlIN3EPrkIFtd05WINe61S1uiVpGARdv+dQQeXJZ1Ogayi7aMg+xyDLyAlfUQQ3SJYf/xTxbhpS2WKa5/vatPG7zirXOODlaVRBh1b+177vYWTRb5XRQxXHpCGPAAAAAElFTkSuQmCC";

	context.drawImage(img, 0, 0);

    var padWidth = 2;
    var padHeight = 1;

    var textHeight = 10;
    context.font = textHeight + "px Arial";
    var textWidth = context.measureText(text).width;
    
    context.fillStyle = bgColor;
	context.fillRect(0, 19 - textHeight - 2 * padHeight, textWidth + 2 * padWidth, textHeight + 2 * padHeight);

	context.fillStyle = fgColor;

	context.fillText(text, padWidth, 19 - 1 - padHeight);

	return context.getImageData(0, 0, 19, 19);
}

*/
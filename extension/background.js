//console.log("############# background.js #############");

chrome.runtime.onMessage.addListener(onMessage);
chrome.browserAction.onClicked.addListener(onClickAction);

chrome.runtime.onInstalled.addListener(onInstalled);

chrome.contextMenus.onClicked.addListener(onMenuClick);

chrome.contextMenus.create(
	{
		title: 'Add..',
		id: 'add',
		contexts: [ 'link' ], // , 'page', 'image', 'video', 'audio' ],
		documentUrlPatterns: [ 'http://*/*', 'https://*/*' ]
	},
	function()
	{
		console.log("created: lastError = %o", chrome.runtime.lastError)
	})

function onMenuClick(info, tab)
{
	console.log("click: %o @ %o", info, tab);

	chrome.tabs.sendMessage(
		tab.id,
		{
			'type': 'addAssistant',
			'url': info.linkUrl
		},
		function response()
		{
			console.log("response: %o", arguments)
		}
	)

	// info.menuItemId = 'add'
	// info.linkUrl -> url til siden
}

function onInstalled(details)
{
	var manifest = chrome.runtime.getManifest();

	switch (details.reason)
	{
		case "update":
			if (details.previousVersion != manifest.version)
			{
				// details.previousVersion
			}
			break;
	}

	console.log("onInstalled: %o", details);
}

function onClickAction(tab)
{
	console.log("action clicked:", tab)
};

var flash = {};

function resetBadge(tabId)
{
	console.log("reset badge");
	chrome.browserAction.setBadgeBackgroundColor({ tabId: tabId, color: 'red' })
	chrome.browserAction.setTitle({ title: "", tabId: tabId });
	chrome.browserAction.setPopup({ tabId: tabId, popup: "details.html" })
	chrome.browserAction.setBadgeText({ tabId: tabId, text: "" });
}

function onMessage(msg, sender, sendResponse)
{
	var tabId = sender.tab && sender.tab.id ? sender.tab.id : msg.tabId;
	console.log("message: %o from %o, tab=%s", msg, sender, tabId);

	if (msg.type == "reset")
	{
		resetBadge(tabId);
	}
	else if (msg.type == "stats")
	{
		stats = [];

		for (var i=0; msg.stats.length>i; i++)
		{
			var r = msg.stats[i];
			if (r.count > 0)
				stats.push(r.title + ': ' + r.count);
		}

		chrome.browserAction.setBadgeBackgroundColor({ tabId: sender.tab.id, color: 'red' })
		chrome.browserAction.setTitle({ title: stats.join("\n"), tabId: sender.tab.id });
		chrome.browserAction.setPopup({ tabId: sender.tab.id, popup: "details.html?" + escape(JSON.stringify(msg)) })
		chrome.browserAction.setBadgeText({ tabId: sender.tab.id, text: "" + msg.count});

	/*
		chrome.pageAction.setTitle({ title: stats.join("\n"), tabId: sender.tab.id });
		chrome.pageAction.setIcon({ imageData: drawIcon(msg.count), tabId: sender.tab.id });
		chrome.pageAction.show(sender.tab.id);
		chrome.pageAction.setPopup({ tabId: sender.tab.id, popup: "details.html?" + escape(JSON.stringify(msg)) })
	*/

		//sendResponse({farewell: "goodbye"});
	}
	else if (msg.type == "assist")
	{
		msg.tabId = sender.tab.id;
		chrome.browserAction.setTitle({ title: 'Assist..', tabId: sender.tab.id });
		chrome.browserAction.setPopup({ tabId: sender.tab.id, popup: "assistant.html?" + escape(JSON.stringify(msg)) })
		chrome.browserAction.setBadgeText({ tabId: sender.tab.id, text: "AST?"});

		var flashes = 10;
		var colors = [ "#000", "#fff" ]; //palette; // ["red", "orange", "yellow", "green", "blue", "purple" ];

		function flash()
		{
			if (flashes-- > 0)
			{
				chrome.browserAction.setBadgeBackgroundColor({ tabId: sender.tab.id, color: colors[flashes % colors.length] });
				setTimeout(flash, 250);
			}
			//else resetBadge(sender.tab.id);
		}
		flash();
	}
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
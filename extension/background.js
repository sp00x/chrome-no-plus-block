//console.log("############# background.js #############");

var manifest = chrome.runtime.getManifest();

chrome.runtime.onMessageExternal.addListener(function(msg, sender, callback)
{
	console.log("external message: msg=%o, sender=%o", msg, sender);
	if (callback) callback({ youSaid: msg });
})

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//// context menu ////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function onMenuClick(info, tab)
{
	console.log("click: %o @ %o", info, tab);

	if (info.menuItemId == 'addSite')
	{
		console.log("Context menu: ADD SITE");
		chrome.tabs.sendMessage(tab.id,	{ 'type': 'startSiteAddAssistant' })
	}
	else if (info.menuItemId == 'addLink')
	{
		console.log("Context menu: ADD LINK")
	}

	// info.menuItemId = 'add'
	// info.linkUrl -> url til siden
}

chrome.contextMenus.onClicked.addListener(onMenuClick);

// set up context menu items
chrome.contextMenus.create(
	{
		title: 'Add website..',
		id: 'addSite',
		contexts: [ 'link', 'page', 'image', 'video', 'audio' ],
		documentUrlPatterns: [ 'http://*/*', 'https://*/*' ]
	})

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//// installation/update /////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function onInstalled(details)
{
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

chrome.runtime.onInstalled.addListener(onInstalled);

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//// badge click event ///////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function onClickAction(tab)
{
	console.log("action clicked:", tab)
};

chrome.browserAction.onClicked.addListener(onClickAction);

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//// message event handlers //////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function resetBadge(msg, sender, callback)
{
	console.log("reset badge");
	chrome.browserAction.setBadgeBackgroundColor({ tabId: sender.tab.id, color: 'red' })
	chrome.browserAction.setTitle({ title: manifest.name, tabId: sender.tab.id });
	chrome.browserAction.setPopup({ tabId: sender.tab.id, popup: "details.html" })
	chrome.browserAction.setBadgeText({ tabId: sender.tab.id, text: "" });
}

function setStats(msg, sender, callback)
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
}

function siteAddAssistUpdate(msg, sender, callback)
{
	chrome.browserAction.setTitle({ title: 'Adding web site..', tabId: sender.tab.id });
	chrome.browserAction.setPopup({ tabId: sender.tab.id, popup: "assistant.html" });
	chrome.browserAction.setBadgeText({ tabId: sender.tab.id, text: "+" + msg.count });

	// flash the icon a few times
	flashBadge(sender.tab.id, 5, '#0f0');
}

var messageHandlers =
{
	'reset': resetBadge,
	'stats': setStats,
	'siteAddAssistUpdate': siteAddAssistUpdate
}

function onMessage(msg, sender, callback)
{
	if (msg.type == 'log')
	{
		console.log(msg.text);
		return;
	}

	console.log("message: %o from %o", msg, sender);
	var handler = messageHandlers[msg.type];
	if (handler) handler(msg, sender, callback);
	else console.error("Unhandled message: '%s', msg: %o, sender: %o", msg.type, msg, sender)
}

chrome.runtime.onMessage.addListener(onMessage);

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//// flash the badge icon ////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

var flashInterval = null;

function flashBadge(tabId, count, finalColor)
{
	var flashes = count;
	var colors = [ "#000", "#fff" ]; //palette; // ["red", "orange", "yellow", "green", "blue", "purple" ];

	if (flashInterval != null) clearInterval(flashInterval);

	//console.log("flash", tabId, count, finalColor)

	var flashTimer = function()
	{
		//console.log("  flash #", flashes)

		if (flashes-- > 0)
		{
			chrome.browserAction.setBadgeBackgroundColor(
				{
					tabId: tabId,
					color: colors[flashes % colors.length]
				});
		}
		else
		{
			clearInterval(flashInterval);
			flashInterval = null;
			chrome.browserAction.setBadgeBackgroundColor(
				{
					tabId: tabId,
					color: finalColor
				});
		}
	}
	flashInterval = setInterval(flashTimer, 250);
}
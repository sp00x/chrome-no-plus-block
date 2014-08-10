log.debug("############ content_script.js ############");

var logPrefix = "+BLOCK: "
var blockIdPrefix = "plusblockoverlay_";
var blockedCount = 0;
var blockedStats = {};

var cssInjected = false;

var blockText = "Content blocked\nForYourOwnGood&trade;";
var imageData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAGo0lEQVR4Xu2aBYwlRRCG93B3S7B3uLsH2UBwgrsuENzd3S9BgxMguFsgQJCwSJDg7rAHBHd3+D8ynXQqPXczb+rNTXivkj+7PdPdU/23VHXVG9bX5TKsy8ff1yOgtwK6nIHeFujyBdA7BOvaAitqpR0jLCZMMZpV943ePyccJzza6RVaBwEMfjAbyHv6++1oBjWl3g8X/hFWEh7rJAl1EPCwBrCCsIlwS8HBbKZ61wtPCssWbNNWtToI+EmafSrMXlLDkao/gzB+yXalqtdBAEv5ZWGhUpr19b2q+vMJHdWxo51nA/7fEvBuwRmdTfV+Fz4qWD9Um0n/jCdwcBaRslvsvz6rrABmtknS1ljaamRGvZHKNwvHCtjuOmQvfeQcYXfhgiof9CAAO4+pO0/Ys4oyJdoer7pHCRsLRU1rsnsPAuZVz68JNwrY7zrkfH1kN6E/I7/tb3oQMI2+/oXwkLBy25qUa3hTNvvzZ+SXax3V9iBgLPXHKf+6sGBCE969JSyQeDeUPWsl3r2hZ7jEKUdoUM9xk6cXPm979GroQQDfZwX8JeC5WeFy852QGuSoCMBsTiRMlejzFT1j62Em+W7b4kUAZ8Cc2Wz9bbT5UOUJBbaKlVERAHE/CLMk2n2mZ2Pn9FmKDC8CsAJYg6mFr40GLOVZMxLKEPCHKr+TzXTcji33m4AjNk+p0SYqexGAH4A/gEJvmu88qzJxgHGFP827vBXAvv9VoO0Spg1b4iuBazK3zEriRQDOyK6ZQvb+HlYHgRDOgljyCAiDpG2/aTO3yqyq24UNKo1ejb0IOEF9HSlsKNxmlLpb5TWFGYWPCxIws+p9INB2bdNmeZWJFF0i7NwUAvaWImcLuwgXG6WCzWbmMIexDGWFlnkenCvabmrerZ+RfIr+Ht4UAraQItcKrIKTjFKXqzwgcA48X5AA9v3TAm13MG12ykg+QH/PaAoBq0qR+wRWwb5GqXNV3kPAStggZ94K6FddPEvacvGJ5TAVTha2Fa5qCgGLZLPLKtjKKHWqyocInAP3mnd5BLDv7xJoy4BjYdb3E9YS7mkKARxweG73C6sZpbi1cXsjKIq5jCWPAPb9DQJtTzRtrlR5G2FJ4ZmmEBDs9gtSaFGj1P4qny4MCFcUJIB9f6lA2zNNG2Z9DYF7QiCwbR68zCAKYONxXQllxYJluFAgVkDMIJYwgJZ5HgIeKavC4cghOYlAxLmSeBKA28rgJzAacSZcLXAOjChIQDjoaMu5YkmbTg+4KFUWTwJIYiwtTC58H2kW7DbnAOkxOxjKLfOcfX+EQNs7zDtmHVc4dUkqTYgnAXfq6+sIcwhxxDiYSE5vbHcRAtj3mFPaPhA1YNYhgNzh4qVHm2jgScBl6n97gVQWqyEI5ceFiwTuC0UIwJvE4bF9MesjBXyO1ZtGwGlS6GBhXYHVEISM0IvCNcLWBQlg3+Nd0pasUhBmHdOX6qstPjxXwEHSgENuR4HVEITECFsidXsbyiq1jPbse4ik7fvRO2YdZyrlcY5xAgakAb77oQKrIQhxO5Kj7GX2dCx5BDyoSgRYbcyPFYT7m3KQxjgBwX3F6Tkw0gZ7jX/whLBcQQKCRbG2HheYw5SzhDOlsnhugaWkzVMCrup2kWaEsIgEEci0GeK8FcC+JzM8jhCn4LhpcgWunBAJ+nkSEPY6rioXlVjyfiOQRwD7flqBFRBLsA6ExB+pPP3qwJOASdUfDhCnNBeVWIjiIuzpWPIIINZPdNmG2W/VM8JglRMiQQlPAujzF4HBtsxASXHjvtoZzSPgZ9X9RLApb+IJhMToi1xEZfEmgBwAP3KyA31Jz8gMsafjvEGKAOL9hMQ5BxY2IyT7NJdQOSHSqRWAi8p1eGKBWQyCBVhGYJv8GD1PERC2UspqfJm1TSVZ2loN3isAFxVbTyKEqG4QfIBVBPZ0OA94lyKAOix/6zewekiIEFglaOoi3gTgom4pcF8nqREEL3A9wV6UUgRQ523Beo7se8hzSYgExbwJOEsd7yPY+B9bgn2LlYiTmSF4Ev9+iDNgMoGschzwwC/gl2PkHcg/uIg3Adzhucu7RGzNCLH9g4JLQqRTK4DrMBehVPSn6oxtrg6uEwiJQ7SLeK8ATB3mC3PFjLnYavWDWSVNRjKUJCwOkYt4E4BSITCCGeQW6CGYPc4Fwu5cid1+otcJAjBXxAb4ERNJTg/BNeaSdbSAt+kmnSDATbk6OuoRUAfLTf5GbwU0eXbq0K23Aupgucnf6PoV8C8do0xQoXnkDQAAAABJRU5ErkJggg==";

// randomize selector so it can't be easily counter-blocked
var styleSelector = "plusblockoverlay" + Math.floor(Math.random() * 0xFFFFFFFF);

// keep track of which link was last pressed, since that is not available to the
// menu click handler in the background script
var lastContextMenuElement = null;
document.addEventListener("contextmenu", function(e)
{
	lastContextMenuElement = e.srcElement;
});

function getXPath(element, preferId)
{
	preferId = (preferId == null) ? true : preferId;

    if (preferId && element.id!=='')
        return 'id("'+element.id+'")';

    if (element === document.body)
        return element.tagName;

    var ix = 0;
    var siblings = element.parentNode.childNodes;
    for (var i = 0; i < siblings.length; i++)
    {
        var sibling = siblings[i];
        if (sibling === element)
            return getXPath(element.parentNode, preferId) + '/' + element.tagName + '[' + (ix+1) + ']';
        if (sibling.nodeType === 1 && sibling.tagName === element.tagName)
            ix++;
    }
}

function loadExtensionResource(url, callback)
{
	var req = new XMLHttpRequest();
	req.onload = function(e)
	{
		callback(null, req.status, req.responseText);
	}
	req.onerror = function(e)
	{
		callback(e, req.status, req.responseText);
	}
	req.open("GET", chrome.extension.getURL(url), true);
	req.send();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// website add assistant
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var astCart = null;
var astEventListenersAdded = false;
var astKnownNodes = [];
var astPreviousPreviewNode = null;
var astPreviousPreviewClass = null;
var astStyleElement = null;

// since there is no way of capturing the onclose/onbeforeclose event in
// the popup, create a port here, and listen for it to disconenct..
chrome.runtime.onConnect.addListener(function(port)
{
	console.log("port connected:", port, port.name)

	if (port.name == "siteAddAssistant")
	{
		port.onDisconnect.addListener(function()
		{
			console.log("port disconnected:", port)
			endSiteAddAssistant({}, {})
		})
	}
});

/*
astPort.onMessage.addListener(function(msg)
{
	console.log("port message: %o", msg)
})

/*
astPort.onConnect.addListener(function(port)
{
	console.log("port connected: %o", port)
})

astPort.runtime.onDisconnect.addListener(function(port)
{
	console.log("port disconnected: %o", port)
})
*/

this.Hello = function(x)
{
	console.log("hello", x)
}

function hashToCSS(obj)
{
	return Object.keys(obj).map(function(k) { return k + ': ' + obj[k] }).join("; ");
}

var astPanelEl = null;

function astGetPanel()
{
	if (astPanelEl == null)
	{
		injectCSS('');

		var el = document.createElement("div");
		el.className = styleSelector + '_panel';

		var iframe = document.createElement("iframe");
		iframe.src = chrome.extension.getURL("/injected.html");
		el.appendChild(iframe);

//		var style = document.createElement("link");
//		style.setAttribute("rel", "stylesheet");
//		style.setAttribute("type", "text/css");
//		style.setAttribute("href", chrome.extension.getURL("/injected.css"));
//		document.body.appendChild(style);
//
//		var id = styleSelector + '_assist';
//		var el = document.createElement("div");
//		el.id = id;
//		
//		/*
//
//		el.setAttribute("style",
//			hashToCSS(
//			{
//				'position': 'fixed',
//				'left': '0px',
//				'top': '0px',
//				'right': '0px',
//				'z-index': 2147483647,
//				'height': '0px',
//				'display': 'block',
//				'color': '#fff',
//				'font-weight': 'bold',
//				'background-color': '#000',
//				'padding': '8px',
//				'margin': '0px',
//				'text-align': 'right',
//				'font-size': '10pt',
//				'font-family': 'Arial',
//				'transition': 'height 1s',
//				'box-sizing': 'content-box',
//				'overflow': 'hidden'
//			}));
//		*/
//
//		el.className = "articleCategoryBlocker_panel";

		document.body.appendChild(el);

		astPanelEl = el;
	}
	return astPanelEl;
}

function astShowPanel(msg, timeout)
{
	var el = astGetPanel();
	//el.innerHTML = msg;
	el.className = styleSelector + '_panel ' + styleSelector + '_panel_show';
	//e.style.height = "auto";
	//e.style.display = 'block';		
	if (timeout && timeout > 0)	setTimeout(astHidePanel, timeout);
}

function astHidePanel()
{
	var el = astGetPanel();
	el.className = styleSelector + '_panel';

	//e.style.height = "0px";
	//e.style.display = "none";
}

function astCheckEvent(e, eventName)
{
	try
	{
		//console.log(eventName, e)

		if (astCart == null) return true;

		var p = e.srcElement;

		var found = false;
		while (p != null && p !== document.body)
		{
			if (p.nodeType == 1 && p.nodeName.toLowerCase() == 'a')
			{
				// found the link
				found = true;
				break;
			}
			p = p.parentNode;
		}

		//console.log("found?", found, p)

		var added = false;

		if (found)
		{
			var url = p.href;
			var dupe = false;
			for (var i=0; astCart.length>i; i++) if (astCart[i].url == url)
			{	
				dupe = true;
				break;
			}
			if (!dupe)
			{
				added = true;
				astCart.push({ element: p, url: url });
			}
		}

		if (added)
			chrome.runtime.sendMessage({ type: 'siteAddAssistUpdate', count: astCart.length }, function() { });

	    e.preventDefault();
	    e.stopPropagation();
	    return false;
	} catch (e)
	{
		alert(e)
	}
}

function startSiteAddAssistant(msg, sender, callback)
{
	console.log("Starting site-add assistant")
	if (astCart == null) astCart = []; // new cart

	if (!astEventListenersAdded)
	{
		console.log("Adding event listeners");
		document.addEventListener("click", function(e) { return astCheckEvent(e, 'click') });
		eventListenersAdded = true;
	}

	// display the fixed element to call attention to the badge button
	astShowPanel('Click any article links on the page, then press the [icon] badge to process..')
	chrome.runtime.sendMessage({ type: 'siteAddAssistUpdate', count: astCart.length }, function() { });

	// callback
	if (callback && typeof callback == 'function') callback();
}

function endSiteAddAssistant(msg, sender, callback)
{
	// leave the event handler, but remove the hook
	astCart = null;

	// hide the injected overlay
	astHidePanel();

	// remove any injected preview styles
	previewSiteAddAssistant({}, sender);

	// make sure the badge is reset
	chrome.runtime.sendMessage({ type: 'reset' })

	// callback
	if (callback && typeof callback == 'function') callback();
}

function previewSiteAddAssistant(msg, sender, callback)
{
	var previewMethods = 
	{
		'display': "display: none;",
		'visibility': "visibility: hidden;",
		'overlay': "opacity: 0.25; background-color: red; z-index: 2147483647;",
		'custom': msg.css || ""
	}

	var previewCSS = previewMethods[msg.method || "overlay"];

	var styles = msg.styles || [];
	var nodeId = msg.nodeId || null;

	if (astStyleElement == null)
	{
		astStyleElement = document.createElement('style');
		document.body.appendChild(astStyleElement);
	}

	var css = "";

	if (styles.length > 0) css += styles.map(function(s) { return "." + s }).join(", ") + "\n{" + previewCSS + "\n}\n";

	if (astPreviousPreviewNode != null)
	{
		astPreviousPreviewNode.className = astPreviousPreviewClass;
	}

	if (nodeId != null)
	{
		css += "." + styleSelector + "PREVIEW" + " {\n" + previewCSS + "\n}\n";
		astPreviousPreviewNode = astKnownNodes[nodeId];
		//console.log("new preview node:", nodeId, astPreviousPreviewNode, astKnownNodes)
		astPreviousPreviewClass = astPreviousPreviewNode.className;
		astPreviousPreviewNode.className = ((astPreviousPreviewClass || "") + ' ' + styleSelector + "PREVIEW");
	}

	//console.log("preview CSS = " + css);
	astStyleElement.innerHTML = css;
}

function querySiteAddAssistant(msg, sender, callback)
{
	var cart = [];

	// since nodes don't have any unique IDs, we'll just have
	// to keep track of them all in an array (We could of course have used XPath...)
	astKnownNodes = []; // clear
	var nodeInfos = [];

	for (var i=0; astCart.length>i; i++)
	{
		var p = astCart[i].element;
		var info = [];
		while (p != null && p !== document && p != document.body)
		{
			var nodeId = astKnownNodes.indexOf(p);
			if (nodeId == -1)
			{				
				nodeId = astKnownNodes.length;
				astKnownNodes.push(p);
				nodeInfos.push({ id: nodeId, count: 0, node: p, xpath: getXPath(p, true) });
			}
			nodeInfos[nodeId].count++;

			var attrs = {};
			for (var j=0; p.attributes.length>j; j++) attrs[p.attributes.item(j).name.toLowerCase()] = p.attributes.item(j).value;
			info.push({ name: p.nodeName.toLowerCase(), attrs: attrs, id: nodeId, xpath: nodeInfos[nodeId].xpath });
			p = p.parentNode; 
		}
		cart.push({ url: astCart[i].url, nodes: info });
	}

	// any node that occurs more than one time is not a candidate.. (unless there's box/row containers we want to remove?)
	nodeInfos.sort(function(a, b) { return b.count - a.count }); // descending count
	//console.log("nodes:", nodeInfos)

	// filter the ones that occur mot than once
	var dupes = [];
	for (var i=0; nodeInfos.length>i; i++)
		if (nodeInfos[i].count > 1) dupes.push(nodeInfos[i].id);

	//console.log("dupes:", dupes);

	// remove dupes from hierarchies
	for (var i=0; cart.length>i; i++)
	{
		for (var j=0; cart[i].nodes.length>j; j++)
		{
			// first dupe marks end of chain
			if (dupes.indexOf(cart[i].nodes[j].id) >= 0)
			{
				// mark as dupe
				cart[i].nodes[j].shared = true;

				//// chop off remainder
				//cart[i].nodes.splice(j);
				//break;
			}
		}
	}
	//console.log("sending", cart);

	callback(cart);
}

//setTimeout(startSiteAddAssistant, 1500);

var prevHover = null;

var messageHandlers =
{
	'startSiteAddAssistant': startSiteAddAssistant,
	'endSiteAddAssistant': endSiteAddAssistant,
	'querySiteAddAssistant': querySiteAddAssistant,
	'previewSiteAddAssistant': previewSiteAddAssistant
}

// handle messages from background script and popup
chrome.runtime.onMessage.addListener(function(msg, sender, callback)
{
	console.log("onMessage: msg: %o, sender: %o", msg, sender);
	var handler = messageHandlers[msg.type];
	if (handler != null) handler(msg, sender, callback);
});

var styleTemplate = null;

loadExtensionResource('/inject.css', function(err, status, content)
{
	chrome.storage.local.get(function(values)
	{
		styleTemplate = content;
		//console.log("template = " + content)

		//console.log(logPrefix, "Got values from storage: %o", values);

		// monkey-patch the defaults if the settings haven't been saved yet
		if (!values || !values.siteRules)
		{
	      for (var i=0; defaultSiteRules.length>i; i++)
	        for (var j=0; defaultSiteRules[i].contentGroups.length>j; j++)
	        {
	          var g = defaultSiteRules[i].contentGroups[j];
	          g.enabled = (g.default == null ? true : g.default);
	        }
	       values.siteRules = defaultSiteRules;
		}

		process(values.options || {}, values.siteRules);
	});
})

function process(options, siteRules)
{
	var site = findSite(siteRules);
	if (site == null) return;

	var seen = {}; // a list of seen ids or whatever we've encountered and patched

	// apply CSS image filter options
	applyFilterOptions(options);

	log.group();

	try
	{
		var cache = buildCache(site);

		// find all links
		var links = document.getElementsByTagName("a");

		for (var i=0; links.length>i; i++)
		{
			var a = links[i];
			try
			{
				// don't waste time if it's a non-http link
				if (!a.protocol.match(/^https?:$/i)) continue;

				// find any matching rules..
				var match = null;
				for (var j=0; cache.length>j; j++)
				{
					var rule = cache[j];
					if (rule.host.test(a.hostname) && rule.path.test(a.pathname))
					{
						match = rule;
						break;
					}
				}

				// no match?
				if (match == null)
				{
					//console.log(logPrefix, "not a match:", a.href);
					continue; // skip
				}

				// hunt for parent <div> with certain selectors
				//console.log(logPrefix, "link #" + i + " = ", a.href, "matched", match);
				var p = a.parentNode;
				while (p != null && p !== document.body && p !== document)
				{
					//if ((p.className || "").match(/\b(article-extract|article-extract-full)\b/i))
					if (match.site.parentSelector.test(p.className || ""))
					{
						//console.log(logPrefix, "found outer <div>")
						var id = p.id || p.getAttribute(match.site.idAttribute || "name");

						// if it doesn't have an id, add one now
						if (id == null)
						{
							id = styleSelector + "_noid_" + Math.floor(Math.random() * 0xFFFFFFFF);
							p.id = id;
						}

						if (id && seen[id])
						{
							//console.log(logPrefix, "already patched");
							p = null;
						}
						break;
					}
					p = p.parentNode;
				}
				if (p == null || p === document || p === document.body) continue;

				seen[id] = true;
				blockedCount++;
				match.contentGroup.count++;

				// common
				var div = document.createElement("div");
				div.id = blockIdPrefix + id;
				div.className = styleSelector;

				if (match.site.setSizeOnParent)
				{
					p.style.width = p.clientWidth + "px";
					p.style.height = p.clientWidth + "px";
				}

				if (match.site.setRelativePositionOnParent)
				{
					p.style.position = "relative";
				}

				switch (match.site.overlaySize)
				{
					case "client":
						div.style.width = p.clientWidth + "px";
						div.style.height = p.clientHeight + "px";
						break;

					case "100%":
						div.style.width = "100%";
						div.style.height = "100%";
						break;
				}

				injectCSS(match.site.injectCSS);

				var m = options.replaceWith;
				//if (m == "random") m = modes[Math.floor(Math.random() * modes.length)];

				var color = match.contentGroup.color || (match.contentGroup.category != null ? defaultCategoryColors[match.contentGroup.category] : null) || "#ffffff"; // "rgba(255,255,255,0.95)";
				match.contentGroup.color = color; // override from now on

				if (m.match(/^place/))
				{
					// find the template
					var u = "http://placekitten.com/{width}/{height}"; // just in case..
					for (var z=0; replacementMethods.length>z; z++)
						if (replacementMethods[z].id == m)
						{
							u = replacementMethods[z].imageTemplate;
							break;
						}

					// replace parameters
					u = u.replace("{width}", p.clientWidth)
						.replace("{height}", p.clientHeight)
						.replace("{color}", color.substring(1));

					// inject
					div.innerHTML = "<img src='" + u + "' alt='" + blockText + "' title='" + match.contentGroup.title + "' class='placeholderImage' ondblclick='document.getElementById(\"" + blockIdPrefix + id + "\").style.display = \"none\"; return false;'>";
				}
				else if (m == "delete")
				{
					p.style.display = "none";
				}
				else if (m == "empty")
				{
					div.style.backgroundColor = color;
				}
				else
				{
					//console.log(logPrefix, "replacing with default")
					div.style.backgroundColor = color;
					div.style.opacity = "0.97";
					div.style.verticalAlign = "50%";
					div.style.textAlign = "center";
					div.style.fontSize = "9pt";
					div.style.fontFamily = "Arial";
					div.innerHTML = "<br><br><img class='logo' src='" + imageData + "'><br>" + blockText.replace(/\n/, "<br/>", "g") + "<br /><br />(" + match.contentGroup.title + ")<br /><br />"
						+ "<a href='#' onclick='document.getElementById(\"" + blockIdPrefix + id + "\").style.display = \"none\"; return false;'>Jeg vil meg selv vondt</a>";
					//+ "<input type='button' onclick='document.getElementById(\"" + blockIdPrefix + id + "\").style.display = \"none\"' value='Jeg vil meg selv vondt' />";
				}

				p.appendChild(div);
			}
			catch (e)
			{
				log.error(logPrefix, "oops: %o, %o", e, a);
			}
		}

		var stats = [];
		for (var i=0; siteRules.length>i; i++)
		{
			for (var j=0; siteRules[i].contentGroups.length>j; j++)
			{
				var g = siteRules[i].contentGroups[j];
				if (g.count > 0)
				{
					delete g.rules; // we're done with this anyhow
					stats.push(g);
				}
			}
		}

		//console.log(logPrefix, "dispatching message to background script..")
		chrome.runtime.sendMessage(
		{
			type: 'stats',
			count: blockedCount,
			stats: stats
		},
		function(response)
		{
			//console.log(logPrefix, "got response: %o", response);
		});
	}
	catch (e)
	{
		log.error("ERROR:", e)
	}
	finally
	{
		log.groupEnd();
	}
}

function findSite(siteRules)
{
	var host = document.location.hostname || "";
	var path = document.location.pathname || "/";

	for (var i=0; siteRules.length>i; i++)
	{
		var site = siteRules[i];

		if ((new RegExp(site.host, "i")).test(host) && (new RegExp(site.path || "", "i")).test(path))
			return site;
	}

	return null;
}

function buildCache(site)
{
	var cache = [];

	site.parentSelector = new RegExp(site.parentSelector, "i");

	for (var j=0; site.contentGroups.length>j; j++)
	{
		var cg = site.contentGroups[j];
		cg.count = 0;

		if (cg.enabled !== true) continue;

		for (var k=0; cg.rules.length>k; k++)
		{
			var rule = cg.rules[k];
			cache.push(
			{
				site: site,
				contentGroup: cg,
				host: new RegExp(rule.host, "i"),
				path: new RegExp(rule.path, "i")
			})
		}
	}

	//console.log(logPrefix, "Cache built:", cache)
	return cache;
}

function injectCSS(extra)
{
	if (cssInjected) return;

	cssInjected = true;

	var styleNode = document.createElement('style');

	var css = styleTemplate;
	var args = {
		'selector': styleSelector,
		'siteCSS': extra,
		imageFilters: buildFilters()
	};

	//console.log("css args", args);

	for (var i in args)
	{
		css = css.replace(new RegExp('\\$' + i + '\\$', 'g'), args[i]);
	}

	//console.log("injected CSS\n", css)

	styleNode.innerHTML = css;

	document.body.appendChild(styleNode);
}

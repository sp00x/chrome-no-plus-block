////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// website add assistant
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var astCart = null;
var astEventListenersAdded = false;
var astKnownNodes = [];
var astPreviousPreviewNode = null;
var astPreviousPreviewClass = null;
var astStyleElement = null;
var astCssTemplate = null;

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

var astPanelEl = null;

document.addEventListener("DOMContentLoaded", function()
{
  var resizer = document.getElementById("resizerTop");

})

function astGetPanel()
{
	if (astPanelEl == null)
	{
		// inject the main content script's CSS
		injectCSS(''); // from common.js!

		// inject the site assistant css portion
		var sel = '_' + Math.floor(Math.random() * 0xFFFFFFFF) + '_' + Date.now();
		var vars = { 'selector': sel };
		var style = document.createElement("style");
		style.innerHTML = substituteTemplateVars(astCssTemplate, vars);
		document.body.appendChild(style);

		var el = document.createElement("div");
		el.id = sel + '_website_add_assistant';
		el.className = '_website_add_assistant_bottom'; // TODO randomize

		var iframe = document.createElement("iframe");
		iframe.src = chrome.extension.getURL("/assistant.html");
		el.appendChild(iframe);

		var resizer = document.createElement("div");
		resizer.className = "_resizer";
		el.appendChild(resizer);

		var y = null;
		var my = null;
		var sz = null;

		var pos = "bottom";

		resizer.addEventListener("mousedown", function(e)
		{
			//console.log("mousedown")
			e.preventDefault();
			sz = iframe.clientHeight;
			y = my; // whatever it is now
			return false;
		})

		iframe.addEventListener("mousemove", function(e)
		{
			//console.log("iframe.move", e.y);
		})

		resizer.addEventListener("dblclick", function()
		{
			iframe.height = iframe.contentWindow.document.body.scrollHeight;
		});

		window.addEventListener("mousemove", function(e)
		{
			//console.log("window.move", e.y);

			my = e.y;

			if (sz != null)
			{
			  var dy = my - y;
			  //console.log("drag", dy);

			  if (dy != 0)
			  {
			  	iframe.height = sz + (pos == "top" ? 1 : -1) * dy;
			  }
			}
		})

		window.addEventListener("mouseout", function(e)
		{
			sz = null;
		})

		window.addEventListener("mouseup", function(e)
		{
			sz = null;
		})

		// title bar
		var tit = document.createElement("span");
		tit.innerHTML = chrome.runtime.getManifest().name;
		resizer.appendChild(tit);

		// close button
		var clo = document.createElement("a");
		clo.setAttribute("title", "Close/end the assistant")
		clo.onclick = function() { alert("close") }
		clo.innerHTML = "&#xf057;" //"&#xf00d;"
		resizer.appendChild(clo);

		// "move to bottom" button
		var togDn = document.createElement("a");
		togDn.onclick = function()
		{
			el.className = '_website_add_assistant_bottom'; // TODO randomize
			togUp.style.display = "inline";
			togDn.style.display = "none";
			pos = "bottom";
		}
		togDn.className = "_move_bottom";
		togDn.setAttribute("title", "Move to bottom")
		togDn.innerHTML = "&#xf0ab;"
		resizer.appendChild(togDn);

		// "move to top" button
		var togUp = document.createElement("a");
		togUp.onclick = function()
		{
			el.className = '_website_add_assistant_top'; // TODO randomize
			togDn.style.display = "inline";
			togUp.style.display = "none";
			pos = "top";
		}
		togUp.setAttribute("title", "Move to top")
		togUp.className = "_move_top";
		togUp.innerHTML = "&#xf0aa;"
		resizer.appendChild(togUp);

		// listen to messages from the iframe
		window.addEventListener("message", function(e)
		{
			console.log("main: incoming window message: %o, %o", e, e.data)

			var handler = messageHandlers[e.data.type];
			if (handler != null)
			{
				handler(e.data, {}, function(response)
				{
					// respond by prefixing event name with "-"
					console.log("main: posting response to iframe..")
					iframe.contentWindow.postMessage({ type: '-' + e.data.type, data: response }, '*')
				})
			}

		}, false);

		// inject the panel & remember for later
		document.body.appendChild(el);
		astPanelEl = el;
	}
	return astPanelEl;
}

function astShowPanel(msg, timeout)
{
	var el = astGetPanel();
	el.style.display = 'block';		
	if (timeout && timeout > 0)	setTimeout(astHidePanel, timeout);
}

function astHidePanel()
{
	var el = astGetPanel();
	e.style.display = "none";
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
	function fin()
	{
		console.log("Starting site-add assistant")
		if (astCart == null) astCart = []; // new cart

		if (!astEventListenersAdded)
		{			
			console.log("Adding event listeners");
			document.addEventListener("click", function(e) { return astCheckEvent(e, 'click') });
			eventListenersAdded = true;
		}

		console.log("Showing panel")
		astShowPanel();

		console.log("done");

		// display the fixed element to call attention to the badge button
		//astShowPanel('Click any article links on the page, then press the [icon] badge to process..')
		//chrome.runtime.sendMessage({ type: 'siteAddAssistUpdate', count: astCart.length }, function() { });

		// callback
		if (callback && typeof callback == 'function') callback();
	}

	if (astCssTemplate == null)
	{
		console.log("loading site assistant css..")
		loadExtensionResource("/content_script_site_assistant.css", function(err, status, text)
		{
			console.log("site assistant css loaded")
			astCssTemplate = text;
			fin();
		})
	}
	else
		fin();
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

log.debug("############ content_script.js ############");

var logPrefix = "+BLOCK: "
var blockIdPrefix = "plusblockoverlay_";
var blockedCount = 0;
var blockedStats = {};

var cssInjected = false;

var blockText = "Content blocked\nForYourOwnGood&trade;";
var imageData = "data:image/png;base64,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";

// randomize selector so it can't be easily counter-blocked
var styleSelector = "plusblockoverlay" + Math.floor(Math.random() * 0xFFFFFFFF);

// keep track of which link was last pressed, since that is not available to the
// menu click handler in the background script
var lastContextMenuElement = null;
document.addEventListener("contextmenu", function(e)
{
	lastContextMenuElement = e.srcElement;
});

var styleTemplate = null;

console.log("loading css..")
loadExtensionResource('/inject.css', function(err, status, content)
{
	styleTemplate = content;

	console.log("loading config..")
	chrome.storage.local.get(function(values)
	{
		if (document.location.hostname.indexOf("spoox.org") > -1)
			startSiteAddAssistant();

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

	var args = {
		'selector': styleSelector,
		'siteCSS': extra,
		'imageFilters': buildFilters()
	};

	//console.log("css args", args);

	var css = substituteTemplateVars(styleTemplate, args);

	//console.log("injected CSS\n", css)

	styleNode.innerHTML = css;

	document.body.appendChild(styleNode);
}

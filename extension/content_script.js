(function()
{
	console.log("############ content_script.js ############");

	var rules =
	{
		'sport':
		{
			title: 'Sport',
			color: '#cfc',
			rules:
			[
				{
					host: 'vg\\.no$',
					path: '^/sport/'
				},
				{
					host: 'vgsporten\\.vg\\.no$',
					path: ''
				}
			]
		},
		'pluss':
		{
			title: 'VG+',
			color: '#fcc',
			rules:
			[
				{
					host: 'vg\\.no$',
					path: '^/pluss'
				},
				{
					host: 'pluss\\.vg\\.no$',
					path: ''
				}
			]
		},
		'minmote':
		{
			title: 'Min mote',
			color: '#fcf',
			rules:
			[
				{
					host: 'minmote\\.no$',
					path: ''
				}
			]
		},
		'rampelys':
		{
			title: 'Rampelys',
			color: '#ccf',
			rules:
			[
				{
					host: 'vg\\.no$',
					path: '^/rampelys/',
				}
			]
		},
		'vektklubb':
		{
			title: 'Vektklubb',
			color: '#cff',
			rules:
			[
				{
					host: 'vektklubb\\.no$',
					path: '',
				}
			]
		}
	}

	var cache = [];

	for (var i in rules)
	{
		var set = rules[i];
		set.count = 0;
		for (var j=0; set.rules.length>j; j++)
		{
			cache.push(
			{
				host: new RegExp(set.rules[j].host, "i"),
				path: new RegExp(set.rules[j].path, "i"),
				rule: set
			})
		}
	}

	console.log("cache = %o", cache)

	//var mode = "placekitten";
	var modes = [ "default", "placekitten", "placeboobs" ];

	var mode = "default";
	var logPrefix = "+BLOCK: "
	var blockIdPrefix = "plusblockoverlay_";
	var blockedCount = 0;
	var blockedStats = {};

	var blockText = "Innhold blokkert for\nDeres Eget Beste&trade;";

	var imageData = "data:image/png;base64,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";

	console.group();
	try
	{
		var links = document.getElementsByTagName("a");

		var seenIds = {};

		// inject style

    	var styleNode = document.createElement('style');
    	var styleSelector = "plusblockoverlay" + Math.floor(Math.random() * 0xFFFFFFFF);
    	styleNode.innerHTML = "." + styleSelector + " {\
z-index: 4000;\
width: 100%;\
height: 100%;\
position: absolute;\
left: 0px;\
top: 0px;\
padding: 0px;\
margin: 0px;\
overflow: hidden;\
}\
\
." + styleSelector + " input {\
	padding: 4px;\
}";

    	document.body.appendChild(styleNode);

		for (var i=0; links.length>i; i++)
		{
			var a = links[i];
			try
			{
				//if (a.protocol.match(/^https?:$/i) && a.hostname.match(/pluss\.vg\.no$/i))
				if (a.protocol.match(/^https?:$/i))
				{
					var matchedRule = null;
					for (var j=0; cache.length>j; j++)
					{
						var r = cache[j];
						if (r.host.test(a.hostname) && r.path.test(a.pathname))
						{
							matchedRule = r.rule;
							break;
						}
					}

					if (matchedRule == null)
					{
						console.log(logPrefix, "not a match:", a.href);
						continue; // skip
					}

					// hunt for parent <div> with certain classes				
					console.log(logPrefix, "link #" + i + " = ", a.href, "matched", matchedRule);
					var p = a.parentNode;
					while (p != null && p != document.body && p != document)
					{
						if ((p.className || "").match(/\b(article-extract|article-extract-full)\b/i))
						{
							var id = p.id;
							if (id && seenIds[id])
							{
								console.log(logPrefix, "already patched");
								break;
							}
							seenIds[id] = true;

							blockedCount++;

							matchedRule.count++;

							console.log(logPrefix, "found outer <div>")

							// common
							var div = document.createElement("div");
							div.id = blockIdPrefix + id;
							div.className = styleSelector;

							var m = mode;
							if (m == "random") m = modes[Math.floor(Math.random() * modes.length)];

							var imStyle = " style='-webkit-filter: saturate(70%) contrast(60%)'";

							switch (m)
							{
								case "placekitten":
									// place kittuhn!
									console.log(logPrefix, "replacing with place kitten")
									div.innerHTML = "<img src='http://placekitten.com/" + p.clientWidth + "/" + p.clientHeight + "' alt='" + blockText + "'" + imStyle + ">";
									break;

								case "placeboobs":
									console.log(logPrefix, "replacing with place boobs")
									div.innerHTML = "<img src='http://worksafe.placeboobs.com/" + p.clientWidth + "/" + p.clientHeight + "' alt='" + blockText + "'" + imStyle + ">";
									break;

								default:
									console.log(logPrefix, "replacing with default")
									div.style.backgroundColor = matchedRule.color || "rgba(255,255,255,0.95)";
									div.style.opacity = "0.95";
									div.style.verticalAlign = "50%";
									div.style.textAlign = "center";
									div.style.fontSize = "9pt";
									div.style.fontFamily = "Arial";
									div.innerHTML = "<br><br><img src='" + imageData + "'><br>" + blockText.replace(/\n/, "<br/>", "g") + "<br /><br />(" + matchedRule.title + ")<br />"
										+ "<input type='button' onclick='document.getElementById(\"" + blockIdPrefix + id + "\").style.display = \"none\"' value='Jeg vil meg selv vondt' />";
									break;
							}

							p.appendChild(div);
							break;
						}
						p = p.parentNode;
					}
				}
			}
			catch (e)
			{
				console.error("oops: %o, %o", e, a);
			}
		}

		//console.log("rules = %o", rules);

		if (blockedCount > 0)
		{
			console.log(logPrefix, "dispatching message to background script..")
			chrome.runtime.sendMessage(
			{
				type: 'stats',
				count: blockedCount,
				rules: rules
			},
			function(response)
			{
				console.log(logPrefix, "got response: %o", response);
			});

		}
	}
	finally
	{
		console.groupEnd();
	}

})();

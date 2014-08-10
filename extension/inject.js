try
{
	chrome.runtime.sendMessage(
		'fmeiplalbodjonkeikeghimjmlocdcin',
		{ hello: 'world' },
		function(response)
		{
			alert("got response");
			alert("response: " + response)
		}
	);
}
catch (e)
{
	alert("error");
	alert(e);
}
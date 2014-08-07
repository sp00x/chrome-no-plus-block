var arg = {};

var query = document.location.search || "";
if (query && query.length>0) query = query.substring(1);
if (query != "")
{
	arg = JSON.parse(unescape(query));
}

//chrome.tabs.query({ active: true, currentWindow: true }, function tabsQueried(tabs) { chrome.runtime.sendMessage({ type: 'reset', tabId: arg.tabId }) });

////

angular.module("assistantApp", [])

  .controller("AboutController", [ '$scope', function($scope)
  {
    $scope.manifest = chrome.runtime.getManifest();
  }])

  .controller('AssistantController', [ '$scope', function($scope)
  {
    $scope.url = arg.url;
  	$scope.host = "host";
  	$scope.path = "path";
  	$scope.nodes = [];

  	$scope.click = function(n)
  	{
		sendToContentScript({ type: 'clickAssistant', index: $scope.nodes.indexOf(n) })
  	}

  	$scope.hover = function(n)
  	{
		sendToContentScript({ type: 'hoverAssistant', index: $scope.nodes.indexOf(n) })
  	}

  	sendToContentScript({ type: 'queryAssistant' }, function(info)
  	{
  		$scope.$apply(function()
  		{
	  		$scope.json = JSON.stringify(info, null, '  ');
	  		$scope.nodes = info;  			
  		})
  	})

  }])

function sendToContentScript(msg, cb)
{
  // find the current (active) tab
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true
    },
    function tabsQueried(tabs)
    {
      // send the message to it
      chrome.tabs.sendMessage(
        tabs[0].id,
        msg,
        cb
      );
    }
  );
}




angular.module("detailsApp", [])

  .controller("AboutController", [ '$scope', function($scope)
  {
    $scope.manifest = chrome.runtime.getManifest();
  }])

  .controller('DetailsController', [ '$scope', function($scope)
  {
    $scope.stats = [];
    $scope.count = 0;

    var query = document.location.search || "";
    if (query && query.length>0) query = query.substring(1);
    if (query != "")
    {
      var arg = JSON.parse(unescape(query));

      //arg.stats.sort(function(a,b) { return a.title.localeCompare(b.title) })
      arg.stats.sort(function(a,b) { return b.count - a.count; })

      $scope.count = arg.count;
      $scope.stats = arg.stats;
    }
    console.log($scope.stats);
  }])

//prompt("", document.location);

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

document.addEventListener("DOMContentLoaded",
  function domContentLoaded()
  {
    document.getElementById("blockedHeader").onclick = function() { sendToContentScript({ type: 'popup-assist' }) };
  },
  false );

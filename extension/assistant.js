var arg = {};

var query = document.location.search || "";
if (query && query.length>0) query = query.substring(1);
if (query != "")
{
	arg = JSON.parse(unescape(query));
}

//chrome.tabs.query({ active: true, currentWindow: true }, function tabsQueried(tabs) { chrome.runtime.sendMessage({ type: 'reset', tabId: arg.tabId }) });

////

function log(msg)
{
  chrome.runtime.sendMessage({ type: 'log', text: msg });
}

window.onerror = function(msg, url, line, col, error)
{
  log("error");
  //log("Unhandled error in assist.js: " + msg + ": " + line+":"+col + ": " + error);
}


angular.module("assistantApp", [])

  .filter('property', function()
  {
    return function(object, propertyName)
    {
      return object[propertyName];
    }
  })

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
    $scope.styles = [];
    $scope.nodeIndex = 0;
    $scope.excludeCommonNodes = true;
    $scope.selectorFilter = { shared: '' };
    $scope.showSelectors = true;
    $scope.showXPath = false;
    $scope.wildcardStyles = {};
    $scope.previewNode = null;

    function updatePreview()
    {
      var previewStyles = [];
      
      for (var i=0; $scope.styles.length>i; i++)
      {
        var s = $scope.styles[i];
        if (s.selected)
        {
          if ($scope.wildcardStyles[s.name] != null)
          {
            var list = $scope.wildcardStyles[s.name];
            for (var j=0; list.length>j; j++) previewStyles.push(list[j]);

            //previewStyles.concat( $scope.wildcardStyles[s.name] ) // for some reason this doesn't work??
            //previewStyles.concat(list)
          }
          else
            previewStyles.push(s.name);
        }
      }

      var nodeId = $scope.previewNode == null ? null : $scope.previewNode.id;
      
      var ev = { type: 'previewSiteAddAssistant', styles: previewStyles, nodeId: nodeId }
      log("preview:" + JSON.stringify(ev))
      sendToContentScript(ev);
    }

    $scope.$watch('styles', updatePreview, true);
    $scope.$watch('previewNode', updatePreview, true);

    var selected = null;

    $scope.removeLink = function(link)
    {
      var i = $scope.nodes.indexOf(link);
      $scope.nodes.splice(i, 1);
    }

    $scope.hoverNode = function(link, node)
    {
      log("hoverNode " + link.nodes.indexOf(node));

      $scope.previewNode = node;

      if (link == null || node == null)
      {
        for (var i=0; $scope.styles.length>i; i++)
          $scope.styles[i].present = false;
      }
      else
      {
        for (var i=0; $scope.styles.length>i; i++)
        {
          $scope.styles[i].present = !!node.styles[$scope.styles[i].name];
        }
      }
    }

    log("init assistant")

    sendToContentScript({ type: 'querySiteAddAssistant' }, function(info)
    {
      $scope.$apply(function()
      {
        $scope.json = JSON.stringify(info, null, '  ');
        $scope.nodes = info;

        var wildcardStyles = {};
        var styles = {};
        for (var i=0; info.length>i; i++)
        {
          var link = info[i];
          for (var j=0; link.nodes.length>j; j++)
          {
            var node = link.nodes[j];
            var localStyles = {};
            (node.attrs.class || "").split(/\s/).map(function(s)
            {
              if (s.trim().length)
              {
                if (styles[s] == null) styles[s] = 0;
                styles[s]++;
                localStyles[s] = true;

                // does this end with a number? (sometimes there's selectors for different article box widths)
                if (s.match(/^(.+?)(\d+)$/))
                {
                  var wc = RegExp.$1 + '*'
                  localStyles[wc] = true;
                  if (styles[wc] == null) styles[wc] = 0;
                  styles[wc]++;

                  // register which ones we've seen
                  if (wildcardStyles[wc] == null) wildcardStyles[wc] = [];
                  wildcardStyles[wc].push(s);
                }
              }
            })
            node.styles = localStyles;
          }
        }

        // flag the shared styles
        var sharedStyles = {};
        for (var i in styles)
          if (styles[i] == info.length) sharedStyles[i] = true;

        var list = [];
        for (var k in styles)
        {
          list.push({ name: k, count: styles[k], present: false, shared: !!sharedStyles[k] });
        }

        $scope.wildcardStyles = wildcardStyles;
        $scope.styles = list;
      })
    })

    $scope.end = function()
    {
      sendToContentScript({ type: 'endSiteAddAssistant' });
    }

  	$scope.click = function(n)
  	{
      if (selected == n)
      {
        selected = null;
      }
      else
      {
        selected = n;      
        sendToContentScript({ type: 'hoverAssistant', index: $scope.nodes.indexOf(n) })
		    sendToContentScript({ type: 'clickAssistant', index: $scope.nodes.indexOf(n) })
      }
  	}

  	$scope.hover = function(n)
  	{
      if (selected == null)
		    sendToContentScript({ type: 'hoverAssistant', index: $scope.nodes.indexOf(n) })
  	}

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


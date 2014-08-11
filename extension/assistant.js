/*
// connect to the content script so it can detect when this window closes
chrome.tabs.query({ active: true, currentWindow: true }, function(tabs)
{
  var tab = tabs[0];
  var port = chrome.tabs.connect(tab.id, {name: "siteAddAssistant"});
});
*/

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
    $scope.mode = "collect";

  	$scope.nodes = [];
    $scope.styles = [];
    $scope.nodeIndex = 0;
    $scope.excludeCommonNodes = true;
    $scope.selectorFilter = { shared: '' };
    $scope.showSelectors = true;
    $scope.showXPath = false;
    $scope.wildcardStyles = {};
    $scope.previewNode = null;
    $scope.previewMethod = "overlay";

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
      
      var ev = { type: 'previewSiteAddAssistant', styles: previewStyles, nodeId: nodeId, method: $scope.previewMethod };
      log("preview:" + JSON.stringify(ev))
      sendToContentScript(ev);
    }

    $scope.$watch('styles', updatePreview, true);
    $scope.$watch('previewNode', updatePreview, true);
    $scope.$watch('previewMethod', updatePreview, true);

    var selected = null;

    window.addEventListener("message", function(e)
    {
      console.log("window message received by iframe: %o", e.data)
      if (e.data.type == '-querySiteAddAssistant')
      {
        analyzeMain(e.data.data);
      }
    }, false);


    $scope.analyze = function()
    {
      sendToContentScript({ type: 'querySiteAddAssistant' });
    }

    $scope.removeLink = function(link)
    {
      var i = $scope.nodes.indexOf(link);
      $scope.nodes.splice(i, 1);
    }

    $scope.hoverNode = function(link, node)
    {
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

    $scope.toggleSelector = function(selector)
    {
      for (var i=0; $scope.styles.length>i; i++)
      {
        var s = $scope.styles[i];
        if (s.name == selector)
        {
          s.selected = !s.selected;
        }
      }
    }

    log("init assistant")

    function analyzeMain(info)
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

        $scope.mode = "analyze";
      })
    }

    $scope.end = function()
    {
      sendToContentScript({ type: 'endSiteAddAssistant' });
    }

  }])

function sendToContentScript(msg, cb)
{
  window.parent.postMessage(msg, '*') 

  /*
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
  */
}


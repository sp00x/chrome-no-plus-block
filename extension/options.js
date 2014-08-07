function makeId()
{
  return "N-" + Date.now() + "-" + Math.floor(Math.random() * 0xFFFFFFFF);
}

var app = angular.module('optionsApp', [])

  .controller("AboutController", [ '$scope', function($scope)
  {
    $scope.manifest = chrome.runtime.getManifest();
  }])

  .controller('OptionsController', ['$scope', '$rootScope', function($scope, $rootScope)
  {
    $scope.tab = 'websites';

    $scope.addRule = function(cg)
    {
      cg.rules.push({ host: '', path: '' });
    }

    $scope.addContentGroup = function(site)
    {
      site.contentGroups.push({ id: makeId(), title: 'Untitled', category: '*', rules: [], enabled: true })
    }

    $scope.import = function(data)
    {
      var data = data || prompt("Import site configuration:", "");
      if (data != null && data.length > 0)
      {
        try
        {
          var json = Base64.decode(data);
          var obj = JSON.parse(json);
          if (obj.type == 'site')
          {
            $scope.siteRules.push(obj.data);
          }
          else throw new Error("Unknown type: '" + obj.type + "'")
          
        }
        catch (e)
        {
          alert("ERROR: " + e)
        }
      }
    }

    $scope.addSite = function()
    {
      $scope.siteRules.push({
        id: makeId(),
        title: 'New site',
        host: '(^|\\.)(example|xmpl)\\.org$',
        parentSelector: '\\b(xx1yy1zz1|yy1xx1bb1)\\b',
        injectCSS: 'width: 100%;\nheight: 100%;\nposition: absolute;\nleft: 0px;\ntop: 0px;',
        contentGroups: [ ] })
    }

    $scope.deleteRule = function(cg, rule)
    {      
      if (!(rule.host.trim() == rule.path.trim() == "") || confirm("Delete rule? (no undo)"))
        cg.rules.splice(cg.rules.indexOf(rule), 1);
    }

    $scope.deleteContentGroup = function(site, cg)
    {
      if (confirm("Delete content group '" + cg.title + "'? (no undo)"))
        site.contentGroups.splice(site.contentGroups.indexOf(cg), 1);
    }

    $scope.deleteSite = function(site)
    {
      if (confirm("Delete web site '" + site.title + "'? (no undo)"))
        $scope.siteRules.splice($scope.siteRules.indexOf(site), 1);
    }

    function copyDeep(obj, filter)
    {
      if (typeof obj == 'object')
      {
        var o = {};
        for (var i in obj)
        {
          if (!filter || !filter.test(i)) o[i] = copyDeep(obj[i], filter);
        }
        return o;
      }
      else
        return obj;
    }

    $scope.exportSite = function(site)
    {
      prompt("Site configuration exported as:", Base64.encode(JSON.stringify({ type: 'site', data: copyDeep(site, /^\$\$/) })));
    }

    $rootScope.categories = categories;

    $rootScope.selectedSite = "db";

    $scope.siteRules = {};    
    $scope.options = {};    
    $scope.saved = false;
    $scope.filters = cssImageFilters;
    $scope.filtersCSS = "";

    var previewCache = {};
    for (var i=0; replacementMethods.length>i; i++)
    {
      //var width = height = 150;
      var r = replacementMethods[i];
      if (r.id.match(/^place/))
      {
        //previewCache[r.id] = r.imageTemplate.replace("{width}", width).replace("{height}", height).replace("{color}", defaultCategoryColors['*'].substring(1));
        previewCache[r.id] = r.imageTemplate.replace("{color}", defaultCategoryColors['*'].substring(1));
      }
    }

    // not sure why we can't have this as a function, but ng-show doesn't work then:
    Object.defineProperty($scope,
      "isPlaceholderImage",
      {
        get: function()
        {
          var r = ($scope.options.replaceWith || "").match(/^place/) != null;
          return r;
        }
      }
    );
    /*$scope.isPlaceholderImage = function()
    {
      var r = ($scope.options.replaceWith || "").match(/^place/) != null;
      return r;
    }*/

    $scope.placeholderPreviewImage = function(width, height)
    {
      try {
      return previewCache[$scope.options.replaceWith].replace("{width}", width).replace("{height}", height);
      } catch (e)
      {
        return "";
      }
    }

    $scope.$watch("siteRules", function() { $scope.saved = false }, true);

    $scope.$watch("options", function() { $scope.saved = false }, true);

    $scope.$watch("filters", function()      
    {
      $scope.filtersCSS = buildFilters();
      $scope.saved = false;
    }, true)

    $scope.replacements = replacementMethods;

    $scope.resetSiteRules = function()
    {
      if (!confirm("This will reset all site rules to the factory defaults. Are you sure you really want to do this?")) return;

      for (var i=0; defaultSiteRules.length>i; i++)
        for (var j=0; defaultSiteRules[i].contentGroups.length>j; j++)
        {
          var g = defaultSiteRules[i].contentGroups[j];
          g.enabled = (g.default == null ? true : g.default);
        }

      $scope.siteRules = defaultSiteRules;
    }

    $scope.save = function()
    {
      $scope.options.imageFilters = {};
      for (var i=0; cssImageFilters.length>i; i++)
      {
        var f = cssImageFilters[i];
        $scope.options.imageFilters[f.filter] = f.value;
      }

      chrome.storage.local.set({ siteRules: $scope.siteRules, options: $scope.options }, function()
      {
        $scope.$apply(function()
        {
          $scope.saved = true;
        })
      })
    }

    // load settings from chrome storage
    chrome.storage.local.get({ siteRules: null, options: { imageFilters: {} } }, function(values)
    {
      //console.log("storage returned: %o", values);

      $scope.$apply(function()
      {
        $scope.siteRules = values.siteRules || defaultSiteRules;
        $scope.options = values.options || { replaceWith: 'default', imageFilters: {} };

        applyFilterOptions($scope.options);
      })
    })
  }])

  .filter('sort', function() // I gave up trying to get orderBy to work as expected..
  {
    return function(input, key)
    {
      var list = [].concat(input);
      list.sort(function(a, b) { return (a[key] || "").localeCompare(b[key] || "")});
      return list;
    }
  })

  .filter('json', function() // I gave up trying to get orderBy to work as expected..
  {
    return function(input, indent)
    {
      return (indent) ? JSON.stringify(input, null, indent) : JSON.stringify(input);
    }
  })

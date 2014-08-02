var app = angular.module('optionsApp', [])

  .controller('OptionsController', ['$scope', function($scope)
  {
    $scope.tab = 'websites';

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


var app = angular.module('optionsApp', [])

  .controller('OptionsController', ['$scope', function($scope)
  {
    $scope.siteRules = {};
    $scope.options = {};
    $scope.saved = false;

    $scope.$watch("siteRules", function() { $scope.saved = false }, true);
    $scope.$watch("options", function() { $scope.saved = false }, true);

    $scope.replacements =
    [
      { id: 'default', title: 'Standardmelding' },
      { id: 'placekitten', title: 'Katter' },
      { id: 'placeboobs', title: 'Pupper' },
      { id: 'empty', title: 'Tomrom' }
    ]

    $scope.resetSiteRules = function()
    {
      for (var i=0; siteRules.length>i; i++)
        for (var j=0; siteRules[i].contentGroups.length>j; j++)
        {
          var g = siteRules[i].contentGroups[j];
          g.enabled = (g.default == null ? true : g.default);
        }

      $scope.siteRules = siteRules;
    }

    $scope.save = function()
    {
      chrome.storage.local.set({ siteRules: $scope.siteRules, options: $scope.options }, function()
      {
        $scope.$apply(function()
        {
          $scope.saved = true;
        })
      })
    }

    chrome.storage.local.get(function(values)
    {
      console.log("storage returned: %o", values);

      $scope.$apply(function()
      {
        $scope.siteRules = values.siteRules || siteRules;
        $scope.options = values.options || { replaceWith: 'default' };
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

/*
chrome.storage.sync.set({
    favoriteColor: color,
    likesColor: likesColor
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });*/
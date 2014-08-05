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

/*

function init()
{
  var query = document.location.search || "";
  if (query && query.length>0) query = query.substring(1);
  if (query != "")
  {
    var arg = JSON.parse(unescape(query));
    var list = document.getElementById("list");

    //arg.stats.sort(function(a,b) { return a.title.localeCompare(b.title) })
    arg.stats.sort(function(a,b) { return b.count - a.count; })

    for (var i=0; arg.stats.length>i; i++)
    {
      var li = document.createElement("li");
      var g = arg.stats[i];
      li.innerHTML = '<span class="colorBox" style="background-color: ' + g.color + '"></span>' + g.title + ": " + g.count;
      list.appendChild(li);
    }

    if (arg.count > 0)
      document.getElementById("stats").style.display = "block";

  }
}

document.addEventListener("DOMContentLoaded", init, false );

*/
angular.module("aboutApp", [])
	.controller("AboutController", [ '$scope', function($scope)
	{
		$scope.manifest = chrome.runtime.getManifest();
	}])

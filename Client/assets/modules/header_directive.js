var myApp = angular.module('app', []);

myApp.directive("header", function() {
  return {
    restrict: 'A',
    templateUrl: '../views/header.html',
    scope: true,
    transclude : false,
    controller: 'HeaderController'
  };
});
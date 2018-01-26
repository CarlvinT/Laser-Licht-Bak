
var app = angular.module('lightApp', ['rzModule', 'ngRoute', 'ngAnimate', ]);

app.config(function($routeProvider, $httpProvider) {

    $httpProvider.defaults.headers.get = {};
    
    $routeProvider
    .when("/", {
        templateUrl : "main.html",
        controller  : 'MainController'
    })
    .when("/Dashboard", {
        templateUrl : "dashboard.html",
        controller  : 'DashboardController'
    })
    .when("/Tools", {
    	templateUrl : "tools.html",
    	controller  : 'ToolsController'
    })
});

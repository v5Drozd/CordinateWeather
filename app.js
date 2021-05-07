var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']);

weatherApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/home.html',
            controller: 'homeController'

        })
        .when('/forecast', {
            templateUrl: 'pages/forecast.html',
            controller: 'forecastController'

        })
        .when('/forecast/:days', {
            templateUrl: 'pages/forecast.html',
            controller: 'forecastController'

        })


})







weatherApp.service('weatherService', function () {

    
    var NemirovskeShose = 
    {
    "naeme": "Немирівське Шосе 84",
    "lat":"49.22687458369613",
    "lon":"28.53870771897157"
    }
    
    let IakovaShepeliaSt =
    {
    "name": "Якова Штепеля",
    "lat":"49.208530306399346",
    "lon":"22.849301837142939"
    }

    let BarskeShose =
    {
    "name": "Якова Штепеля",
    "lat":"49.23710269520618",
    "lon":"28.398134459453864"
    }

    ChysteMisto = {NemirovskeShose,IakovaShepeliaSt,BarskeShose};



    var self = this;
    this.city = 'City'


})

weatherApp.controller('homeController', ['$scope', 'weatherService','$resource', function ($scope, weatherService, $resource) {

    $scope.city = weatherService.city;

    $scope.$watch('city', function () {
        weatherService.city = $scope.city;

    })
}]);


weatherApp.controller('forecastController', ['$scope', 'weatherService', '$resource', '$routeParams',function ($scope, weatherService, $resource, $routeParams) {
    $scope.city = weatherService.city;

    $scope.days = $routeParams.days || 2;

    $scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast",
    {callback: "JSON_CALLBACK"},  {get:{ method:"JSONP"}});
 
    $scope.weatherResault = $scope.weatherAPI.get({q:$scope.city, appid:'6704185231a3fc5312b081a7659a853b'});
    console.log($scope.weatherResault);


    $scope.convertToFahrenheit = function(degK){
           return Math.round((1.8*(degK-273)));
    
        }

        $scope.convertToDate = function(dt){
           return new Date(dt * 1000);
     
         }  
}])


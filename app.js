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

weatherApp.service('storeData', function () {

    var chMistoNemirovskeShose =
    {
        "name": "Немирівське Шосе 84",
        "lat": "49.22687458369613",
        "lon": "28.53870771897157"
    }

    let chMistoIakovaShepeliaSt =
    {
        "name": "Якова Штепеля",
        "lat": "49.208530306399346",
        "lon": "22.849301837142939"
    }

    let chMistoBarskeShose =
    {
        "name": "Барське Шосе",
        "lat": "49.23710269520618",
        "lon": "28.398134459453864"
    }

    let storedLocation = [chMistoNemirovskeShose, chMistoIakovaShepeliaSt, chMistoBarskeShose];
    this.storedLocation = storedLocation;

    let numberDayToDayName = new Map();
    numberDayToDayName.set(1, 'Sunday');
    numberDayToDayName.set(2, 'Monday');
    numberDayToDayName.set(3, 'Tuesday');
    numberDayToDayName.set(4, 'Wednesday');
    numberDayToDayName.set(5, 'Thursday');
    numberDayToDayName.set(6, 'Friday');
    numberDayToDayName.set(0, 'Saturday');

    this.numberDayToDayName = numberDayToDayName;


})


weatherApp.service('weatherService', ['storeData', function (storeData) {



    // var self = this;
    this.city = 'City'
    this.chystiMista = storeData.storedLocation;
    this.searchingLocation = "";
}]);

weatherApp.controller('homeController', ['$scope', 'weatherService', '$resource', 'storeData', function ($scope, weatherService, $resource, storeData) {


    $scope.chystiMista = weatherService.chystiMista;

    $scope.$watch('searchingLocation', function () {

        weatherService.searchingLocation = $scope.searchingLocation;

    })
}]);


weatherApp.controller('forecastController', ['$scope', 'weatherService', '$resource', '$routeParams', 'storeData', function ($scope, weatherService, $resource, $routeParams, storeData) {

    $scope.locatoinName = weatherService.searchingLocation.name;
    searvhingLat = weatherService.searchingLocation.lat;
    searvhingLon = weatherService.searchingLocation.lon;

    timeZone = 3;

    $scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast",
        { callback: "JSON_CALLBACK" }, { get: { method: "JSONP" } });

    this.weatherResault = $scope.weatherAPI.get({
        lat: searvhingLat,
        lon: searvhingLon,
        appid: '6704185231a3fc5312b081a7659a853b',
        units: 'metric',
        lang: 'ua'
    }).$promise.then(function (allWeatherList) {

        dayToWhetherResponceInstance = new Map()
        allWeatherList.list.forEach((wheatherInstance) => {
            let currentDate = new Date(wheatherInstance.dt * 1000).addHours(3);
            let numbDayInWeek = currentDate.getDay();

            let dd = String(currentDate.getDate()).padStart(2, '0');
            let mm = String(currentDate.getMonth() + 1).padStart(2, '0');
            let today = dd + '/' + mm + ' ' + currentDate.getHours() + ":" + currentDate.getMinutes();

            wheatherInstance.dt_txt = today;

            if (!dayToWhetherResponceInstance.has(numbDayInWeek)) {
                dayToWhetherResponceInstance.set(numbDayInWeek, [wheatherInstance]);
            } else {
                let arrayTimeStampsForCurrentDay = dayToWhetherResponceInstance.get(numbDayInWeek);
                arrayTimeStampsForCurrentDay.push(wheatherInstance);
            }
        }
        );
        for (let [key, value] of dayToWhetherResponceInstance) {
            console.log(key + ' = ' + value);
        }
        $scope.dayToWhetherResponceInstance = Object.fromEntries(dayToWhetherResponceInstance);
    });

    Date.prototype.addHours = function(h) {
        this.setTime(this.getTime() + (h*60*60*1000));
        return this;
      }
}])
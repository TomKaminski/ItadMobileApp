(function () {
    'use strict';

    angular.module("ionicApp", ["ionic"])
        .value('signalRServer', 'http://localhost:47216/signalr')
        .constant('$', window.jQuery)
        .config(function ($stateProvider, $urlRouterProvider) {

            $stateProvider
                .state('home', {
                    url: "/home",
                    templateUrl: "templates/home.html",
                    controller: "MainCtrl as mainCtrl",
                    cache: false
                })
                .state('result', {
                    url: "/result",
                    templateUrl: "templates/result.html",
                    controller: "MainCtrl as mainCtrl",
                    cache: false
                })
                .state('error', {
                    url: "/error",
                    templateUrl: "templates/error.html",
                    controller: "MainCtrl as mainCtrl",
                    cache: false
                }).state('loading', {
                    url: "/loading",
                    templateUrl: "templates/loading.html",
                    controller: "MainCtrl as mainCtrl"
                });
            $urlRouterProvider.otherwise("/home");
        });
})();



(function() {
    'use strict';

    function apiService($http,$q) {
        var globalPath = "http://localhost:47216/Api/Qr";
        var staticTokenForTests = "kn432k4n32b4325n34lk5ms23423423423901adsjkdn5465ujojzcxzasdasdas";

        function getGuestsCount() {
            var defered = $q.defer();
            $http.post(globalPath + "/GetGuestsCount").success(function(data) {
                defered.resolve(data);
            }).error(function() {
                defered.reject(false);
            });
            return defered.promise;
        }

        function checkIn(result) {
            var defered = $q.defer();
            $http.post(globalPath + "/CheckInApp", { Email: result.text, Token: staticTokenForTests }).success(function (data) {
                defered.resolve(data);
            }).error(function() {
                defered.reject(false);
            });
            return defered.promise;
        }

        return {
            getGuestsCount: getGuestsCount,
            checkIn: checkIn
        };
    }

    angular.module('ionicApp').service('apiService', apiService);
})();

   
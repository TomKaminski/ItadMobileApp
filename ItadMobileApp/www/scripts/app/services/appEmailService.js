(function () {
    'use-strict';

    function appEmailService(localStorageFactory) {
        var appEmail;

        var setEmail = function (email) {
            appEmail = email;
            localStorageFactory.set("appEmail", email);
        };

        var clearEmail = function () {
            appEmail = null;
            localStorageFactory.clear();
        };

        var getEmail = function() {
            if (appEmail != null) {
                return appEmail;
            } else {
                appEmail = localStorageFactory.get("appEmail");
                if (appEmail == null) {
                    return false;
                } else {
                    return appEmail;
                }
            }
        }

        return {
            setEmail: setEmail,
            clearEmail: clearEmail,
            getEmail: getEmail
        };
    }

    angular.module('ionicApp').service('appEmailService', appEmailService);
})();


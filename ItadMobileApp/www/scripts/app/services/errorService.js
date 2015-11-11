(function() {
    'use-strict';

    function errorService() {
        var error = "";

        var setError = function(errorMessage) {
            error = errorMessage;
        };

        var returnError = function() {
            return error;
        };

        var clearError = function() {
            error = "";
        };

        return {
            setError: setError,
            returnError: returnError,
            clearError: clearError
        };
    }

    angular.module('ionicApp').service('errorService', errorService);
})();


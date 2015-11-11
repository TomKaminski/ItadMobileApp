(function() {
    'use strict';

    function summaryService(){
        var maxPersonCount;
        var registeredPersonCount;

        var getSummaryString = function () {
            return (registeredPersonCount == null ? 0 : registeredPersonCount) + "/" + (maxPersonCount == null ? 0 : maxPersonCount);
        };

        var setSummary = function (maxPerson, registeredPerson) {
            maxPersonCount = maxPerson;
            registeredPersonCount = registeredPerson;
        };

        return {
            getSummaryString: getSummaryString,
            setSummary: setSummary
        };
    }

    angular.module('ionicApp').service('summaryService', summaryService);
})();


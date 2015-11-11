(function() {
    'use strict';

    var sizeEnum = [
        "damska S",
        "damska M",
        "damska L",
        "damska XL",
        "damska XXL",
        "męska S",
        "męska M",
        "męska L",
        "męska XL",
        "męska XXL",
        "Brak"
    ];

    function registeredPersonService() {
        var registeredPerson = {};

        var fillPerson = function(person) {
            registeredPerson = {
                fullName: person.FirstName + " " + person.LastName,
                email: person.Email,
                size: sizeEnum[person.Size-1]
            };
        };

        var returnFullName = function() {
            return registeredPerson.fullName;
        }

        var returnEmail = function () {
            return registeredPerson.email;
        }

        var returnSize= function () {
            return registeredPerson.size;
        }

        var clearPerson = function() {
            registeredPerson = {};
        }

        return {
            fillPerson: fillPerson,
            returnFullName: returnFullName,
            returnSize: returnSize,
            returnEmail: returnEmail,
            clearPerson: clearPerson
        };
    }

    angular.module('ionicApp').service('registeredPersonService', registeredPersonService);
})();



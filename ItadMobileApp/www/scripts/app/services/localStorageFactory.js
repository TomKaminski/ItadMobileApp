(function () {
    'use strict';

    function localStorageFactory() {

        function set(name, value) {
            window.localStorage.setItem(name, value);
        }

        function get(name) {
            return window.localStorage.getItem(name);
        }

        function clear() {
            window.localStorage.clear();
        }

        return {
            set: set,
            get: get,
            clear: clear
        }
    }
    angular.module('ionicApp').factory('localStorageFactory', localStorageFactory);
})();
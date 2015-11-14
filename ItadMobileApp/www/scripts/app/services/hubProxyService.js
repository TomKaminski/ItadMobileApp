(function () {
    'use strict';

    function hubProxyService($rootScope, $, signalRServer, appEmailService) {
        function signalRHubProxyFactory(serverUrl, hubName, startOptions) {

            var connection = $.hubConnection(signalRServer);
            var proxy = connection.createHubProxy(hubName);

            var on = function (eventName, callback) {
                proxy.on(eventName, function (result) {
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback(result);
                        }
                    });
                });
            }

            var invoke = function () {
                var args = $.makeArray(arguments);
                proxy.invoke.apply(proxy, args);
            }

            var start = function (callback) {
                connection.start(startOptions).done(function () {
                    callback();
                });
            }

            var stop = function () {
                connection.stop();
            }

            var off = function (eventName, callback) {
                proxy.off(eventName, function (result) {
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback(result);
                        }
                    });
                });
            }

            connection.disconnected(function () {
                setTimeout(function () {
                    connection.start(startOptions).done(function () {
                        invoke('connect', appEmailService.getEmail(), connection.id, 0);
                    });
                }, 5000);
            });

            return {
                on: on,
                off: off,
                invoke: invoke,
                connection: connection,
                stop: stop,
                start: start
            };

        };
        return signalRHubProxyFactory;
    };

    angular.module('ionicApp').factory('hubProxyService', hubProxyService);
})();

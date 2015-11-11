(function () {
    'use strict';

    function mainController($scope, $state, $timeout, errorService, registeredPersonService, summaryService, backButtonService, apiService, activeCameraService, hubProxyService, appEmailService) {
        backButtonService.enable();

        var vm = this;
        var hubProxy = hubProxyService(hubProxyService.defaultServer, 'CheckInHub', { logging: true });
        vm.apiEmail = appEmailService.getEmail();

        document.addEventListener('resume', onResume, false);
        document.addEventListener('pause', onPause, false);

        function deleteCameraPreview() {
            activeCameraService.setNonActiveState();
            activeCameraService.setNonActive();

            var video = document.getElementById("CapturePreviewObj");
            var overLay = document.getElementById("overlayCamera");
            var cancelBtn = document.getElementById("CaptureCancelButtonObj");

            [video, overLay, cancelBtn].forEach(function (elem) {
                elem && document.body.removeChild(elem);
            });
        }

        function goToHome() {
            deleteCameraPreview();
            $state.go('home');
        }


        function onPause() {
            goToHome();
        }

        function goToLoading() {
            deleteCameraPreview();
            $state.go('loading');
        }

        function goToSummary(person) {
            deleteCameraPreview();
            $state.go('result');
            registeredPersonService.fillPerson(person);
        }

        function goToError() {
            deleteCameraPreview();
            $state.go('error');
        }

        function postData(result) {
            setTimeout(function () {
                apiService.checkIn(result).then(function (data) {
                    if (data.Status === true) {
                        hubProxy.invoke('LockDevice', vm.apiEmail, data);
                        goToSummary(data.Person);
                    } else {
                        hubProxy.invoke('LockDevice', vm.apiEmail, data);
                        errorService.setError(data.Error);
                        goToError();
                    }
                }, function () {
                    errorService.setError("Wystąpił błąd połączenia");
                    goToError();
                });
            }, 500);
        }

        //OLD POST LOGIC
        //    function postData(result) {
        //        hubProxy.stop();
        //        hubProxy.start(function () {
        //            setTimeout(function () {
        //                hubProxy.invoke('connect', appEmailService.getEmail(), hubProxy.connection.id, 0);
        //                setTimeout(function () {
        //                    apiService.checkIn(result).then(function (data) {
        //                        if (data.Status === true) {
        //                            hubProxy.invoke('LockDevice', vm.apiEmail, data);
        //                            goToSummary(data.Person);
        //                            postSummary();
        //                        } else {
        //                            hubProxy.invoke('LockDevice', vm.apiEmail, data);
        //                            errorService.setError(data.Error);
        //                            goToError();
        //                        }
        //                    }, function () {
        //                        errorService.setError("Wystąpił błąd połączenia");
        //                        goToError();
        //                    });
        //                }, 500);
        //            }, 500);
        //        });
        //}

        function registerFunc() {
            cordova.plugins.barcodeScanner.scan(
                function (result) {
                    if (result.text !== "" && result.cancelled !== true) {
                        goToLoading();
                        activeCameraService.setNonActiveState();
                        activeCameraService.setNonActive();
                        postData(result);
                    } else {
                        hubProxy.stop();
                        activeCameraService.setActiveState();
                        activeCameraService.setNonActive();
                        appEmailService.clearEmail();
                        goToHome();
                    }
                },
                function (error) {
                    hubProxy.stop();
                    activeCameraService.setActiveState();
                    activeCameraService.setNonActive();
                    appEmailService.clearEmail();
                    goToHome();
                }
            );
        }

        function onResume() {
            if (activeCameraService.isActiveCameraState() === true) {
                activeCameraService.setActiveState();
                activeCameraService.setActive();
                setTimeout(function () {
                    registerFunc();
                }, 1000);
            }
        }

        vm.init = function () {
            activeCameraService.setNonActiveState();
            activeCameraService.setNonActive();
            if (vm.apiEmail !== false) {
                activeCameraService.setActiveState();
                activeCameraService.setActive();
                hubProxy.start(function () {
                    hubProxy.invoke('connect', appEmailService.getEmail(), hubProxy.connection.id, 0);
                    setTimeout(function () {
                        registerFunc();
                    }, 500);
                });
            }
        }

        vm.getSummaryString = function () {
            return summaryService.getSummaryString();
        }

        vm.getEmail = function () {
            return appEmailService.getEmail();
        }

        vm.isCameraActive = function () {
            return activeCameraService.isActiveCamera();
        }

        vm.returnEmail = function () {
            return registeredPersonService.returnEmail();
        }

        vm.returnFullName = function () {
            return registeredPersonService.returnFullName();
        }

        vm.returnSize = function () {
            return registeredPersonService.returnSize();
        };

        vm.returnError = function () {
            return errorService.returnError();
        }

        vm.refreshSummary = function () {
            postSummary();
        }

        vm.register = function (appEmailInput) {
            appEmailService.setEmail(appEmailInput);
            vm.apiEmail = appEmailService.getEmail();
            activeCameraService.setActiveState();
            activeCameraService.setActive();
            hubProxy.start(function () {
                hubProxy.invoke('connect', appEmailService.getEmail(), hubProxy.connection.id, 0);
                setTimeout(function () {
                    registerFunc();
                }, 500);
            });
        }

        hubProxy.on('unlockDevice', function () {
            hubProxy.invoke('UnlockDeviceUserCallback', appEmailService.getEmail());
            activeCameraService.setActiveState();
            activeCameraService.setActive();
            registerFunc();
        });
    }

    angular.module('ionicApp').controller('MainCtrl', mainController);
})();

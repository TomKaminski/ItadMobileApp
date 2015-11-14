(function () {
    'use strict';

    function mainController($scope, $state, $timeout, errorService, registeredPersonService, summaryService, backButtonService, apiService, activeCameraService, hubProxyService, appEmailService) {
        backButtonService.enable();

        var vm = this;
        var hubProxy = hubProxyService(hubProxyService.defaultServer, 'CheckInHub', { logging: true });
        vm.apiEmail = appEmailService.getEmail();
        vm.apiData = null;

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

        function resendData(data, email) {
            if (vm.userRecievedMessage === false) {
                setTimeout(function () {
                    hubProxy.invoke('lockDevice', email, data);
                    resendData(data, email);
                }, 2500);
            }
        }

        function goToSummary(data) {
            deleteCameraPreview();
            $state.go('result');
            registeredPersonService.fillPerson(data.Person);
            resendData(data, appEmailService.getEmail());
        }

        function goToError(data) {
            deleteCameraPreview();
            $state.go('error');
            resendData(data, appEmailService.getEmail());
        }

        function onErrorBackToHome() {
            hubProxy.stop();
            activeCameraService.setActiveState();
            activeCameraService.setNonActive();
            appEmailService.clearEmail();
            goToHome();
        }

        function postData(result) {
            apiService.checkIn(result).then(function (data) {
                var dataTemp = data;
                vm.apiData = data;
                vm.userRecievedMessage = false;
                hubProxy.invoke('LockDevice', appEmailService.getEmail(), dataTemp);

                if (data.Status === true) {
                    goToSummary(dataTemp);
                } else {
                    errorService.setError(dataTemp.Error);
                    goToError(dataTemp);
                }
            }, function () {
                onErrorBackToHome();
            });
        }

        function registerFunc() {
            cordova.plugins.barcodeScanner.scan(
                function (result) {
                    if (result.text !== "" && result.cancelled !== true) {
                        goToLoading();
                        activeCameraService.setNonActiveState();
                        activeCameraService.setNonActive();
                        postData(result);
                    } else {
                        onErrorBackToHome();
                    }
                },
                function (error) {
                    onErrorBackToHome();
                }
            );
        }

        function onResume() {
            deleteCameraPreview();
            onErrorBackToHome();
        }

        vm.getSummaryString = function () {
            return summaryService.getSummaryString();
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

        vm.register = function (appEmailInput) {
            appEmailService.setEmail(appEmailInput);
            vm.apiEmail = appEmailService.getEmail();
            activeCameraService.setActiveState();
            activeCameraService.setActive();
            hubProxy.stop();
            hubProxy.start(function () {
                hubProxy.invoke('connect', appEmailService.getEmail(), hubProxy.connection.id, 0);
                setTimeout(function () {
                    registerFunc();
                }, 500);
            });
        }

        hubProxy.on('unlockDevice', function () {
            vm.apiData = null;
            hubProxy.invoke('unlockDeviceUserCallback', appEmailService.getEmail());
            activeCameraService.setActiveState();
            activeCameraService.setActive();
            registerFunc();
        });

        hubProxy.on('userRecievedMessageCallback', function () {
            vm.userRecievedMessage = true;
        });

        hubProxy.on('checkAppIsWaiting', function () {
            if (activeCameraService.isActiveCamera() === false && vm.apiData != null) {
                hubProxy.invoke('lockDevice', appEmailService.getEmail(), vm.apiData);
            } else {
                hubProxy.invoke('unlockDeviceUserCallback', appEmailService.getEmail());
            }
        });
    }

    angular.module('ionicApp').controller('MainCtrl', mainController);
})();

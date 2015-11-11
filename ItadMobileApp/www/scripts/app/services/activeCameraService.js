(function () {
    'use-strict';

    function activeCameraService() {
        var activeCamera;
        var cameraState;

        var setActive = function () {
            activeCamera = true;
        };

        var setNonActive = function () {
            activeCamera = false;
        };

        var isActiveCamera = function () {
            return activeCamera;
        };

        var setActiveState = function () {
            cameraState = true;
        };

        var setNonActiveState = function () {
            cameraState = false;
        };

        var isActiveCameraState = function () {
            return cameraState;
        };


        return {
            setActive: setActive,
            setNonActive: setNonActive,
            isActiveCamera: isActiveCamera,
            setActiveState: setActiveState,
            setNonActiveState: setNonActiveState,
            isActiveCameraState: isActiveCameraState
        };
    }

    angular.module('ionicApp').service('activeCameraService', activeCameraService);
})();


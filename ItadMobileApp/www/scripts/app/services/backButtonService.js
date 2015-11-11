(function() {
    'use strict';

    function backButtonService($ionicPlatform){
        this.deregister = undefined;

        this.disable = function(){
            this.deregister = $ionicPlatform.registerBackButtonAction(function(e){
                e.preventDefault();
                return false;
            }, 101);
        }

        this.enable = function(){
            if( this.deregister !== undefined ){
                this.deregister();
                this.deregister = undefined;
            }
        }
        return this;
    }

    angular.module('ionicApp').service('backButtonService', backButtonService);
})();


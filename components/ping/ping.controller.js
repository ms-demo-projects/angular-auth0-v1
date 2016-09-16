(function() {

  'use strict';

  angular
    .module('app')
    .controller('pingController', pingController);

    pingController.$inject = ['$scope', '$http', 'userProfile'];

    function pingController($scope, $http, userProfile) {

      // Get UserProfile from API
      $scope.userProfile = userProfile || {};
      
      // The user's JWT will automatically be attached
      // as an authorization header on HTTP requests
      $scope.ping = function() {
        $http.get('http://localhost:3001/secured/ping')
          .then(function(result) {
            $scope.pingResult = result.data;
          }, function(error) {
            console.log(error);
          });
      }
    }

})();
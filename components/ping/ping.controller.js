(function() {

  'use strict';

  angular
    .module('app')
    .controller('pingController', pingController);

    pingController.$inject = ['$scope', '$http', 'userProfile', 'AUTH0'];

    function pingController($scope, $http, userProfile, AUTH0) {

      // Get UserProfile from API
      $scope.userProfile = userProfile || {};
      
      // The user's JWT will automatically be attached
      // as an authorization header on HTTP requests
      $scope.ping = function() {
        $http.get(AUTH0.API_URL+'secured/ping')
          .then(function(result) {
            $scope.pingResult = result.data;
          }, function(error) {
            console.log(error);
          });
      }
    }

})();
(function() {

  'use strict';

  angular
    .module('app')
    .service('authService', authService);

  authService.$inject = ['$http', '$rootScope', 'lock', 'authManager'];

  function authService($http, $rootScope, lock, authManager) {

    var userProfile = JSON.parse(localStorage.getItem('profile')) || {};

    function login() {
      lock.show();
    }

    // Logging out just requires removing the user's
    // id_token and profile
    function logout() {
      localStorage.removeItem('id_token');
      localStorage.removeItem('profile');
      authManager.unauthenticate();
      userProfile = {};
    }

    // Set up the logic for when a user authenticates
    // This method is called from app.run.js
    function registerAuthenticationListener() {
      lock.on('authenticated', function(authResult) {
        localStorage.setItem('id_token', authResult.idToken);
        authManager.authenticate();

        lock.getProfile(authResult.idToken, function(error, profile) {
          if (error) {
            console.log(error);
          }

          localStorage.setItem('profile', JSON.stringify(profile));
          $rootScope.$broadcast('userProfileSet', profile);

          /* post the user profile details to nodejs server api */
          $http.post('http://localhost:3001/users', profile)
          .then(function(result) {
            console.log(result.data);
          }, function(error) {
            console.log(error);
          });

        });
      });
    }


    /* GET user detail from backend API */
    function getUserByEmail(){
      var userProfile = JSON.parse(localStorage.getItem('profile'));

      return $http.get('http://localhost:3001/users/'+userProfile.email)
      .then(function(result) {
        return result.data;
      }, function(error) {
        console.log(error);
      });
    }

    return {
      userProfile: userProfile,
      getUserByEmail: getUserByEmail,
      login: login,
      logout: logout,
      registerAuthenticationListener: registerAuthenticationListener,
    }
  }
})();
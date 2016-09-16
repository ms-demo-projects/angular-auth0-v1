(function() {

  'use strict';

  angular
    .module('app', ['auth0.lock', 'angular-jwt', 'ngRoute'])
    .config(config)

    .constant( 'AUTH0', {
      'AUTH0_CLIENT_ID': 'G2lon5KBOqRiZlUYfoEerDdf4iCRoodt', 
      'AUTH0_DOMAIN': 'smartsense.auth0.com',
      'API_URL': 'http://erp-foizloqa.cloudapp.net:3001/'
    });

    config.$inject = ['$routeProvider', '$httpProvider', 'lockProvider', 'jwtOptionsProvider', 'jwtInterceptorProvider', 'AUTH0'];

    function config($routeProvider, $httpProvider, lockProvider, jwtOptionsProvider, jwtInterceptorProvider, AUTH0) {

      // Initialization for the Lock widget
      lockProvider.init({
        clientID: AUTH0.AUTH0_CLIENT_ID,
        domain: AUTH0.AUTH0_DOMAIN
      });

      // Configuration for angular-jwt
      jwtOptionsProvider.config({
        tokenGetter: function() {
          return localStorage.getItem('id_token');
        },
        whiteListedDomains: ['localhost','erp-foizloqa.cloudapp.net'],
        unauthenticatedRedirectPath: '/login'
      });

      // Add the jwtInterceptor to the array of HTTP interceptors
      // so that JWTs are attached as Authorization headers
      $httpProvider.interceptors.push('jwtInterceptor');

      $routeProvider
        .when('/', {
          controller: 'homeController',
          templateUrl: 'components/home/home.html'
        })
        .when('/login', {
          controller: 'loginController',
          templateUrl: 'components/login/login.html'
        })
        .when('/ping', {
          controller: 'pingController',
          templateUrl: 'components/ping/ping.html',
          resolve: {
            userProfile: ['$routeParams', 'authService', function($routeParams, authService){
              return authService.getUserByEmail();
            }]
          }
        });
    }

})();

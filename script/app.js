angular
  .module('app', [
    'ui.router'
  ])
  .config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'template/home.html',
      })
      .state('flag', {
        url: '/flag',
        templateUrl: 'template/flag.html',
        controller: 'flagCtrl'
      })
	  .state('map', {
        url: '/map',
        templateUrl: 'template/map.html',
        controller: 'mapCtrl'
      });
  }]);
  
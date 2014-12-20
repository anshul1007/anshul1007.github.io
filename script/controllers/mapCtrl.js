angular
  .module('app')
  .controller('mapCtrl', function ($scope, mapService) {
      $scope.mapSVG = '';
      $scope.stateInfo = [];
      $scope.states = [];
      $scope.stateToPrint = [];

      $scope.getState = function () {
          if ($scope.states.length > 0) {
              return $scope.states[$scope.states.length - 1];
          }
      }

      mapService.getMap('india').then(
             function (data) {
                 $scope.mapSVG = data.mapData.mapSVG;
                 $scope.stateInfo = data.mapData.stateInfo;
             });
  });
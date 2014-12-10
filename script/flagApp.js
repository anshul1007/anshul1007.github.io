var flagApp = angular.module('flagApp', []);

flagApp.controller('GetflagCtrl', function ($log, $scope, flagService) {
    $scope.flag = 'abc';
    $scope.colors = [
        { color: '#ffffff' },
        { color: '#007a3d' },
        { color: '#ff9933' },
        { color: '#00209f' },
        { color: '#dd0000' },
        { color: '#ffce00' },
        { color: '#000000' }
    ];

    $scope.getFlag = function () {
        return $scope.flag = flagService.getFlag().then(
            function (data) {
                $scope.flag = data.svg;
            });
    };
});

flagApp.factory('flagService', function ($http, $log, $q) {
    return {
        getFlag: function () {
            var deferred = $q.defer();
            $http.get('svg/countries/india/flag.txt')
              .success(function (data) {
                  deferred.resolve({
                      svg: data
                  });
              }).error(function (msg, code) {
                  deferred.reject(msg);
                  $log.error(msg, code);
              });
            return deferred.promise;
        }
    }
});

flagApp.directive('colorMenu', function () {
    return {
        restrict: 'E',
        replace: 'true',
        template: '<button type="button" class="btn btn-default">' +
                          '<span class="glyphicon glyphicon-tint" aria-hidden="true"></span>' +
                      '</button>',
        link: function (scope, elem, attrs) {
            elem.css('color', scope.color.color);

            elem.bind('click', function (e) {
                $("#pickedColor").css("background-color", $(this).css("color"));
            });
        }
    };
});
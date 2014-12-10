var flagApp = angular.module('flagApp', []);

flagApp.controller('GetflagCtrl', function ($log, $scope, flagService) {
    $scope.flag = '<svg width="100" height="100">' +
        '<circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />' +
        '</svg>';
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

flagApp.directive('svgWrapper', function () {
    return {
        restrict: 'E',
        replace: 'true',
        template: '<div id="svg-wrapper"></div>' +
                '</div>',
        link: function (scope, elem, attrs) {
            attrs.$observe('svgData', function (value) {
                $(elem).empty().append(scope.flag);
                $("[actualcolor]").on('click', function () {
                    alert($(this).attr("fill"));
                    //$(this).attr("fill", $("#pickedColor").css("background-color"))
                });
            })
        }
    };
});
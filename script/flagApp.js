var flagApp = angular.module('flagApp', []);

flagApp.constant("STATUS", {
    "TO_BE_STARTED": 0,
    "IN_PROGRESS": 1,
    "DONE": 2
});

flagApp.controller('GetflagController', function ($log, $scope, flagService, calculationService, STATUS) {
    $scope.flag = '';
    $scope.colors = flagService.getColors();
    $scope.countries = flagService.getCountries();

    $scope.total = 0;
    $scope.correct = -1;
    $scope.attempt = 0;

    $scope.getStatus = function () {
        $scope.status = calculationService.getStatus($scope.correct, $scope.total);
    }

    $scope.status = calculationService.getStatus($scope.correct, $scope.total);

    $scope.getFlag = function (country) {
        $scope.total = 0;
        $scope.correct = -1;
        $scope.attempt = 0;
        return $scope.flag = flagService.getFlag(country).then(
            function (data) {
                $scope.flag = data.svg;
            });
    };
});

flagApp.factory('flagService', function ($http, $log, $q) {
    return {
        getFlag: function (country) {
            var deferred = $q.defer();
            $http.get('svg/countries/' + country + '/flag.txt?tick=' + new Date().getTime())
              .success(function (data) {
                  deferred.resolve({
                      svg: data
                  });
              }).error(function (msg, code) {
                  deferred.reject(msg);
                  $log.error(msg, code);
              });
            return deferred.promise;
        },
        getColors: function () {
            return [
                    { color: '#ffffff' },
                    { color: '#007a3d' },
                    { color: '#ff9933' },
                    { color: '#00209f' },
                    { color: '#dd0000' },
                    { color: '#ffce00' },
                    { color: '#ffceff' },
                    { color: '#000000' }
            ];
        },
        getCountries: function () {
            return [
                        { name: 'India', value: 'india' },
                        { name: 'Sri Lanka', value: 'srilanka' }
            ];
        }
    }
});

flagApp.factory('calculationService', function (STATUS, $log, $q) {
    return {
        getStatus: function (correct, total) {
            console.log("correct: " + correct + " total:" + total);
            if (correct < 0) {
                return STATUS.TO_BE_STARTED;
            }
            else if (correct === total) {
                return STATUS.DONE;
            }
            else {
                return STATUS.IN_PROGRESS;
            }
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

                scope.total = $("[actualColor]").size();

                $("[actualColor]").on('click', function () {

                    $(this).attr("fill", $("#pickedColor").css("background-color"));

                    var correct = 0;
                    $.each($("[actualColor]"), function (key, value) {
                        var actualColor = $(value).attr("actualColor");
                        var fillColor = $(value).attr("fill");
                        if (rgb2hex(fillColor) == actualColor) {
                            correct++;
                        }
                    });
                    scope.correct = correct;
                    scope.attempt = scope.attempt + 1;
                    scope.getStatus();
                    scope.$apply();
                });
            })
        }
    };
});

function rgb2hex(rgb) {
    if (rgb.indexOf("#") > -1)
        return rgb;
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return "#" + ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2);
}
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

    $scope.selectedCountry;

    $scope.total = 0;
    $scope.correct = -1;
    $scope.attempt = 0;

    $scope.getProgress = function () {
        $scope.progress = calculationService.getProgress($scope.correct, $scope.total);
    };

    $scope.progress = calculationService.getProgress($scope.correct, $scope.total);

    $scope.hideControl = function () {
        return angular.isUndefined($scope.selectedCountry);
    }

    $scope.status = calculationService.getStatus($scope.correct, $scope.total);

    $scope.getFlag = function () {
        $scope.total = 0;
        $scope.correct = -1;
        $scope.attempt = 0;
        $scope.progress = 0;
        return $scope.flag = flagService.getFlag($scope.selectedCountry.value).then(
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
                    { color: '#ffffff' }, //white
                    { color: '#cc0000' }, //red
                    { color: '#0000cc' }, //blue
                    { color: '#007f00' }, //green
                    { color: '#ffb700' }, //yellow
                    { color: '#ff6600' }, //orange
                    { color: '#8d2029' }, //brown
                    { color: '#bdbdbd' }, //gray
                    { color: '#5b2d89' }, //purple
                    { color: '#00a1de' },
                    { color: '#ff99cc' },
                    { color: '#000000' }  //black
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
            if (correct < 0) {
                return STATUS.TO_BE_STARTED;
            }
            else if (correct === total) {
                return STATUS.DONE;
            }
            else {
                return STATUS.IN_PROGRESS;
            }
        },

        getProgress: function (correct, total) {
            return (total > 0) ? (parseInt((correct * 100) / total)) : 0;
        }
    }
});

flagApp.directive('colorPicker', function () {
    return {
        restrict: 'E',
        replace: 'true',
        template: '<div class="col-xs-2 col-sm-1 placeholder">' +
                        '<div class="circle"></div>' +
                    '</div>',
        link: function (scope, elem, attrs) {
            elem.find(".circle").css('background-color', scope.color.color);

            elem.find(".circle").bind('click', function (e) {
                $("#top-header").css("background-color", $(this).css("background-color"));
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

                    $(this).attr("fill", $("#top-header").css("background-color"));

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
                    scope.getProgress();
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
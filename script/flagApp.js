var flagApp = angular.module('flagApp', []);

flagApp.constant("STATUS", {
    "TO_BE_STARTED": 0,
    "IN_PROGRESS": 1,
    "DONE": 2
});

flagApp.controller('GetflagController', function ($log, $scope, flagService, calculationService, STATUS) {
    $scope.colors = [];
    $scope.flags = [];

    $scope.selectedCountry;

    $scope.total = 0;
    $scope.correct = -1;
    $scope.attempt = 0;
    $scope.showHint = false;
    $scope.showSolution = false;

    flagService.getFlags().then(
            function (data) {
                alert(data.flags);
                $scope.flags = data.flags;
            });

    flagService.getColors().then(
           function (data) {
               $scope.colors = data.colors;
           });

    $scope.getProgress = function () {
        $scope.progress = calculationService.getProgress($scope.correct, $scope.total);
    };

    $scope.progress = calculationService.getProgress($scope.correct, $scope.total);

    $scope.hideControl = function () {
        return angular.isUndefined($scope.selectedCountry) || $scope.selectedCountry === null;
    }

    $scope.status = calculationService.getStatus($scope.correct, $scope.total);

    $scope.getFlag = function () {
        $scope.total = 0;
        $scope.correct = -1;
        $scope.attempt = 0;
        $scope.progress = 0;
        $scope.showHint = false;

        if (!$scope.hideControl()) {
            $(".circle").show();
            ga('send', 'event', 'change', 'flag', $scope.selectedCountry.country);
            //return $scope.flag = flagService.getFlag($scope.selectedCountry.value).then(
            //function (data) {
            //    $scope.flag = data.flag;
            //});
        }
    };
});

flagApp.factory('flagService', function ($http, $log, $q) {
    return {
        //getFlag: function (country) {
        //    ga('send', 'event', 'httpGet', 'flag', country);
        //    var deferred = $q.defer();
        //    $http.get('svg/countries/' + country + '/flag.txt?tick=' + new Date().getTime())
        //      .success(function (data) {
        //          deferred.resolve({
        //              flag: data
        //          });
        //      }).error(function (msg, code) {
        //          deferred.reject(msg);
        //          $log.error(msg, code);
        //      });
        //    return deferred.promise;
        //},

        getColors: function () {
            var deferred = $q.defer();
            ga('send', 'event', 'httpGet', 'colors');
            $http.get('data/colors.txt?tick=' + new Date().getTime())
                .success(function (data) {
                    deferred.resolve({
                        colors: data
                    });
                }).error(function (msg, code) {
                    deferred.reject(msg);
                    $log.error(msg, code);
                });
            return deferred.promise;
        },

        getFlags: function () {
            var deferred = $q.defer();
            ga('send', 'event', 'httpGet', 'countries');
            $http.get('data/flags.txt?tick=' + new Date().getTime())
                .success(function (data) {
                    deferred.resolve({
                        flags: data
                    });
                }).error(function (msg, code) {
                    deferred.reject(msg);
                    $log.error(msg, code);
                });
            return deferred.promise;
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

flagApp.directive('hintButton', function () {
    return {
        restrict: 'E',
        replace: 'true',
        template: '<button type="button" ng-hide="hideControl()" class="btn btn-warning">{{showHint ? "Show all colors" : "Show flag colors" }}</button>',
        link: function (scope, elem, attrs) {

            elem.bind('click', function (e) {
                scope.showHint = !scope.showHint;
                if (!scope.showHint) {
                    $(".circle").show();
                    //elem.text("Show flag colors");
                }
                else {
                    $(".circle").hide();
                    //elem.text("Show all colors");
                    $.each($("[actualColor]"), function (key, value) {
                        var actualColor = $(value).attr("actualColor");
                        $('.circle').filter(function () {
                            return rgbToHex($(this).css('background-color')) == actualColor;
                        }).show();
                    });
                }
                scope.$apply();
            });
        }
    };
});

flagApp.directive('solutionButton', function () {
    return {
        restrict: 'E',
        replace: 'true',
        template: '<button type="button" ng-hide="hideControl()" class="btn btn-success">Solution</button>',
        link: function (scope, elem, attrs) {
            elem.bind('click', function (e) {
                $.each($("[actualColor]"), function (key, value) {
                    var actualColor = $(value).attr("actualColor");
                    $(this).attr("fill", actualColor);
                });
                scope.correct = scope.total;
                scope.getProgress();
                scope.$apply();
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
                if (!scope.hideControl()) {
                    $(elem).empty().append(scope.selectedCountry.schema);
                }

                scope.total = $("[actualColor]").size();

                $("[actualColor]").on('click', function () {

                    $(this).attr("fill", rgbToHex($("#top-header").css("background-color")));

                    var correct = 0;
                    $.each($("[actualColor]"), function (key, value) {
                        var actualColor = $(value).attr("actualColor");
                        var fillColor = $(value).attr("fill");
                        if (rgbToHex(fillColor) == actualColor) {
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

function rgbToHex(rgb, g, b) {
    if (rgb.toString().indexOf("#") > -1)
        return rgb;
    if (g == undefined || b == undefined) {
        if (typeof rgb == "string") {
            var result = /^rgb[a]?\(([\d]+)[ \n]*,[ \n]*([\d]+)[ \n]*,[ \n]*([\d]+)[ \n]*,?[ \n]*([.\d]+)?[ \n]*\)$/i.exec(rgb);
            return rgbToHex(parseInt(result[1]), parseInt(result[2]), parseInt(result[3]));
        }
        if (rgb.r == undefined || rgb.g == undefined || rgb.b == undefined) {
            return null;
        }
        return rgbToHex(rgb.r, rgb.g, rgb.b);
    }
    var r = rgb;
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

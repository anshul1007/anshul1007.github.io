angular
  .module('app')
  .controller('flagCtrl', function ($log, $scope, flagService) {
    $scope.flags = [];
    $scope.selectedCountry;
    $scope.total = 0;
    $scope.correct = -1;
    $scope.attempt = 0;
    $scope.showHint = false;
    $scope.showSolution = false;

    flagService.getFlags().then(
            function (data) {
                $scope.flags = data.flags;
            });

    $scope.getProgress = function () {
        $scope.progress = flagService.getProgress($scope.correct, $scope.total);
    };

    $scope.progress = flagService.getProgress($scope.correct, $scope.total);

    $scope.hideControl = function () {
        return angular.isUndefined($scope.selectedCountry) || $scope.selectedCountry === null;
    }

    $scope.getFlag = function () {
        $scope.total = 0;
        $scope.correct = -1;
        $scope.attempt = 0;
        $scope.progress = 0;
        $scope.showHint = false;

        if (!$scope.hideControl()) {
            $(".circle").show();
            ga('send', 'event', 'change', 'flag', $scope.selectedCountry.country);
         }
    };
});

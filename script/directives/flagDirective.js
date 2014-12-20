angular
  .module('app')
  .directive('colorPicker', function () {
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

angular
  .module('app')
  .directive('hintButton', function () {
      return {
          restrict: 'E',
          replace: 'true',
          template: '<button type="button" ng-hide="hideControl()" class="btn btn-warning">{{showHint ? "Show all colors" : "Show flag colors" }}</button>',
          link: function (scope, elem, attrs) {

              elem.bind('click', function (e) {
                  scope.showHint = !scope.showHint;
                  if (!scope.showHint) {
                      $(".circle").show();
                  }
                  else {
                      $(".circle").hide();
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

angular
  .module('app')
  .directive('solutionButton', function () {
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

angular
  .module('app')
  .directive('svgFlag', function () {
      return {
          restrict: 'E',
          replace: 'true',
          template: '<div id="svg-flag"></div>' +
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

angular
  .module('app')
  .directive('selectPicker', ['$timeout', function ($timeout) {
      return {
          restrict: 'A',
          link: function (scope, elem, attrs) {
              attrs.$observe('selectData', function (value) {
                  $timeout(function () {
                      elem.selectpicker('refresh');
                  }, 0);
              });
          }
      };
  }]);

angular
  .module('app')
  .directive('svgMap', function ($timeout) {
      return {
          restrict: 'E',
          replace: 'true',
          template: '<div id="map-svg"></div>' +
                  '</div>',
          link: function (scope, elem, attrs) {
              attrs.$observe('svgData', function (value) {
                  $(elem).empty().append(scope.mapSVG);
                  $.each($(elem).find("[stateName]"), function (key, value) {
                      $timeout(function () {
                          scope.states.push($(value).attr("stateName"));
                          scope.$apply();
                      }, 0);
                  });

                  $(elem).find("[stateName]").on('click', function () {
                      if ($('#stateName').text() === $(this).attr("stateName")) {
                          $(this).attr("fill", "#ff8000");
                          scope.states.pop();
                          scope.$apply();
                      }
                  });
              })
          }
      };
  });

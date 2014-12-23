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

                  $timeout(function () {
                      elem.selectpicker('refresh');
                  }, 0);

                  $.each($(elem).find("[stateName]"), function (key, value) {
                      $timeout(function () {
                          scope.states.push($(value).attr("stateName"));
                          scope.$apply();
                      }, 0);
                  });

                  $(elem).find("[stateName]").on('click', function () {
                      var stateName = $(this).attr("stateName");
                      if ($('#stateName').text() === stateName) {
                          $(elem).find("[stateName='" + stateName + "']").attr("fill", "#ff8000");
                          angular.forEach(scope.stateInfo, function (value, key) {
                              if (value.name === stateName)
                                  this.push(value);
                          }, scope.stateToPrint);
                          var i;
                          while ((i = scope.states.indexOf(stateName)) !== -1) {
                              scope.states.splice(i, 1);
                          }
                          scope.$apply();
                      }
                  });
              })
          }
      };
  });

angular
  .module('app')
  .directive('mapSolution', function () {
      return {
          restrict: 'E',
          replace: 'true',
          template: '<button type="button" class="btn btn-success">Solution</button>',
          link: function (scope, elem, attrs) {
              elem.bind('click', function (e) {
                  scope.stateToPrint = scope.stateInfo;
                  scope.$apply();
              });
          }
      };
  });
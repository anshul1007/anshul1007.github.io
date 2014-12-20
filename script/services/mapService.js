angular
  .module('app')
  .factory('mapService', function ($http, $log, $q) {
      return {
          getMap: function (country) {
              var deferred = $q.defer();
              ga('send', 'event', 'httpGet', 'map');
              $http.get('data/map/' + country + '.txt?tick=' + new Date().getTime())
                  .success(function (data) {
                      deferred.resolve({
                          mapData: data
                      });
                  }).error(function (msg, code) {
                      deferred.reject(msg);
                      $log.error(msg, code);
                  });
              return deferred.promise;
          }
      }
  });

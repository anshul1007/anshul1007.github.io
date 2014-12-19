angular
  .module('app')
  .factory('flagService', function ($http, $log, $q) {
    return {
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
        },
		
		getProgress: function (correct, total) {
            return (total > 0) ? (parseInt((correct * 100) / total)) : 0;
        }
    }
});

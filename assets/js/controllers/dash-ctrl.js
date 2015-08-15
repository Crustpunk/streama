'use strict';

streamaApp.controller('dashCtrl', ['$scope', 'apiService', '$state', '$rootScope', 'localStorageService', function ($scope, apiService, $state, $rootScope, localStorageService) {
	$scope.loading = true;

  if($rootScope.baseData.redirected){
    var originUrl = localStorageService.get('originUrl');
    if(originUrl){
      location.href = originUrl;
    }else{
      location.href = location.href.replace('?redirected=true', '');
    }

  }

  if($rootScope.currentUser.isAdmin){
    apiService.settings.list().success(function (data) {
      var TheMovieDbAPI = _.find(data, {settingsKey: 'TheMovieDB API key'});

      if(!TheMovieDbAPI || !TheMovieDbAPI.value){
        alertify.alert('You need to fill out some required base-settings. You will be redirected to the settings page now.', function () {
          $state.go('admin.settings');
        });
      }
    });
  }




  apiService.video.dash()
    .success(function (data) {
      console.log('%c success', 'color: deeppink; font-weight: bold; text-shadow: 0 0 5px deeppink;', arguments);
      $scope.episodes = data.firstEpisodes;
      $scope.continueWatching = data.continueWatching;
      $scope.movies = data.movies;
      $scope.loading = false;
    })
    .error(function () {
      alertify('A server error occured.');
      $scope.loading = false;
    });

}]);

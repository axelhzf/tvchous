angular.module("app").controller("SeasonController",
  function ($scope, $stateParams, traktService, execService, pirateshipService, subtitlesService) {

    function init () {
      findEpisodes();
    }

    function findEpisodes () {
      var showId = $stateParams.showId;
      var seasonId = $stateParams.seasonId;
      co(function *() {
        $scope.season = yield traktService.findSeason(showId, seasonId);
        $scope.$apply();
      })();
    }

    function playEpisode (episode) {
      co(function *() {
        yield execService.playFile(episode.local.file);
      })();
    }

    function downloadEpisode (episode) {
      co(function *() {
        if (!episode.torrents) { //TODO duplicated code in EpisodeController
          var q = episode._show.id + " " + episode.fullId;
          episode.torrents = yield pirateshipService.findTorrents(q);
        }
        var torrent = episode.torrents[0].link;
        yield execService.downloadTorrent(torrent);
      })();
    }

    _.extend($scope, {
      playEpisode: playEpisode,
      downloadEpisode: downloadEpisode,
      downloadSubtitle: subtitlesService.downloadSubtitle
    });

    init();
  });
var thunkify = require("thunkify");
var co = require("co");
var defer = require("co-defer");

var remote = require("./client/js/service/remote");


angular.module("app").factory("utorrentService", function () {

  function* list () {
    var response = yield remote.torrentList();
    var torrents = _.map(response.torrents, parseTorrent);
    return torrents;
  }

  function parseTorrent (torrent) {
    var keys = ["hash", "status", "name", "size", "percentProgress",
      "downloaded", "uploaded", "ratio", "uploadSpeed", "downloadSpeed",
      "eta", "label", "peersConnected", "peersSwarm", "seedConnected",
      "seedsSwarm", "availability"];
    return _.object(keys, torrent);
  }

  function* updateEpisodes (episodes) {
    try {
      var torrentList = yield list();
      _.each(episodes, function (episode) {
        var showId = episode._show.id;
        var episodeId = episode.fullId;

        episode.utorrent = _.find(torrentList, function (torrent) {
          return (torrent.name.indexOf(showId) !== -1 && torrent.name.indexOf(episodeId) !== -1);
        });
      });

    } catch (e) {
      console.log(e);
    }
  }

  return {
    list: list,
    updateEpisodes: updateEpisodes
  }

});
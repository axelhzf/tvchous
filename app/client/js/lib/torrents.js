var _ = require("underscore");
var co = require("co");
var thunkify = require("thunkify");
var pirateship = require("pirateship");

var findTorrents = thunkify(pirateship.find);

function* defaultTorrentForEpisode(episode) {
  if (!episode.torrents) {
    var q = episode._show.id + " " + episode.fullId;
    episode.torrents = yield findTorrents(q);
  }
  var torrent = findHdTorrent(episode.torrents) || episode.torrents[0];
  return torrent;
}

function findHdTorrent(torrents) {
  return _.find(torrents, function (torrent) {
    return torrent.title.toLowerCase().indexOf("720p") !== -1;
  });
}

module.exports = {
  findTorrents: findTorrents,
  defaultTorrentForEpisode: defaultTorrentForEpisode
};


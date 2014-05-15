angular.module("app").directive("subtitlesStatus", function (subtitlesService) {
  return {
    restrict: "E",
    templateUrl: "dist/views/subtitles_status.html",
    scope: {
      episode: "="
    },
    link: function (scope, element, attrs) {
      var preferredLanguages = ["spa", "eng"];

      scope.downloadSubtitles = function () {
        co(function* () {
          var langs = notFoundLanguages();
          for (var i = 0; i < langs.length; i++) {
            try {
              yield subtitlesService.downloadSubtitle(scope.episode.local.file, langs[i]);
            } catch (e) {
              console.err(e);
            }
          }
        })();
      };

      function currentLanguages () {
        return _.pluck(scope.episode.local.subtitles, "lang");
      }

      function notFoundLanguages () {
        return _.difference(preferredLanguages, currentLanguages());
      }

      scope.$watch("episode.local.subtitles.length", function () {
        if (scope.episode.local) {
          if (currentLanguages().length === 0) {
            scope.status = "none"
          } else if (notFoundLanguages().length > 0) {
            scope.status = "some";
          } else {
            scope.status = "all";
          }
        }
      });
    }
  }
});
(function () {
  if (typeof Hanoi === "undefined") {
    window.Hanoi = {};
  }

  var View = Hanoi.View = function (game, $el) {
    this.game = game;
    this.$el = $el;
    this.$clickedTower = null;
    this.setupTowers();
    this.bindEvents();
  };

  View.prototype.bindEvents = function () {
    this.$el.on("click", ".tower", (function (event) {
      var $tower = $(event.currentTarget);
      this.clickTower($tower);
    }).bind(this));
  };

  View.prototype.clickTower = function ($tower) {
    if (!this.$clickedTower) {
      this.$clickedTower = $tower;
      $tower.addClass("clicked");
    } else {
      var startTower = this.$clickedTower.attr("data-pos");
      var endTower = $tower.attr("data-pos");
      var successfulMove = this.game.move(startTower, endTower);
      if (!successfulMove) { alert("Invalid move!"); }
      this.$clickedTower.removeClass("clicked");
      this.$clickedTower = null;
    }
    this.render();
    if (this.game.isWon()) {
      this.$el.addClass("win");
    }
  };

  View.prototype.setupTowers = function () {
    this.$el.append("<h1>Towers of Babylon</h1>");
    var $tower = $("<ul class='tower'></ul>").attr("data-pos", 0);
    this.$el.append($tower);
    for (var j = 6; j >= 0; j--) {
      var $space = $("<li class='space'></li>").attr("data-height", j);
      $space = this.occupySpace($space, this.game.towers[0][j]);
      $tower.append($space);
    }
    for (var i = 1; i < 3; i++) {
      var $tower = $("<ul class='tower'></ul>").attr("data-pos", i);
      this.$el.append($tower);
      for (var j = 6; j >= 0; j--) {
        $tower.append($("<li class='space'></li>").attr("data-height", j));
      }
    }
  };

  View.prototype.occupySpace = function ($space, weight) {
    if (this.game.isWon()) {
      $space.css("background", "#" +
          (weight * 2).toString(16) +
          (weight * 2).toString(16) + "f");
    } else {
      $space.css("background", "#" + (weight * 2).toString(16)
        + (weight * 2).toString(16) + (weight * 2).toString(16))
    }
    $space.addClass("occupied")
          .css("width", (30 + (10 * weight)).toString() + "%");
    return $space;
  }

  View.prototype.render = function () {
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 7; j++) {
        var $space = $(".tower[data-pos=" + i +
                       "] .space[data-height=" + j + "]");
        if (j >= this.game.towers[i].length) {
          $space.removeClass("occupied").removeAttr("style");
        } else {
          $space = this.occupySpace($space, this.game.towers[i][j])
        }
      }
    }
  };

})();

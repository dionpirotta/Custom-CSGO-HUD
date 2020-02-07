const COLOR_CT = "rgba(87, 136, 168, 1.0)";
const COLOR_T = "rgba(193, 149, 17, 1.0)";
const COLOR_NEW_CT = "rgba(90, 184, 244, 1.0)";
const COLOR_NEW_T = "rgba(240, 201, 65, 1.0)";
const COLOR_RED = "rgba(242, 34, 34, 1.0)";
const COLOR_MAIN_PANEL = "rgba(12, 15, 18, 0.75)";
const COLOR_SUB_PANEL = "rgba(12, 15, 18, 0.6)";
const COLOR_GRAY = "rgba(191, 191, 191, 1.0)";
const COLOR_WHITE = "rgba(250, 250, 250, 1.0)";
const COLOR_WHITE_HALF = "rgba(250, 250, 250, 0.5)";
const COLOR_WHITE_DULL = "rgba(250, 250, 250, 0.25)";
const PLAYER_ORANGE = "rgba(237, 163, 56, 1.0)";
const PLAYER_GREEN = "rgba(16, 152, 86, 1.0)";
const PLAYER_BLUE = "rgba(104, 163, 229, 1.0)";
const PLAYER_YELLOW = "rgba(230, 241, 61, 1.0)";
const PLAYER_PURPLE = "rgba(128, 60, 161, 1.0)";
const DEV_PURPLE = "rgba(200, 0, 255, 1.0)";

var teams = {
  left: {},
  right: {}
};
var start_money = {};
var round_now = 0;
var last_round = 0;
var freezetime = false;

function updatePage(data) {
  var matchup = data.getMatchType();
  var match = data.getMatch();
  var team_one = data.getTeamOne();
  var team_two = data.getTeamTwo();
  var team_ct = data.getCT();
  var team_t = data.getT();
  var phase = data.phase();
  var observed = data.getObserved();
  var players = data.getPlayers();
  var round = data.round();
  var map = data.map();
  var previously = data.previously();
  var bomb = data.bomb();

  var test_player = data.getPlayer(1);
  if (test_player) {
    teams.left = test_player.team.toLowerCase() == "ct" ? team_ct : team_t;
    teams.right = test_player.team.toLowerCase() != "ct" ? team_ct : team_t;

    teams.left.name = team_one.team_name || teams.left.name;
    teams.right.name = team_two.team_name || teams.right.name;
    teams.left.short_name = team_one.short_name;
    teams.right.short_name = team_two.short_name;
    teams.left.logo = team_one.logo || null;
    teams.right.logo = team_two.logo || null;
    teams.left.flag = team_one.country_code || null;
    teams.right.flag = team_two.country_code || null;
  }
  if (_print_player_data) {
    printPlayerData(players);
  }
  setupBestOf(matchup, match);
  updateTopPanel();
  updateLeague();
  updateRoundNow(round, map);
  updateRoundState(phase, round, map, previously, bomb, players);
  updateObserved(observed);
  updatePlayers(players, observed, phase, previously);
  updateTeamValues(teams.left, teams.right);
  countNades(teams.left, teams.right);
  freezetime = round.phase == "freezetime";
  last_round = round_now;
}

function setupBestOf(matchup, match) {
  if (matchup && matchup.toLowerCase() != "none") {
    if (matchup == "bo1") {
      $("#left_team .block2")
        .css("opacity", "1")
        .css("background-color", match.team_1.map_score >= 1 ? COLOR_WHITE : "");
      $("#right_team .block2")
        .css("opacity", "1")
        .css("background-color", match.team_2.map_score >= 1 ? COLOR_WHITE : "");
    } else if (matchup == "bo3") {
      $("#left_team .block4")
        .css("opacity", "1")
        .css("background-color", match.team_1.map_score >= 1 ? COLOR_WHITE : "");
      $("#left_team .block5")
        .css("opacity", "1")
        .css("background-color", match.team_1.map_score >= 2 ? COLOR_WHITE : "");
      $("#right_team .block4")
        .css("opacity", "1")
        .css("background-color", match.team_2.map_score >= 1 ? COLOR_WHITE : "");
      $("#right_team .block5")
        .css("opacity", "1")
        .css("background-color", match.team_2.map_score >= 2 ? COLOR_WHITE : "");
    } else if (matchup == "bo5") {
      $("#left_team .block1")
        .css("opacity", "1")
        .css("background-color", match.team_1.map_score >= 1 ? COLOR_WHITE : "");
      $("#left_team .block2")
        .css("opacity", "1")
        .css("background-color", match.team_1.map_score >= 2 ? COLOR_WHITE : "");
      $("#left_team .block3")
        .css("opacity", "1")
        .css("background-color", match.team_1.map_score >= 3 ? COLOR_WHITE : "");
      $("#right_team .block1")
        .css("opacity", "1")
        .css("background-color", match.team_2.map_score >= 1 ? COLOR_WHITE : "");
      $("#right_team .block2")
        .css("opacity", "1")
        .css("background-color", match.team_2.map_score >= 2 ? COLOR_WHITE : "");
      $("#right_team .block3")
        .css("opacity", "1")
        .css("background-color", match.team_2.map_score >= 3 ? COLOR_WHITE : "");
    }
  }
}

function updateTopPanel() {
  //#region Team Name
  $("#left_team #main")
    .text(teams.left.name.toUpperCase())
    .css("color", teams.left.side == "ct" ? COLOR_NEW_CT : COLOR_NEW_T);
  $("#right_team #main")
    .text(teams.right.name.toUpperCase())
    .css("color", teams.right.side == "ct" ? COLOR_NEW_CT : COLOR_NEW_T);
  //#endregion

  //#region Team Score
  $("#left_team #score")
    .text(teams.left.score)
    .css("color", teams.left.side == "ct" ? COLOR_NEW_CT : COLOR_NEW_T);
  $("#right_team #score")
    .text(teams.right.score)
    .css("color", teams.right.side == "ct" ? COLOR_NEW_CT : COLOR_NEW_T);
  //#endregion

  //#region Poles
  $("#left_team .bar").css("background-color", teams.left.side == "ct" ? COLOR_NEW_CT : COLOR_NEW_T);
  $("#right_team .bar").css("background-color", teams.right.side == "ct" ? COLOR_NEW_CT : COLOR_NEW_T);
  $("#left_team #alert #alert_pole_right").css("background-color", teams.left.side == "ct" ? COLOR_NEW_CT : COLOR_NEW_T);
  $("#right_team #alert #alert_pole_left").css("background-color", teams.right.side == "ct" ? COLOR_NEW_CT : COLOR_NEW_T);
  $("#match_pole_1").css("background-color", teams.left.side == "ct" ? COLOR_NEW_CT : COLOR_NEW_T);
  $("#match_pole_2").css("background-color", teams.right.side == "ct" ? COLOR_NEW_CT : COLOR_NEW_T);
  //#endregion

  //#region Team Logos
  if (!teams.left.logo) {
    teams.left.logo = "logo_" + teams.left.side.toLowerCase() + "_default.png";
  }
  if (!teams.right.logo) {
    teams.right.logo = "logo_" + teams.right.side.toLowerCase() + "_default.png";
  }
  $("#left_team #team_logo").attr("src", "/storage/" + teams.left.logo);
  $("#right_team #team_logo").attr("src", "/storage/" + teams.right.logo);
  //#endregion

  //#region Team Flag
  if (teams.left.flag && disp_team_flags) {
    $("#left_team #team_flag").css("background-image", "url(/files/img/flags-50/" + teams.left.flag + ".png)");
  } else {
    $("#left_team #team_flag").css("background-image", "");
  }
  if (teams.right.flag && disp_team_flags) {
    $("#right_team #team_flag").css("background-image", "url(/files/img/flags-50/" + teams.right.flag + ".png)");
  } else {
    $("#right_team #team_flag").css("background-image", "");
  }
  //#endregion
}

function updateLeague() {
  $("#players_left #box_image").attr("src", _left_image);
  $("#players_left #main_primary").text(_left_primary);
  $("#players_left #main_secondary").text(_left_secondary);
  $("#players_right #box_image").attr("src", _right_image);
  $("#players_right #main_primary").text(_right_primary);
  $("#players_right #main_secondary").text(_right_secondary);
}

function updateRoundNow(round, map) {
  round_now = map.round + (round.phase == "over" || round.phase == "intermission" ? 0 : 1);
  $("#round_number").text("Round " + round_now + " / 30");
  if ((round.phase == "freezetime" && !freezetime) || round_now != last_round) {
    start_money = {};
  }
}

function updateRoundState(phase, round, map, previously, bomb, players) {
  // console.log(phase.phase); // * freezetime/live/over/bomb/defuse/paused/timeout_t/timeout_ct
  // console.log(round.bomb); // * exploded/defused/planted NULL
  // console.log(round.win_team); // * CT/T

  switch (phase.phase) {
    case "warmup":
      updateStateWarmup(phase);
      break;
    case "freezetime":
      updateStateFreezetime(phase, previously);
      break;
    case "live":
      updateStateLive(phase, bomb, players, previously);
      break;
    case "over":
      updateStateOver(phase, round, previously);
      break;
    case "bomb":
      updateStatePlanted(phase, round, previously);
      break;
    case "defuse":
      updateStateDefuse(phase, bomb, players);
      break;
    case "paused":
      updateStatePaused(phase, "paused", previously);
      break;
    case "timeout_t":
      updateStatePaused(phase, "timeout_t", previously);
      break;
    case "timeout_ct":
      updateStatePaused(phase, "timeout_ct", previously);
      break;
  }
}

function updateStateWarmup(phase) {
  if (phase) {
    forceRemoveAlerts();
    for (let x = 1; x <= 5; x++) {
      $("#players_left #player_section #player" + x + " .player_stats_holder").css("opacity", 0);
      $("#players_right #player_section #player" + x + " .player_stats_holder").css("opacity", 0);
    }
    if (!$("#round_timer_text").hasClass("round_warmup")) animateRoundTimer("round_warmup", true);
  }
}

function updateStateFreezetime(phase, previously) {
  if (phase) {
    removeRoundTimeGraphics();
    resetBomb();
    showPlayerStats(phase);
    $("#players_left #box_utility").slideDown(500);
    $("#players_right #box_utility").slideDown(500);
    $("#players_left #box_monetary").slideDown(500);
    $("#players_right #box_monetary").slideDown(500);
    $("#round_timer_text").css("color", COLOR_GRAY);
    if (previously.hasOwnProperty("round")) {
      if (previously.round.hasOwnProperty("win_team")) {
        if (previously.round.win_team == "CT") {
          if (teams.left.side == "ct") {
            // * CT alert on Left
            hideAlertSlide("#left_team");
          } else {
            // * CT alert on Right
            hideAlertSlide("#right_team");
          }
        } else if (previously.round.win_team == "T") {
          if (teams.left.side == "t") {
            // * T alert on Left
            hideAlertSlide("#left_team");
          } else {
            // * T alert on Right
            hideAlertSlide("#right_team");
          }
        }
      }
    } else if (checkPrev(previously, "paused")) {
      $("#alert_middle").removeClass();
      animateElement("#alert_middle", "fadeOutDown", function () {
        $("#alert_middle")
          .css("opacity", 0)
          .removeClass();
      });
    } else if (checkPrev(previously, "timeout_t") || checkPrev(previously, "timeout_ct")) {
      $("#alert_middle").removeClass();
      animateElement("#alert_middle", "fadeOutDown", function () {
        $("#alert_middle")
          .css("opacity", 0)
          .removeClass();
      });
      hideAlert("#left_team");
      hideAlert("#right_team");
    }
    if (phase.phase_ends_in) {
      var clock_time = Math.abs(Math.ceil(phase.phase_ends_in));
      var count_minute = Math.floor(clock_time / 60);
      var count_seconds = clock_time - count_minute * 60;
      if (count_seconds < 10) {
        count_seconds = "0" + count_seconds;
      }
      $("#round_timer_text").text(count_minute + ":" + count_seconds);
    }
  }
}

function updateStateOver(phase, round, previously) {
  if (phase) {
    $("#round_timer_text").css("color", COLOR_GRAY);
    //#region Which Team Won
    if (round.win_team == "CT") {
      if (teams.left.side == "ct") {
        // * CT alert on Left
        showAlertSlide("#left_team", COLOR_NEW_CT, "WINS THE ROUND");
      } else {
        // * CT alert on Right
        showAlertSlide("#right_team", COLOR_NEW_CT, "WINS THE ROUND");
      }
    } else if (round.win_team == "T") {
      if (teams.left.side == "t") {
        // * T alert on Left
        showAlertSlide("#left_team", COLOR_NEW_T, "WINS THE ROUND");
        if (checkPrev(previously, "defuse")) {
          $("#right_team #alert")
            .css("opacity", 0)
            .removeClass();
        }
      } else {
        // * T alert on Right
        showAlertSlide("#right_team", COLOR_NEW_T, "WINS THE ROUND");
        if (checkPrev(previously, "defuse")) {
          $("#left_team #alert")
            .css("opacity", 0)
            .removeClass();
        }
      }
    }
    //#endregion
    resetBomb();
    if (round.bomb == null) {
      if (round.win_team == "T") {
        if (checkPrev(previously, "live") || checkPrev(previously, "bomb")) {
          if ($("#round_timer_text").hasClass("animated")) $("#round_timer_text").removeClass("animated");
          if ($("#round_timer_text").hasClass("flash")) $("#round_timer_text").removeClass("flash");
          animateRoundTimer("players_eliminated_T", false);
        }
      } else if (round.win_team == "CT") {
        // var t_alive = checkAliveTerrorists(team_t.players);
        var t_alive = checkAliveTerrorists(teams.left.side == "t" ? teams.left.players : teams.right.players);
        if (checkPrev(previously, "live"))
          if (t_alive) {
            // * CT RUN OUT THE CLOCK
            if (!$("#round_timer_text").hasClass("players_eliminated_CT")) {
              if ($("#round_timer_text").hasClass("animated")) $("#round_timer_text").removeClass("animated");
              if ($("#round_timer_text").hasClass("flash")) $("#round_timer_text").removeClass("flash");
              animateRoundTimer("round_time_reached", false);
            }
          } else if (!t_alive) {
          // * CT ELIMINATE T
          animateRoundTimer("players_eliminated_CT", false);
        }
      }
    } else if (round.bomb == "planted") {
      if (checkPrev(previously, "live")) animateRoundTimer("players_eliminated_T", false);
      if (checkPrev(previously, "defuse")) {
        if ($("#round_timer_text").hasClass("animated")) $("#round_timer_text").removeClass("animated");
        if ($("#round_timer_text").hasClass("flash")) $("#round_timer_text").removeClass("flash");
        animateRoundTimer("players_eliminated_T", false);
      }
    } else if (round.bomb == "exploded") {
      if (checkPrev(previously, "bomb")) {
        if ($("#round_timer_text").hasClass("animated")) $("#round_timer_text").removeClass("animated");
        if ($("#round_timer_text").hasClass("flash")) $("#round_timer_text").removeClass("flash");
        animateRoundTimer("bomb_exploded", true);
        $("#round_timer_text")
          .css("animation-duration", "0.25s")
          .css("animation-iteration-count", "1");
      }
    } else if (round.bomb == "defused") {
      if (checkPrev(previously, "defuse")) {
        let _side = teams.left.side == "ct" ? "#left_team" : "#right_team";
        animateElement(_side + " #alert #alert_text", "flash", function () {
          $(_side + " #alert #alert_text").removeClass("animated flash");
        });
        animateRoundTimer("bomb_defused", true);
        $("#timers #defuse_bar").css("opacity", 0);
        $("#left_team #bomb_defuse #icon").css("opacity", 0);
        $("#left_team #bomb_defuse #kit_bar").css("opacity", 0);
        $("#right_team #bomb_defuse #icon").css("opacity", 0);
        $("#right_team #bomb_defuse #kit_bar").css("opacity", 0);
      }
    }
  }
}

function updateStatePlanted(phase, round, previously) {
  if (phase) {
    if (round.bomb == "planted") {
      if (checkPrev(previously, "live")) {
        $("#players_left #box_utility").slideDown(500);
        $("#players_right #box_utility").slideDown(500);
      }
      if (checkPrev(previously, "defuse")) {
        // Fake Defuse or killed
        let defuse_side = teams.left.side == "ct" ? "#left_team" : "#right_team";
        hideAlertSlide(defuse_side);
      }
      if (phase.phase_ends_in <= 35) {
        $("#players_left #box_utility").slideUp(500);
        $("#players_right #box_utility").slideUp(500);
      }
      if (checkPrev(previously, "live")) {
        let side = teams.left.side == "t" ? "#left_team" : "#right_team";
        hideAlertSlide(side);
        if ($("#round_timer_text").hasClass("animated")) $("#round_timer_text").removeClass("animated");
        if ($("#round_timer_text").hasClass("flash")) $("#round_timer_text").removeClass("flash");
        animateRoundTimer("bomb_active", false);
        showMiddleAlert(COLOR_NEW_T, COLOR_NEW_T, "BOMB PLANTED", COLOR_NEW_T);
        var wait = setTimeout(function () {
          $("#alert_middle")
            .css("opacity", 0)
            .removeClass("animated fadeOutDown");
        }, 5000);
      }
      if (phase.phase_ends_in <= 2) {
        $("#round_timer_text")
          .css("animation-duration", "0.5s")
          .css("animation-iteration-count", "infinite");
      } else if (phase.phase_ends_in <= 5) {
        $("#round_timer_text")
          .css("animation-duration", "1s")
          .css("animation-iteration-count", "infinite");
      } else if (phase.phase_ends_in <= 10) {
        $("#round_timer_text")
          .addClass("animated flash")
          .css("animation-duration", "2s")
          .css("animation-iteration-count", "infinite");
      }
      bomb(parseFloat(phase.phase_ends_in));
      $("#timers #defuse_bar").css("opacity", 0);
      $("#left_team #bomb_defuse #icon").css("opacity", 0);
      $("#left_team #bomb_defuse #kit_bar").css("opacity", 0);
      $("#right_team #bomb_defuse #icon").css("opacity", 0);
      $("#right_team #bomb_defuse #kit_bar").css("opacity", 0);
    }
  }
}

function updateStateDefuse(phase, bomb, players) {
  if (phase) {
    if (phase.phase == "defuse") {
      let side = teams.left.side == "t" ? "#left_team" : "#right_team";
      if (!isDefusing) {
        // * Checks for Kit ONCE
        if (parseFloat(phase.phase_ends_in) > 5) {
          defuse_seconds = 10;
          divider = 1;
          hasKit = false;
        } else {
          defuse_seconds = 5;
          divider = 2;
          hasKit = true;
        }
        isDefusing = true;
      }
      var defuse_timer_css = {
        opacity: 1,
        width: (25 / divider) * (parseFloat(phase.phase_ends_in) / defuse_seconds) + "%"
      };
      let defusing_side = teams.left.side == "ct" ? "#left_team" : "#right_team";
      $(defusing_side + " #bomb_defuse #icon").css("opacity", hasKit ? 1 : 0);
      $(defusing_side + " #bomb_defuse #kit_bar")
        .css("background-color", COLOR_NEW_CT)
        .css("opacity", hasKit ? 1 : 0);
      $("#timers #defuse_bar").css(defuse_timer_css);

      if (bomb != null) {
        if (bomb.state == "defusing") {
          player = bomb.player;
          players.forEach(function (_player) {
            if (_player.steamid == player) {
              defuser = _player;
            }
          });
          // 13 characters for name
          showAlertSlide(defusing_side, COLOR_NEW_CT, defuser.name + " is defusing the bomb");
        }
      }
    }
  }
}

function updateStateLive(phase, bomb, players, previously) {
  if (phase) {
    removeRoundTimeGraphics();
    forceRemoveAlerts();
    resetBomb();
    hidePlayerStats(phase, previously);
    if (checkPrev(previously, "freezetime")) {
      $("#players_left #box_monetary").slideUp(500);
      $("#players_right #box_monetary").slideUp(500);
    }
    if (phase.phase_ends_in <= 109.9) {
      $("#players_left #box_utility").slideUp(500);
      $("#players_right #box_utility").slideUp(500);
    }
    if (phase.phase_ends_in <= 5) {
      $("#round_timer_text")
        .addClass("animated flash")
        .css("animation-duration", "2s")
        .css("animation-iteration-count", "infinite");
    }
    $("#round_timer_text").css("color", phase.phase_ends_in <= 10 ? COLOR_RED : COLOR_WHITE);
    if (phase.phase_ends_in) {
      var clock_time = Math.abs(Math.ceil(phase.phase_ends_in));
      var count_minute = Math.floor(clock_time / 60);
      var count_seconds = clock_time - count_minute * 60;
      if (count_seconds < 10) {
        count_seconds = "0" + count_seconds;
      }
      $("#round_timer_text").text(count_minute + ":" + count_seconds);
    }
    if (bomb != null) {
      if (bomb.state == "planting") {
        let side = teams.left.side == "t" ? "#left_team" : "#right_team";
        player = bomb.player;
        players.forEach(function (_player) {
          if (_player.steamid == player) {
            planter = _player;
          }
        });
        // 13 characters for name
        showAlertSlide(side, COLOR_NEW_T, planter.name + " is planting the bomb");
      }
    }
  }
}

function updateStatePaused(phase, type, previously) {
  removeRoundTimeGraphics();
  resetBomb();
  $("#players_left #box_utility").slideDown(500);
  $("#players_right #box_utility").slideDown(500);
  $("#alert_middle").removeClass();
  if (type == "paused") {
    if (checkPrev(previously, "freezetime") || checkPrev(previously, "live") || checkPrev(previously, "defuse") || checkPrev(previously, "bomb"))
      animateRoundTimer("pause_active", false);
    $("#alert_middle #pole_1_middle").css("background-color", teams.left.side == "ct" ? COLOR_NEW_CT : COLOR_NEW_T);
    $("#alert_middle #pole_2_middle").css("background-color", teams.right.side == "ct" ? COLOR_NEW_CT : COLOR_NEW_T);
    $("#alert_middle #alert_text_middle")
      .text("MATCH PAUSED")
      .css("color", COLOR_WHITE);
  } else if (type == "timeout_t") {
    if (phase.phase_ends_in) {
      var clock_time = Math.abs(Math.ceil(phase.phase_ends_in));
      var count_minute = Math.floor(clock_time / 60);
      var count_seconds = clock_time - count_minute * 60;
      if (count_seconds < 10) {
        count_seconds = "0" + count_seconds;
      }
      $("#round_timer_text")
        .text(count_minute + ":" + count_seconds)
        .css("color", COLOR_NEW_T);
    }
    $("#alert_middle #pole_1_middle").css("background-color", COLOR_NEW_T);
    $("#alert_middle #pole_2_middle").css("background-color", COLOR_NEW_T);
    $("#alert_middle #alert_text_middle")
      .text(teams.left.side == "t" ? teams.left.name.toUpperCase() + " TIMEOUT" : teams.right.name.toUpperCase() + " TIMEOUT")
      .css("color", COLOR_NEW_T);
    showAlertSlide("#left_team", teams.left.side == "t" ? COLOR_NEW_T : COLOR_NEW_CT, "Timeouts Remaining: " + teams.left.timeouts_remaining);
    showAlertSlide("#right_team", teams.right.side == "t" ? COLOR_NEW_T : COLOR_NEW_CT, "Timeouts Remaining: " + teams.right.timeouts_remaining);
  } else if (type == "timeout_ct") {
    if (phase.phase_ends_in) {
      var clock_time = Math.abs(Math.ceil(phase.phase_ends_in));
      var count_minute = Math.floor(clock_time / 60);
      var count_seconds = clock_time - count_minute * 60;
      if (count_seconds < 10) {
        count_seconds = "0" + count_seconds;
      }
      $("#round_timer_text")
        .text(count_minute + ":" + count_seconds)
        .css("color", COLOR_NEW_CT);
    }
    $("#alert_middle #pole_1_middle").css("background-color", COLOR_NEW_CT);
    $("#alert_middle #pole_2_middle").css("background-color", COLOR_NEW_CT);
    $("#alert_middle #alert_text_middle")
      .text(teams.left.side == "ct" ? teams.left.name.toUpperCase() + " TIMEOUT" : teams.right.name.toUpperCase() + " TIMEOUT")
      .css("color", COLOR_NEW_CT);
    showAlertSlide("#left_team", teams.left.side == "ct" ? COLOR_NEW_CT : COLOR_NEW_T, "Timeouts Remaining: " + teams.left.timeouts_remaining);
    showAlertSlide("#right_team", teams.right.side == "ct" ? COLOR_NEW_CT : COLOR_NEW_T, "Timeouts Remaining: " + teams.right.timeouts_remaining);
  }

  $("#alert_middle")
    .css("opacity", 1)
    .addClass("animated fadeInUp");
}

function updateObserved(observed) {
  if (observed && observed.steamid != 1 && observed.getStats()) {
    $("#observed").css("opacity", 1);
    fillObserved(observed);
  } else {
    $("#observed").css("opacity", 0);
  }
}

function fillObserved(obs) {
  let stats = obs.getStats();
  let weapons = obs.weapons;
  team_color = obs.team == "CT" ? COLOR_NEW_CT : COLOR_NEW_T;
  //#region Poles
  $("#obs_lane3_left_pole").css("background-color", team_color);
  $("#obs_lane3_right_pole").css("background-color", team_color);
  //#endregion

  $("#obs_alias_text").text(obs.name);
  $("#obs_alias_text").css("color", team_color);
  if (obs.real_name && obs.real_name != obs.name) {
    $("#obs_realname_text").text(obs.real_name);
  } else {
    $("#obs_realname_text").text("");
  }

  // Logic for Team Image
  if (obs.team == "CT") {
    if (teams.left.side == "ct") {
      _img = teams.left.logo;
    } else {
      _img = teams.right.logo;
    }
  } else if (obs.team == "T") {
    if (teams.left.side == "t") {
      _img = teams.left.logo;
    } else {
      _img = teams.right.logo;
    }
  }

  if (disp_avatars) {
    if (disp_player_avatars) {
      if (obs.hasOwnProperty("avatar")) {
        // Custom Set Avatar
        if (obs.avatar) $("#obs_img").attr("src", "/storage/" + obs.avatar);
      } else {
        // Just Use Team Logo
        $("#obs_img").attr("src", "/storage/" + _img);
      }
    } else {
      loadAvatar(obs.steamid, function () {
        $("#obs_img").attr("src", "/av/" + obs.steamid);
      });
    }
  } else {
    $("#obs_avatar").css("opacity", 0);
  }

  // Team Logo and Flags
  $("#obs_team_img").attr("src", "/storage/" + _img);
  if (disp_player_flags) {
    if (obs.hasOwnProperty("teamData")) {
      if (obs.teamData.hasOwnProperty("country_code")) {
        $("#obs_country_img").attr("src", "/files/img/flags-50/" + obs.country_code + ".png");
        $("#obs_country_img").css("opacity", 1);
      } else {
        $("#obs_country_img").css("opacity", 0);
      }
    } else {
      $("#obs_country_img").css("opacity", 0);
    }
  } else {
    $("#obs_country_img").css("opacity", 0);
  }

  $("#obs_health_text").text(stats.health);
  $("#obs_health_img").removeClass();
  if (stats.health <= 20) {
    $("#obs_health_img").addClass("health_" + obs.team);
    $("#obs_health_text").css("color", COLOR_RED);
  } else if (stats.health > 20) {
    $("#obs_health_img").addClass("health_full_" + obs.team);
    $("#obs_health_text").css("color", COLOR_WHITE);
  }

  $("#obs_armor_text").text(stats.armor);
  $("#obs_armor_img").removeClass();
  if (stats.helmet) {
    if (stats.armor == 0) {
      $("#obs_armor_img").addClass("armor_none_" + obs.team);
    } else if (stats.armor <= 30) {
      $("#obs_armor_img").addClass("armor_half_helm_" + obs.team);
    } else if (stats.armor <= 100) {
      $("#obs_armor_img").addClass("armor_helm_" + obs.team);
    }
  } else {
    if (stats.armor == 0) {
      $("#obs_armor_img").addClass("armor_none_" + obs.team);
    } else if (stats.armor <= 30) {
      $("#obs_armor_img").addClass("armor_half_" + obs.team);
    } else if (stats.armor <= 100) {
      $("#obs_armor_img").addClass("armor_kev_" + obs.team);
    }
  }

  $("#obs_kills_k").css("color", team_color);
  $("#obs_kills_text").text(stats.kills);
  $("#obs_assists_a").css("color", team_color);
  $("#obs_assists_text").text(stats.assists);
  $("#obs_deaths_d").css("color", team_color);
  $("#obs_deaths_text").text(stats.deaths);

  $("#obs_reserve").css("color", team_color);

  $("#obs_nade1").removeClass();
  $("#obs_nade2").removeClass();
  $("#obs_nade3").removeClass();
  $("#obs_nade4").removeClass();
  $("#obs_bomb_kit").removeClass();
  $("#obs_bullets_section").removeClass();
  $("#obs_bullets_section").addClass("bullets_" + obs.team);

  let grenades_list = [];
  for (let key in weapons) {
    let weapon = weapons[key];
    if (weapon.type == "Grenade") {
      for (let x = 0; x < weapon.ammo_reserve; x++) {
        grenades_list.push(weapon.name);
      }
    }
    if (weapon.type == "C4") {
      $("#obs_bomb_kit").addClass("obs_bomb");
    }
    if (weapon.state == "active" || weapon.state == "reloading") {
      if (weapon.type == "Grenade" || weapon.type == "C4" || weapon.type == "Knife" || stats.health == 0) {
        $("#obs_clip").css("color", COLOR_WHITE);
        $("#obs_clip").text("-");
        $("#obs_reserve").text("/-");
      } else {
        $("#obs_clip").text(weapon.ammo_clip);
        if (weapon.ammo_clip <= 3) {
          $("#obs_clip").css("color", COLOR_RED);
        } else {
          $("#obs_clip").css("color", COLOR_WHITE);
        }
        $("#obs_reserve").text("/" + weapon.ammo_reserve);
      }
    }
  }
  for (let x = 0; x < grenades_list.length; x++) {
    $("#obs_nade" + (x + 1)).addClass("nade_" + grenades_list[x].substr(7));
  }

  if (stats.defusekit) {
    $("#obs_bomb_kit").addClass("obs_kit");
  }

  skull_color = obs.team == "CT" ? "CT" : "T";
  $("#obs_round_kills #obs_skull").removeClass();
  if (stats.round_kills > 0) {
    $("#obs_round_kills #obs_skull").addClass("obs_skull_" + skull_color);
    $("#obs_round_kills #obs_round_kills_text").text(stats.round_kills);
  } else {
    $("#obs_round_kills #obs_round_kills_text").text("");
  }
}

function updatePlayers(players, observed, phase, previously) {
  if (players) {
    fillPlayers(teams, observed, phase, previously);
  }
}

function fillPlayers(teams, observed, phase, previously) {
  if (teams.left.players) {
    for (var i = 0; i < 5; i++) {
      if (i >= teams.left.players.length) {
        $("#players_left #player_section")
          .find("#player" + (i + 1))
          .css("opacity", "0");
      } else {
        fillPlayer(teams.left.players[i], i, "players_left", observed, phase, previously);
        $("#players_left #player_section")
          .find("#player" + (i + 1))
          .css("opacity", "1");
      }
    }
  }
  if (teams.right.players) {
    for (var i = 0; i < 5; i++) {
      if (i >= teams.right.players.length) {
        $("#players_right #player_section")
          .find("#player" + (i + 1))
          .css("opacity", "0");
      } else {
        fillPlayer(teams.right.players[i], i, "players_right", observed, phase, previously);
        $("#players_right #player_section")
          .find("#player" + (i + 1))
          .css("opacity", "1");
      }
    }
  }
}

function fillPlayer(player, nr, side, observed, phase, previously) {
  let slot = player.observer_slot;
  let stats = player.getStats();
  let weapons = player.getWeapons();
  let steamid = player.steamid;
  let team = player.team.toLowerCase();
  let obs_slot = observed.observer_slot;
  let dead = stats.health == 0;
  let health_color = stats.health <= 20 ? COLOR_RED : team == "ct" ? COLOR_NEW_CT : COLOR_NEW_T;
  let alt_health_color = stats.health <= 20 ? COLOR_RED : team == "ct" ? COLOR_CT : COLOR_T;
  let side_color = team == "ct" ? COLOR_NEW_CT : COLOR_NEW_T;

  let $player = $("#" + side).find("#player" + (nr + 1));

  $player.find(".player_side_bar").css("background-color", dead ? COLOR_MAIN_PANEL : side_color);

  let $top = $player.find(".player_section_top");
  let $bottom = $player.find(".player_section_bottom");
  let $kda_money = $player.find(".player_stats_holder");

  $top.find("#player_alias_text").css("color", dead ? COLOR_WHITE_HALF : COLOR_WHITE);

  $player.find("#player_image").removeClass("dead");
  if (disp_player_avatars) {
    if (player.hasOwnProperty("avatar")) {
      // Custom Set Avatar
      if (player.avatar)
        $player
        .find("#player_image")
        .attr("src", "/storage/" + player.avatar)
        .addClass(dead ? "dead" : "");
    } else {
      // Just Use Team Logo
      if (team == "ct") {
        if (teams.left.side == "ct") {
          _img = teams.left.logo;
        } else {
          _img = teams.right.logo;
        }
      } else if (team == "t") {
        if (teams.left.side == "t") {
          _img = teams.left.logo;
        } else {
          _img = teams.right.logo;
        }
      }
      $player
        .find("#player_image")
        .attr("src", "/storage/" + _img)
        .addClass(dead ? "dead" : "");
    }
  } else {
    loadAvatar(steamid, function () {
      $player
        .find("#player_image")
        .attr("src", "/av/" + steamid)
        .addClass(dead ? "dead" : "");
    });
  }

  if (slot >= 1 && slot <= 5) {
    $top.find("#player_alias_text").text(slot + "| " + player.name);
  } else {
    if (slot == 10) {
      $top.find("#player_alias_text").text(player.name + " |0");
    } else {
      $top.find("#player_alias_text").text(player.name + " |" + slot);
    }
  }

  $kda_money.find("#player_kills_k").css("color", side_color);
  $kda_money.find("#player_kills_text").text(stats.kills);
  $player.find("#player_dead_kills_text").text(stats.kills);
  $kda_money.find("#player_assists_a").css("color", side_color);
  $kda_money.find("#player_assists_text").text(stats.assists);
  $player.find("#player_dead_assists_text").text(stats.assists);
  $kda_money.find("#player_deaths_d").css("color", side_color);
  $kda_money.find("#player_deaths_text").text(stats.deaths);
  $player.find("#player_dead_deaths_text").text(stats.deaths);

  if (dead) {
    $bottom.find("#player_bomb_kit_image").css("opacity", 0);
    $bottom.find("#player_armor_image").css("opacity", 0);
    $top.find("#player_health_text").css("opacity", 0);
    $player.find(".player_dead").css("opacity", 1);
    if (side.substr(8) == "left") {
      $player.find("#player_alias_text").css("left", "-35px");
      $player.find("#player_current_money_text").css("left", "-55px");
      $player.find("#player_skull").css("left", "-55px");
      $player.find("#player_round_kills_text").css("left", "-35px");
    } else if (side.substr(8) == "right") {
      $player.find("#player_alias_text").css("right", "-35px");
      $player.find("#player_current_money_text").css("left", "65px");
      $player.find("#player_skull").css("right", "-55px");
      $player.find("#player_round_kills_text").css("right", "-35px");
    }
  } else {
    $bottom.find("#player_bomb_kit_image").css("opacity", 1);
    $bottom.find("#player_armor_image").css("opacity", 1);
    $top.find("#player_health_text").css("opacity", 1);
    $player.find(".player_dead").css("opacity", 0);
    if (side.substr(8) == "left") {
      $player.find("#player_alias_text").css("left", "0px");
      $player.find("#player_current_money_text").css("left", "1px");
      $player.find("#player_skull").css("left", "0px");
      $player.find("#player_round_kills_text").css("left", "20px");
    } else if (side.substr(8) == "right") {
      $player.find("#player_alias_text").css("right", "0px");
      $player.find("#player_current_money_text").css("left", "7px");
      $player.find("#player_skull").css("right", "0px");
      $player.find("#player_round_kills_text").css("right", "20px");
    }
  }

  if (stats.burning > 0 && !dead) {
    $player.find(".burning").css("display", "block");
    $player.find("#burning_level").addClass("burnt");
    $player.find("#burning_level").css("opacity", stats.burning / 255);
  } else {
    $player.find("#burning_level").removeClass("burnt");
    $player.find(".burning").css("display", "none");
  }

  if (stats.flashed > 0 && !dead) {
    $player.find(".flashed").css("display", "block");
    $player.find("#flashed_level").addClass("blind");
    $player.find("#flashed_level").css("opacity", stats.flashed / 255);
  } else {
    $player.find("#flashed_level").removeClass("blind");
    $player.find(".flashed").css("display", "none");
  }

  if (slot == obs_slot) {
    $player
      .find("#player_spec_bar")
      .css("background-color", side_color)
      .css("opacity", 1);
  } else {
    $player.find("#player_spec_bar").css("opacity", 0);
  }

  // let desired = "linear-gradient(to " + side.substr(8) + ", " + health_color + ", " + alt_health_color + ")";
  // ! gradient_double works in browser but not on the overlay
  // let gradient_double = "linear-gradient(to " + side.substr(8) + ", rgba(0,0,0,0) " + (100 - stats.health) + "%, " + health_color + "0% " + (50 - stats.health) + "%" + ", " + alt_health_color + " 100%)";
  // ! gradient_single works in browser and on the overlay
  let gradient_single = "linear-gradient(to " + side.substr(8) + ", rgba(0,0,0,0) " + (100 - stats.health) + "%, " + alt_health_color + " " + (100 - stats.health) + "%)";

  $top.find(".player_health_bar").css("background", gradient_single);
  $top.find("#player_health_text").text(stats.health);

  let armor_icon = $bottom.find("#player_armor_image");
  armor_icon.removeClass();
  if (stats.helmet) {
    if (stats.armor == 0) {
      // armor_icon.addClass("armor_none_default");
    } else if (stats.armor <= 50) {
      armor_icon.addClass("armor_half_helm_default");
    } else if (stats.armor <= 100) {
      armor_icon.addClass("armor_helm_default");
    }
  } else {
    if (stats.armor == 0) {
      // armor_icon.addClass("armor_none_default");
    } else if (stats.armor <= 50) {
      armor_icon.addClass("armor_half_default");
    } else if (stats.armor <= 100) {
      armor_icon.addClass("armor_kev_default");
    }
  }

  $bottom.find("#player_bomb_kit_image").removeClass();
  if (stats.defusekit) {
    $bottom.find("#player_bomb_kit_image").addClass("player_kit");
  }

  $bottom.find("#player_current_money_text").css("color", dead ? COLOR_WHITE_HALF : "#a7d32e");
  $bottom.find("#player_current_money_text").text("$" + stats.money);
  if (!start_money[steamid]) {
    start_money[steamid] = stats.money;
  }

  $kda_money.find("#player_spent_text").text("-$" + (start_money[steamid] - stats.money));

  $bottom.find("#player_skull").removeClass();
  $bottom.find("#player_round_kills_text").text("");
  if (stats.round_kills > 0) {
    $bottom.find("#player_skull").addClass("player_skull_default");
    $bottom.find("#player_round_kills_text").text(stats.round_kills);
  }

  $top
    .find("#player_weapon_primary_img")
    .attr("src", "")
    .removeClass();
  $bottom
    .find("#player_weapon_secondary_img")
    .attr("src", "")
    .removeClass();

  $bottom.find("#player_nade1").removeClass();
  $bottom.find("#player_nade2").removeClass();
  $bottom.find("#player_nade3").removeClass();
  $bottom.find("#player_nade4").removeClass();
  let grenades = [];
  for (let key in weapons) {
    let weapon = weapons[key];
    let name = weapon.name.replace("weapon_", "");
    let state = weapon.state;
    let view = "";
    let type = weapon.type;
    if (type != "C4" && type != "Knife") {
      view += state == "active" ? "checked" : "holstered";
      if (type == "Grenade") {
        for (let x = 0; x < weapon.ammo_reserve; x++) {
          let nade = {
            weapon: weapon.name.substr(7),
            state: view
          };
          grenades.push(nade);
        }
      } else if (type) {
        view += side.substr(8) == "right" ? " img-hor" : "";
        if (type == "Pistol") {
          $bottom
            .find("#player_weapon_secondary_img")
            .attr("src", "/files/img/weapons/" + name + ".png")
            .addClass("invert")
            .addClass(view);
        } else {
          $top
            .find("#player_weapon_primary_img")
            .attr("src", "/files/img/weapons/" + name + ".png")
            .addClass("invert")
            .addClass(view);
        }
      }
    }
    if (type == "C4") {
      view = weapon.state == "active" ? "player_bomb_selected" : "player_bomb";
      $bottom.find("#player_bomb_kit_image").addClass(view);
    }
    if (!checkGuns(weapons)) {
      view += side.substr(8) == "right" ? " img-hor" : "";
      $top
        .find("#player_weapon_primary_img")
        .attr("src", "/files/img/weapons/" + name + ".png")
        .addClass("invert")
        .addClass(view);
    }
  }

  if (team == "ct") {
    if (teams.left.side == "ct") {
      grenades = grenades.reverse();
    }
  } else if (team == "t") {
    if (teams.left.side == "t") {
      grenades = grenades.reverse();
    }
  }

  for (let x = 0; x < grenades.length; x++) {
    $bottom.find("#player_nade" + (x + 1)).addClass("player_nade_" + grenades[x].weapon);
    $bottom.find("#player_nade" + (x + 1)).addClass(grenades[x].state);
  }
}

function removeRoundTimeGraphics() {
  $("#round_timer_text").removeClass("bomb_active");
  $("#round_timer_text").removeClass("bomb_exploded");
  $("#round_timer_text").removeClass("bomb_defused");
  $("#round_timer_text").removeClass("pause_active");
  $("#round_timer_text").removeClass("pause_active_T");
  $("#round_timer_text").removeClass("pause_active_CT");
  $("#round_timer_text").removeClass("players_eliminated_T");
  $("#round_timer_text").removeClass("players_eliminated_CT");
  $("#round_timer_text").removeClass("round_time_reached");
  $("#round_timer_text").removeClass("round_warmup");
}

var isDefusing = false;
var bomb_time, bomb_timer, bomb_timer_css;
bomb_time = 0;

function bomb(time) {
  if (Math.pow(time - bomb_time, 2) > 1) {
    clearInterval(bomb_timer);
    bomb_time = parseFloat(time);
    if (bomb_time > 0) {
      bomb_timer = setInterval(function () {
        bomb_timer_css = {
          opacity: 1,
          width: (bomb_time * 100) / 40 + "%"
        };
        $("#timers #bomb_bar").css(bomb_timer_css);
        bomb_time = bomb_time - 0.01;
      }, 10);
    } else {
      clearInterval(bomb_timer);
    }
  }
}

function resetBomb() {
  clearInterval(bomb_timer);
  if (teams.left.side == "t") {
    $("#timers #bomb_bar").css("opacity", 0);
    $("#timers #defuse_bar").css("opacity", 0);
    $("#left_team #bomb_defuse #icon").css("opacity", 0);
    $("#left_team #bomb_defuse #kit_bar").css("opacity", 0);
    $("#right_team #bomb_defuse #icon").css("opacity", 0);
    $("#right_team #bomb_defuse #kit_bar").css("opacity", 0);
  } else if (teams.right.side == "t") {
    $("#timers #bomb_bar").css("opacity", 0);
    $("#timers #defuse_bar").css("opacity", 0);
    $("#right_team #bomb_defuse #icon").css("opacity", 0);
    $("#right_team #bomb_defuse #kit_bar").css("opacity", 0);
    $("#left_team #bomb_defuse #icon").css("opacity", 0);
    $("#left_team #bomb_defuse #kit_bar").css("opacity", 0);
  }
}

function executeAnim(element, animationNameIn, length, animationNameOut) {
  $(element).css("opacity", 1);
  $(element).addClass("animated");
  $(element).addClass(animationNameIn);
  var wait = setTimeout(function () {
    $(element).removeClass(animationNameIn);
    $(element).addClass(animationNameOut);
  }, length);
  $(element).removeClass(animationNameOut);
}

function animateElement(element, animationName, callback) {
  const node = document.querySelector(element);
  node.classList.add("animated", animationName);

  function handleAnimationEnd() {
    node.removeEventListener("animationend", handleAnimationEnd);

    if (typeof callback === "function") callback();
  }
  node.addEventListener("animationend", handleAnimationEnd);
}

function showAlert(side, color, text) {
  $(side + " #alert #pole_1").css("background-color", color);
  $(side + " #alert #pole_2").css("background-color", color);
  $(side + " #alert #alert_text")
    .text(text)
    .css("color", color);
  $(side + " #alert")
    .css("opacity", 1)
    .addClass("animated fadeInUp");
}

function showAlertSlide(side, color, text) {
  $(side + " #alert #pole_1").css("background-color", color);
  $(side + " #alert #pole_2").css("background-color", color);
  $(side + " #alert #alert_text")
    .text(text)
    .css("color", color);
  if (side == "#left_team") {
    $(side + " #alert")
      .css("opacity", 1)
      .addClass("animated fadeInRight");
  } else if (side == "#right_team") {
    $(side + " #alert")
      .css("opacity", 1)
      .addClass("animated fadeInLeft");
  }
}

function hideAlert(side) {
  let element = side + " #alert";
  $(element).removeClass("animated fadeInUp");
  animateElement(element, "fadeOutDown", function () {
    $(element)
      .css("opacity", 0)
      .removeClass("animated fadeOutDown");
  });
}

function hideAlertSlide(side) {
  let element = side + " #alert";
  if (side == "#left_team") {
    $(element).removeClass("animated fadeInRight");
  } else if (side == "#right_team") {
    $(element).removeClass("animated fadeInLeft");
  }
  if (side == "#left_team") {
    anim = "fadeOutRight";
  } else if (side == "#right_team") {
    anim = "fadeOutLeft";
  }
  animateElement(element, anim, function () {
    $(element)
      .css("opacity", 0)
      .removeClass("animated")
      .removeClass(side == "#left_team" ? "fadeOutRight" : "fadeOutLeft");
  });
}

function showMiddleAlert(pole_left_color, pole_right_color, text, text_color) {
  $("#alert_middle #pole_1_middle").css("background-color", pole_left_color);
  $("#alert_middle #pole_2_middle").css("background-color", pole_right_color);
  $("#alert_middle #alert_text_middle")
    .text(text)
    .css("color", text_color);
  executeAnim("#alert_middle", "fadeInUp", 3000, "fadeOut");
}

function forceRemoveAlerts() {
  if ($("#left_team #alert").css("opacity") == 1) {
    $("#left_team #alert")
      .css("opacity", 0)
      .removeClass();
  }
  if ($("#right_team #alert").css("opacity") == 1) {
    $("#right_team #alert")
      .css("opacity", 0)
      .removeClass();
  }
  if ($("#alert_middle").css("opacity") == 1) {
    $("#alert_middle")
      .css("opacity", 0)
      .removeClass();
  }
}

function animateRoundTimer(_class, remove_graphics) {
  $("#round_timer_text")
    .css("animation-duration", "0.25s")
    .css("animation-iteration-count", "1");
  animateElement("#round_timer_text", "fadeOut", function () {
    $("#round_timer_text").removeClass("animated fadeOut");
    if (remove_graphics) removeRoundTimeGraphics();
    $("#round_timer_text")
      .text("")
      .addClass(_class);
    animateElement("#round_timer_text", "fadeIn", function () {
      $("#round_timer_text").removeClass("animated fadeIn");
    });
  });
}

function checkAliveTerrorists(players) {
  for (i = 0; i < players.length; i++) {
    if (players[i].state.health > 0) {
      return true;
    }
  }
  return false;
}

function checkPrev(previously, state) {
  if (previously.hasOwnProperty("phase_countdowns")) {
    if (previously.phase_countdowns.hasOwnProperty("phase") && previously.phase_countdowns.phase == state) {
      return true;
    }
  }
  return false;
}

function hidePlayerStats(phase, previously) {
  if (phase.phase == "live") {
    if (previously.hasOwnProperty("phase_countdowns")) {
      if (previously.phase_countdowns.hasOwnProperty("phase_ends_in")) {
        if (previously.phase_countdowns.phase_ends_in >= 110 && phase.phase_ends_in <= 109.9) {
          for (let x = 1; x <= 5; x++) {
            animateElement("#players_left #player_section #player" + x + " .player_stats_holder", "fadeOutLeft", function () {
              $("#players_left #player_section #player" + x + " .player_stats_holder")
                .css("opacity", 0)
                .removeClass("animated fadeOutLeft");
            });
            animateElement("#players_right #player_section #player" + x + " .player_stats_holder", "fadeOutRight", function () {
              $("#players_right #player_section #player" + x + " .player_stats_holder")
                .css("opacity", 0)
                .removeClass("animated fadeOutRight");
            });
          }
        } else if (phase.phase_ends_in <= 109) {
          for (let x = 1; x <= 5; x++) {
            if ($("#players_left #player_section #player" + x + " .player_stats_holder").css("opacity") !== 0)
              $("#players_left #player_section #player" + x + " .player_stats_holder").css("opacity", 0);
            if ($("#players_right #player_section #player" + x + " .player_stats_holder").css("opacity") !== 0)
              $("#players_right #player_section #player" + x + " .player_stats_holder").css("opacity", 0);
          }
        }
      }
    }
  }
}

function showPlayerStats(phase) {
  if (phase.phase == "freezetime") {
    for (let x = 1; x <= 5; x++) {
      if ($("#players_left #player_section #player" + x + " .player_stats_holder").css("opacity") == 0) {
        $("#players_left #player_section #player" + x + " .player_stats_holder").css("opacity", 1);
        animateElement("#players_left #player_section #player" + x + " .player_stats_holder", "fadeInLeft", function () {
          $("#players_left #player_section #player" + x + " .player_stats_holder").removeClass("animated fadeInLeft");
        });
      }
      if ($("#players_right #player_section #player" + x + " .player_stats_holder").css("opacity") == 0) {
        $("#players_right #player_section #player" + x + " .player_stats_holder").css("opacity", 1);
        animateElement("#players_right #player_section #player" + x + " .player_stats_holder", "fadeInRight", function () {
          $("#players_right #player_section #player" + x + " .player_stats_holder").removeClass("animated fadeInRight");
        });
      }
    }
  }
}

function checkGuns(weapons) {
  for (let key in weapons) {
    if (weapons[key].type == "Pistol" || weapons[key].type == "Rifle" || weapons[key].type == "SniperRifle" || weapons[key].type == "Submachine Gun") {
      return true;
    }
  }
  return false;
}

function updateTeamValues(left, right) {
  let left_color = left.side == "ct" ? COLOR_NEW_CT : COLOR_NEW_T;
  let right_color = right.side == "ct" ? COLOR_NEW_CT : COLOR_NEW_T;
  $("#players_left #money_text").css("color", left_color);
  $("#players_left #money_value").text("$" + left.team_money);
  $("#players_right #money_text").css("color", right_color);
  $("#players_right #money_value").text("$" + right.team_money);

  $("#players_left #equip_text").css("color", left_color);
  $("#players_left #equip_value").text("$" + left.equip_value);
  $("#players_right #equip_text").css("color", right_color);
  $("#players_right #equip_value").text("$" + right.equip_value);

  $("#players_left .loss_1").css("background-color", COLOR_WHITE_DULL);
  $("#players_left .loss_2").css("background-color", COLOR_WHITE_DULL);
  $("#players_left .loss_3").css("background-color", COLOR_WHITE_DULL);
  $("#players_left .loss_4").css("background-color", COLOR_WHITE_DULL);
  $("#players_right .loss_1").css("background-color", COLOR_WHITE_DULL);
  $("#players_right .loss_2").css("background-color", COLOR_WHITE_DULL);
  $("#players_right .loss_3").css("background-color", COLOR_WHITE_DULL);
  $("#players_right .loss_4").css("background-color", COLOR_WHITE_DULL);
  if (left.consecutive_round_losses == 0) {
    left_loss = 1400;
  } else if (left.consecutive_round_losses == 1) {
    left_loss = 1900;
    $("#players_left .loss_1").css("background-color", left_color);
  } else if (left.consecutive_round_losses == 2) {
    left_loss = 2400;
    $("#players_left .loss_1").css("background-color", left_color);
    $("#players_left .loss_2").css("background-color", left_color);
  } else if (left.consecutive_round_losses == 3) {
    left_loss = 2900;
    $("#players_left .loss_1").css("background-color", left_color);
    $("#players_left .loss_2").css("background-color", left_color);
    $("#players_left .loss_3").css("background-color", left_color);
  } else if (left.consecutive_round_losses >= 4) {
    left_loss = 3400;
    $("#players_left .loss_1").css("background-color", left_color);
    $("#players_left .loss_2").css("background-color", left_color);
    $("#players_left .loss_3").css("background-color", left_color);
    $("#players_left .loss_4").css("background-color", left_color);
  }

  if (right.consecutive_round_losses == 0) {
    right_loss = 1400;
  } else if (right.consecutive_round_losses == 1) {
    right_loss = 1900;
    $("#players_right .loss_1").css("background-color", right_color);
  } else if (right.consecutive_round_losses == 2) {
    right_loss = 2400;
    $("#players_right .loss_1").css("background-color", right_color);
    $("#players_right .loss_2").css("background-color", right_color);
  } else if (right.consecutive_round_losses == 3) {
    right_loss = 2900;
    $("#players_right .loss_1").css("background-color", right_color);
    $("#players_right .loss_2").css("background-color", right_color);
    $("#players_right .loss_3").css("background-color", right_color);
  } else if (right.consecutive_round_losses >= 4) {
    right_loss = 3400;
    $("#players_right .loss_1").css("background-color", right_color);
    $("#players_right .loss_2").css("background-color", right_color);
    $("#players_right .loss_3").css("background-color", right_color);
    $("#players_right .loss_4").css("background-color", right_color);
  }

  $("#players_left #loss_text").css("color", left_color);
  $("#players_left #loss_value").text("$" + left_loss);
  $("#players_right #loss_text").css("color", right_color);
  $("#players_right #loss_value").text("$" + right_loss);
}

function countNades(left, right) {
  var count_left_smokegrenade = 0,
    count_left_incgrenade = 0,
    count_left_molotov = 0,
    count_left_flashbang = 0,
    count_left_hegrenade = 0;
  var count_right_smokegrenade = 0,
    count_right_incgrenade = 0,
    count_right_molotov = 0,
    count_right_flashbang = 0,
    count_right_hegrenade = 0;

  let side_left = left.side.toUpperCase();
  let side_right = right.side.toUpperCase();

  for (let key in left.players) {
    let player = left.players[key];
    let weapons = player.getWeapons();
    for (let key2 in weapons) {
      let weapon = weapons[key2];
      let name = weapon.name.replace("weapon_", "");
      let type = weapon.type;
      if (type == "Grenade") {
        switch (name) {
          case "smokegrenade":
            count_left_smokegrenade += 1;
            break;
          case "incgrenade":
            count_left_incgrenade += 1;
            break;
          case "molotov":
            count_left_molotov += 1;
            break;
          case "flashbang":
            count_left_flashbang += 1;
            break;
          case "hegrenade":
            count_left_hegrenade += 1;
            break;
        }
      }
    }
  }

  for (let key in right.players) {
    let player = right.players[key];
    let weapons = player.getWeapons();
    for (let key2 in weapons) {
      let weapon = weapons[key2];
      let name = weapon.name.replace("weapon_", "");
      let type = weapon.type;
      if (type == "Grenade") {
        switch (name) {
          case "smokegrenade":
            count_right_smokegrenade += weapon.ammo_reserve;
            break;
          case "incgrenade":
            count_right_incgrenade += weapon.ammo_reserve;
            break;
          case "molotov":
            count_right_molotov += weapon.ammo_reserve;
            break;
          case "flashbang":
            count_right_flashbang += weapon.ammo_reserve;
            break;
          case "hegrenade":
            count_right_hegrenade += weapon.ammo_reserve;
            break;
        }
      }
    }
  }

  $("#players_left #util_nade_1").removeClass();
  $("#players_left #util_nade_2").removeClass();
  $("#players_left #util_nade_3").removeClass();
  $("#players_left #util_nade_4").removeClass();
  $("#players_right #util_nade_1").removeClass();
  $("#players_right #util_nade_2").removeClass();
  $("#players_right #util_nade_3").removeClass();
  $("#players_right #util_nade_4").removeClass();

  let total_left = count_left_smokegrenade + count_left_incgrenade + count_left_molotov + count_left_flashbang + count_left_hegrenade;
  let total_right = count_right_smokegrenade + count_right_incgrenade + count_right_molotov + count_right_flashbang + count_right_hegrenade;

  if (total_left == 0) {
    $("#players_left #box_heading_subtext")
      .text("- None")
      .css("color", "#f21822");
  } else if (total_left <= 5) {
    $("#players_left #box_heading_subtext")
      .text("- Poor")
      .css("color", "#f25618");
  } else if (total_left <= 9) {
    $("#players_left #box_heading_subtext")
      .text("- Low")
      .css("color", "#f29318");
  } else if (total_left <= 14) {
    $("#players_left #box_heading_subtext")
      .text("- Good")
      .css("color", "#8ef218");
  } else if (total_left >= 15) {
    $("#players_left #box_heading_subtext")
      .text("- Great")
      .css("color", "#32f218");
  } else if (total_left == 20) {
    $("#players_left #box_heading_subtext")
      .text("- Full")
      .css("color", "#22f222");
  }

  if (total_right == 0) {
    $("#players_right #box_heading_subtext")
      .text("- None")
      .css("color", "#f21822");
  } else if (total_right <= 5) {
    $("#players_right #box_heading_subtext")
      .text("- Poor")
      .css("color", "#f25618");
  } else if (total_right <= 9) {
    $("#players_right #box_heading_subtext")
      .text("- Low")
      .css("color", "#f29318");
  } else if (total_right <= 14) {
    $("#players_right #box_heading_subtext")
      .text("- Good")
      .css("color", "#8ef218");
  } else if (total_right >= 15) {
    $("#players_right #box_heading_subtext")
      .text("- Great")
      .css("color", "#32f218");
  } else if (total_right == 20) {
    $("#players_right #box_heading_subtext")
      .text("- Full")
      .css("color", "#22f222");
  }

  $("#players_left #box_heading_text").css("color", side_left == "CT" ? COLOR_NEW_CT : COLOR_NEW_T);
  $("#players_right #box_heading_text").css("color", side_right == "CT" ? COLOR_NEW_CT : COLOR_NEW_T);

  $("#players_left #util_nade_1_count").text("x" + count_left_smokegrenade);
  $("#players_left #util_nade_1").addClass("util_smokegrenade_" + side_left);
  $("#players_left #util_nade_2_count").text("x" + (count_left_incgrenade + count_left_molotov));
  $("#players_left #util_nade_2").addClass(side_left == "CT" ? "util_incgrenade_CT" : "util_molotov_T");
  $("#players_left #util_nade_3_count").text("x" + count_left_flashbang);
  $("#players_left #util_nade_3").addClass("util_flashbang_" + side_left);
  $("#players_left #util_nade_4_count").text("x" + count_left_hegrenade);
  $("#players_left #util_nade_4").addClass("util_hegrenade_" + side_left);

  $("#players_right #util_nade_4_count").text("x" + count_right_smokegrenade);
  $("#players_right #util_nade_4").addClass("util_smokegrenade_" + side_right);
  $("#players_right #util_nade_3_count").text("x" + (count_right_incgrenade + count_right_molotov));
  $("#players_right #util_nade_3").addClass(side_right == "CT" ? "util_incgrenade_CT" : "util_molotov_T");
  $("#players_right #util_nade_2_count").text("x" + count_right_flashbang);
  $("#players_right #util_nade_2").addClass("util_flashbang_" + side_right);
  $("#players_right #util_nade_1_count").text("x" + count_right_hegrenade);
  $("#players_right #util_nade_1").addClass("util_hegrenade_" + side_right);
}

printed_player_data = false;
// Turn on to get the players steamid's in game, useful for creating players in DB
function printPlayerData(players) {
  if (!printed_player_data) {
    players_data = [];
    players.forEach(function (player) {
      data = {
        name: player.name,
        steamid: player.steamid
      };
      players_data.push(data);
    });
    console.log(players_data);
    printed_player_data = true;
  }
}
$(document).ready(function() {
  let id = null;

  listPlayers();

  loadTeams(function(teams) {
    $teamList = $("#teams_list");
    $teamList.html("<option value='default'>No team</option>");

    teams.forEach(function(team, id) {
      let $option = $("<option value='" + team._id + "'>" + team.team_name + " (" + team.short_name + ")</option>");
      $("#teams_list").append($option);
    }, this);

    $("#teams_list").formSelect();
  });

  $("#players").change(function() {
    let i = $(this).val();
    loadPlayer(playersOverall[i]);

    if (playersOverall[i]) id = playersOverall[i]._id;

    $("#country").formSelect();
  });
  $("#save_player").click(function() {
    let form = $("form")[1];
    let form_data = new FormData(form);

    for (var pair of form_data.entries()) {
      if (pair[0] == "flag") {
        form_data.append("country_code", pair[1]);
        form_data.delete("flag");
      }
    }

    let localId = $("#players").val();
    if (localId == "default") {
      addPlayer(form_data);
    } else {
      form_data.set("_id", id);
      updatePlayer(form_data, id);
    }
  });
  $("#delete_player").click(function() {
    deletePlayer(id);
  });
  $("#delete_avatar").click(function() {
    deleteAvatar(id);
  });
});

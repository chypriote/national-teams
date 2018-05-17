function previewFile() {
  const preview = document.getElementById('output');
  const file = document.querySelector('input[type=file]').files[0];
  const reader = new FileReader();

  reader.addEventListener('load', () => {
    preview.src = reader.result;
  }, false);

  if (file) {
    reader.readAsDataURL(file);
  }
}

function getLeagueTeams(event, league) {
  event.preventDefault();
  fetch(`/api/leagues/${league}/teams`).then(response => response.json())
    .then((response) => {
      const select = document.getElementById('teamNames');
      select.options.length = 0;

      response.forEach((elem) => {
        const option = document.createElement('option');
        option.text = elem.name;
        option.value = elem._id;
        select.add(option);
      });
    });
}

function deleteTeam(teamId) {
  fetch(`/api/teams/${teamId}`, { method: 'delete' }).then(() => {
    window.location = '/';
  });
}
function deleteLeague(leagueId) {
	fetch(`/api/leagues/${leagueId}`, { method: 'delete' }).then(() => {
		window.location = '/';
	});
}

$('#countries').select2();

$('button[data-filter]').click(function () {
  const league = $(this).attr('data-filter');
  $('#leagueSelect').html($(this).html());

  if (league === 'all') { return $('[data-league]').fadeIn('fast'); }

  $('[data-league]').hide();
  $(`[data-league][data-league="${league}"]`).fadeIn('fast');
});

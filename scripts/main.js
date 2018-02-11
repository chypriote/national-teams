function previewFile() {
  const preview = document.getElementById('output');
  const file    = document.querySelector('input[type=file]').files[0];
  const reader  = new FileReader();

  reader.addEventListener("load", function () {
    preview.src = reader.result;
  }, false);

  if (file) {
    reader.readAsDataURL(file);
  }
}

function getRegionTeams(event, region) {
  event.preventDefault();
  fetch('/api/teams/' + region).then(function (response) {return response.json();})
    .then(function (response) {
      const select = document.getElementById('teamNames');
      select.options.length = 0;

      response.forEach(function (elem) {
        let option = document.createElement('option');
        option.text = elem.name;
        option.value = elem._id;
        select.add(option);
      });
    });
}

function deleteTeam(teamId) {
  fetch('/api/teams/' + teamId, {method: 'delete'}).then(function () {
    window.location = '/';
  });
}

$('button[data-filter]').click(function () {
  let region = $(this).attr('data-filter');
  $('#regionSelect').html($(this).html());

  if (region === 'all')
    return $('[data-region]').fadeIn("fast");

  $('[data-region]').hide();
  $('[data-region][data-region="'+region+'"]').fadeIn("fast");
});
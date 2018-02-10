function previewFile() {
  var preview = document.getElementById('output');
  var file    = document.querySelector('input[type=file]').files[0];
  var reader  = new FileReader();

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
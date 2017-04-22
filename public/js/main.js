$(document).ready(function () {
    console.log("Page ready");
    $('.deleteUser').on('click', deleteUser)
    $('.updateUser').on('click', updateUser)
})

function deleteUser () {
    console.log("Entered deleteUser")
    var confirmation = confirm('Are You Sure?')

    if (confirmation) {
        $.ajax({
            type: 'DELETE',
            url: '/students/delete/' + $(this).data('id')
        }).done(function (response) {
            window.location.replace('/')
        })
        window.location.replace('/')
    } else {
        return false;
    }
}

function updateUser () {
  $.ajax({
    type: 'GET',
    url: '/students/update/' + $(this).data('id')
  }).done(function (response) {
    window.location.replace('/')
  })
  window.location.replace('/')
} else {
  return false;
}

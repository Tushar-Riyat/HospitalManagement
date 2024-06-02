// script.js
$(document).ready(function () {
    $('.submitButton').on('click', function (e) {
        e.preventDefault();
        let userName = $('#userName').val();
        let password = $('#password').val();

        $.ajax({
            type: 'POST',
            url: '/api/user/login',  // Replace with your actual login URL
            data: { userName: userName, password: password },
            success: function (response, textStatus, jqXHR) {
                if (jqXHR.status === 200) {
                    alert('Login successful!');
                } else {
                    $('#password').addClass('vibrate');
                    setTimeout(function () {
                        $('#password').removeClass('vibrate');
                    }, 500);
                }
            },
            error: function (response) {
                $('#password').addClass('vibrate');
                setTimeout(function () {
                    $('#password').removeClass('vibrate');
                }, 500);
            }
        });
    });
});

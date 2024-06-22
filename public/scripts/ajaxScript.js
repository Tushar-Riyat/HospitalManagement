// script.js
$(document).ready(function () {
    $('.submitButton').on('click', function (e) {
        e.preventDefault();
        let userName = $('#userName').val();
        let password = $('#password').val();
        $.ajax({
            type: 'POST',
            url: '/api/user/login',
            data: { userName: userName, password: password },
            success: function (response, textStatus, jqXHR) {
                if (jqXHR.status === 200) {
                    console.log('testing ajax');
                    window.location.href = response.redirectURL;
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

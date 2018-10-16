'use strict';

$(document).ready(function () {
    'use strict';

    function validateField($input) {
        var errorMessage;
        var top = $input.position().top;

        var value = $input.val();
        var valid = true;
        var pattern;

        console.log(value);

        if ($input.attr('type') == 'text') {
            pattern = /^[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё0-9\._-]{3,19}$/;
            errorMessage = 'От 4 до 20 символов';
        } else if ($input.attr('type') == 'email') {
            pattern = /^[a-z0-9_-]+([\.a-z]+)?@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/i;
            errorMessage = 'Некорректный email';
        } else if ($input.attr('type') == 'password') {
            pattern = /^[a-z][a-z0-9_-]{4,}$/i;
            errorMessage = 'От 5 символов';
        } else if ($input.attr('type') == 'tel') {
            errorMessage = 'Введите номер телефона без разделителей, скобок и дефисов';
            // pattern = /(8|\+7)?\d{11,17}/;
            pattern = /(\+7)?\d{11,17}/;
            top = $input.position().top;
        }

        if (value.search(pattern) == -1) {
            /*$input.addClass('error');
              if($input.prev().hasClass('errorTitle') == false) {
                $input.before('<div class="errorTitle">' + errorMessage);
                $input.prev('.errorTitle').css({'display':'inline-block', 'top':top});
            } else {
                $input.prev('.errorTitle').css({'display':'inline-block', 'top':top});
            }*/
            valid = false;
        } else {
            /*$input.removeClass('error');
            $input.prev('.errorTitle').css({'display':'none'});*/
        }

        return valid;
    }

    $('.help-info').tooltip();

    $('[data-toggle="password-show"]').on('change', function (event) {
        var $toggler = $(this);
        var $target = $($toggler.attr('data-target'));

        var type = $target.attr('type');
        var targetType = type == 'password' ? 'text' : 'password';

        $target.attr('type', targetType);
        return false;
    });

    $('[data-pattern]').on('keyup', function () {
        var $phone = $(this);
        var valid;
        var $submitButton = $('[type=submit]');

        if ($phone.val().length > 1) {
            valid = validateField($phone);
        } else if ($phone.val().length == 1) {
            valid = validateField($phone);
        }

        if (valid) {
            $submitButton.removeAttr('disabled');
        } else {
            $submitButton.attr('disabled', 'disabled');
        }
    });

    /*$('[disabled]').on('click', function() {
        console.log('disabled');
    });*/
});
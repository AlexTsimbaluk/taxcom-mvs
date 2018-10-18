'use strict';

$(document).ready(function () {
    'use strict';

    $('.storage-item').on('click', function () {
        var $storage = $(this);
        if (!$storage.hasClass('selected')) {
            $storage.closest('.storage-list').find('.storage-item.selected').removeClass('selected');

            $storage.addClass('selected');
        }
    });

    function validateField($input) {
        var value = $input.val();
        var type = $input.attr('data-type') ? $input.attr('data-type') : $input.attr('type');
        var pattern;
        var errorMessage;
        var top = $input.position().top;

        var valid = true;

        if (type == 'confirmation-code') {
            // pattern = /\b\d{5}\b/;
            pattern = /^\d{5}$/;
            errorMessage = 'Введите пятизначный цифровой код';
        } else if (type == 'text') {
            pattern = /^[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё0-9\._-]{3,}$/;
            errorMessage = 'От 4 до 20 символов';
        } else if (type == 'email') {
            pattern = /^[a-z0-9_-]+([\.a-z]+)?@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/i;
            errorMessage = 'Некорректный email';
        } else if (type == 'password') {
            pattern = /^[a-z][a-z0-9_-\.]{4,}$/i;
            errorMessage = 'От 5 символов';
        } else if (type == 'tel') {
            console.log(phoneMaskInput);
            value = phoneMaskInput.getRawValue();
            errorMessage = 'Введите номер телефона без разделителей, скобок и дефисов';
            pattern = /^(\+7)\d{10,}$/;
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

        console.log(valid);

        return valid;
    }

    function validateForm() {
        var valid = true;

        $('[data-required]').each(function (index, element) {
            var $input = $(element);
            var $formGroup = $input.closest('.form-group');

            valid = validateField($input);

            if (!valid) {
                if (!$formGroup.hasClass('not-valid')) {
                    $formGroup.addClass('not-valid');
                }
            } else {
                if ($formGroup.hasClass('not-valid')) {
                    $formGroup.removeClass('not-valid');
                }
            }
        });

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

    $('[data-required]').on('keyup', function () {
        var $input = $(this);
        var $formGroup = $input.closest('.form-group');
        var $submitButton = $('[type=submit][data-disabled-button]');

        var valid;

        if ($input.val().length > 1) {
            valid = validateField($input);
        } else if ($input.val().length == 1) {
            valid = validateField($input);
        }

        if (valid) {
            $submitButton && $submitButton.removeAttr('disabled');

            if ($formGroup.hasClass('not-valid')) {
                $formGroup.removeClass('not-valid');
            }
        } else {
            $submitButton && $submitButton.attr('disabled', 'disabled');

            if ($formGroup.hasClass('not-valid')) {
                $formGroup.addClass('not-valid');
            }
        }
    });

    $('[type=submit]').on('click', function (event) {
        event.preventDefault();

        var $submit = $(this);
        var successLocation = $submit.attr('data-success-location');

        if (validateForm()) {
            window.location.pathname = successLocation;
        }
    });
});
'use strict';

// https://github.com/nosir/cleave.js/blob/master/doc/public-methods.md
var phoneMaskInput = new Cleave('[data-mask=phone]', {
    phone: true,
    phoneRegionCode: 'RU'
});
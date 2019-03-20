$(window).on('load', function() {
    'use strict';

    var phoneMaskInput;
    initPhoneMask();

    // меню в шапке
    $('.toggle-nav').on('click', function(e) {
        if(!$('body').hasClass('menu-visible')) {
            $('body').addClass('menu-visible');
        }
        else {
            $('body').removeClass('menu-visible');
        }
    });

    // кастомные селекты
    // https://github.com/selectize/selectize.js
    $('[data-select=selectize]').selectize({
        create: true,
        sortField: 'text'
    });

    // таймер для кнопки Отправить код повторно через 60 сек
    (function() {
        var $buttonWithCounter = $('[data-disabled-counter]');
        var $counter = $buttonWithCounter.find('[data-counter]');
        var time = +$counter.attr('data-counter-time');

        $counter.text(time);

        var countInterval = setInterval(() => {
            if(time <= 0) {
                clearInterval(countInterval);
                $buttonWithCounter
                    .removeAttr('disabled')
                    .html('Отправить код повторно');

                return false;
            }

            $counter.text(--time);
        }, 1000);
    })();

    // progress-bar
    /*$('.progress-bar').animate({
        width: '100%'
    }, 5000, function() {
        changeLocation('cert-info.html');
    });*/

    if($('.js-get-cert-progress').length) {
        setTimeout(() => {
            $('.js-get-cert-progress').removeClass('state-waiting').addClass('state-success');
            setTimeout(() => {
                changeLocation('cert-info.html');
            }, 500);
        }, 4000);
    }


    $('.storage-item').on('click', function() {
        var $storage = $(this);
        if(!$storage.hasClass('selected')) {
            $storage
                .closest('.storage-list')
                .find('.storage-item.selected')
                .removeClass('selected');

            $storage.addClass('selected');
        }
    });

    $('.cert-list .cert-item').on('click', function() {
        var $el = $(this);
        if(!$el.hasClass('selected')) {
            $el
                .closest('.cert-list')
                .find('.cert-item.selected')
                .removeClass('selected');

            $el.addClass('selected');
        }
    });



    // https://github.com/nosir/cleave.js/blob/master/doc/public-methods.md
    function initPhoneMask() {
        if(!$('[data-mask="phone"]').length) return;

        phoneMaskInput = new Cleave('[data-mask=phone]', {
            phone: true,
            phoneRegionCode: 'RU'
        });

        let startVal = '+7';
        let startValArray = startVal.split('');

        $('[data-mask=phone]').trigger('focus');

        phoneMaskInput.setRawValue(startVal);

        $('[data-mask=phone]').on('keyup', function(e) {
            let formattedVal = phoneMaskInput.getFormattedValue();
            let rawVal = phoneMaskInput.getRawValue();

            if(rawVal.indexOf(startValArray[0]) != 0 && rawVal.indexOf(startValArray[1]) == 0) {
                phoneMaskInput.setRawValue(startValArray[0] + rawVal.substr(0));
            } else if(rawVal.indexOf(startValArray[1]) != 1 && rawVal.indexOf(startValArray[0]) == 0) {
                phoneMaskInput.setRawValue(startValArray[0] + startValArray[1] + rawVal.substr(1));
            }
        });
    }

    function validateField($input) {
        var value = $input.val();
        var type = $input.attr('data-type') ? $input.attr('data-type') : $input.attr('type');
        var pattern;
        var errorMessage;
        var top = $input.position().top;

        var valid = true;

        if(type == 'confirmation-code') {
            // pattern = /\b\d{5}\b/;
            pattern = /^\d{4}$/;
            errorMessage = 'Введите четырехзначный код';
        } else if(type == 'text') {
            pattern = /^[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё0-9\._-]{3,}$/;
            errorMessage = 'От 4 до 20 символов';
        } else if(type == 'email') {
            pattern = /^[a-z0-9_-]+([\.a-z]+)?@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/i;
            errorMessage = 'Некорректный email';
        } else if(type == 'password') {
            // pattern = /^[a-z][a-z0-9_-\.]{4,}$/i;
            pattern = /^[\d\w\._-]{5,}$/i;
            errorMessage = 'От 5 символов';
        } else if(type == 'tel') {
            value = phoneMaskInput.getRawValue();
            errorMessage = 'Введите номер телефона без разделителей, скобок и дефисов';
            pattern = /^(\+7)\d{10,}$/;
        }

        if(value.search(pattern) == -1) {
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

    function validateForm() {
        var valid = true;

        $('[data-required]').each(function(index, element) {
            var $input = $(element);
            var $formGroup = $input.closest('.form-group');

            valid = validateField($input);

            if(!valid) {
                if(!$formGroup.hasClass('not-valid')) {
                    $formGroup.addClass('not-valid');
                }
            } else {
                if($formGroup.hasClass('not-valid')) {
                    $formGroup.removeClass('not-valid');
                }
            }
        });

        return valid;
    }




    $('.help-info').tooltip();

    $('[data-toggle="password-show"]').on('change', function(event) {
        var $toggler = $(this);
        var $target = $($toggler.attr('data-target'));

        var type = $target.attr('type');
        var targetType = (type == 'password') ? 'text' : 'password';

        $target.attr('type', targetType);
        return false;
    });


    // цифровой код подтверждения
    // input[type=number] позволяет ввести символы -, +, e, поэтому запретим их
    // разрешим цифры, стрелки курсора, удаление и Enter
    $('[data-required][data-maxlength][data-type="confirmation-code"]').on('keydown', function(e) {
        var code = e.keyCode;

        if((code < 48 || (code > 57 && code < 96) || code > 105) &&
            (code != 8 && code != 46 && code != 37 && code != 39 && code != 13)
        ) {
            return false;
        }
    });

    // event.type должен быть keypress
    function getChar(event) {
        if (event.which == null) { // IE
            if (event.keyCode < 32) return null; // спец. символ
            return event.keyCode;
        }

        if (event.which != 0 && event.charCode != 0) { // все кроме IE
            if (event.which < 32) return null; // спец. символ
            return event.which;
        }

        return null; // спец. символ
    }

    $('[data-required]').on('keyup', function(e) {
        var $input = $(this);
        var $formGroup = $input.closest('.form-group');
        var $submitButton = $('[type=submit][data-disabled-button]');

        var valid;

        if($input.val().length > +$input.attr('data-maxlength')) {
            $input.val($input.val().substr(0, +$input.attr('data-maxlength')));
        }

        if($input.val().length > 1) {
            valid = validateField($input);
        } else if($input.val().length == 1) {
            valid = validateField($input);
        }

        if(valid) {
            $submitButton && $submitButton.removeAttr('disabled');

            if($formGroup.hasClass('not-valid')) {
                $formGroup.removeClass('not-valid');
            }
        } else {
            $submitButton && $submitButton.attr('disabled', 'disabled');

            if($formGroup.hasClass('not-valid')) {
                $formGroup.addClass('not-valid');
            }
        }
    });

    $('[type=submit]').on('click', function(event) {
        event.preventDefault();

        var $submit = $(this);

        changeLocation($submit.attr('data-success-location'));
    });

    // переход на другую страницу
    function changeLocation(path) {
        var successLocation = path;
        var path = window.location.pathname;

        path = path.split('/');
        path[path.length - 1] = successLocation;
        path = path.join('/');

        if(validateForm()) {
            window.location.pathname = path;
        }
    }
});

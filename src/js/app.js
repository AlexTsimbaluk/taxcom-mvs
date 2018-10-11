'use strict';

$(document).ready(function () {
    $('.help-info').tooltip();

    $('[data-toggle="password-show"]').on('change', function (event) {
        var $toggler = $(this);
        var $target = $($toggler.attr('data-target'));

        var type = $target.attr('type');
        var targetType = type == 'password' ? 'text' : 'password';

        $target.attr('type', targetType);
        return false;
    });
});
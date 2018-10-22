// https://github.com/nosir/cleave.js/blob/master/doc/public-methods.md
var phoneMaskInput = new Cleave('[data-mask=phone]', {
    phone: true,
    phoneRegionCode: 'RU'
});

phoneMaskInput
    .setRawValue('+7')
;

$('[data-mask=phone]')
    .trigger('focus')
;

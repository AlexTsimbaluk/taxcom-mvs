// https://github.com/nosir/cleave.js/blob/master/doc/public-methods.md
var phoneMaskInput = new Cleave('[data-mask=phone]', {
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

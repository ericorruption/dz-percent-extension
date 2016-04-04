'use strict';

var $setDefaultsBtn,
    $aboutBtn,
    $contextField,
    $baseField,
    $percentField;



var utils = {
  tidyNumeric: function(value) {
    var tidiedNumeric = value.replace(/[^0-9.]/ig, '');
    tidiedNumeric  = tidiedNumeric.replace(/^\.+|\.+$/, '');
    return Math.abs(tidiedNumeric);
  },

  tidyDecimal: function(value, decimalPoints) {
    return Math.abs(value.toFixed(decimalPoints));
  }
};



function calculate(e) {
  var targetId = e.target.id,
      value = utils.tidyNumeric(e.target.value),
      contextValue = utils.tidyNumeric($contextField.value),
      baseValue    = utils.tidyNumeric($baseField.value),
      percentValue = utils.tidyNumeric($percentField.value);

  switch(targetId) {
    case 'context':
      $percentField.value = '0%';

      if (value !== 0) {
        $percentField.value = utils.tidyDecimal(100 * (baseValue / value) , 3) + '%';
      }

      if (e.type === 'blur') {
        e.target.value = utils.tidyDecimal(value, 0) + 'px';
      }

      break;

    case 'base':
      $percentField.value = '0%';

      if (value !== 0 && contextValue !== 0) {
        $percentField.value = utils.tidyDecimal(100 * (value / contextValue) , 3) + '%';
      }

      if (e.type === 'blur') {
        e.target.value = utils.tidyDecimal(value, 0) + 'px';
      }

      break;

    case 'percent':
      $baseField.value = utils.tidyDecimal(contextValue * value / 100, 0) + 'px';

      if (e.type === 'blur') {
        e.target.value = utils.tidyDecimal(value, 3) + '%';
      }
      break;
  }
}



function init() {
  $setDefaultsBtn = document.getElementById('set-defaults');
  $aboutBtn       = document.getElementById('about-show');
  $contextField   = document.getElementById('context');
  $baseField      = document.getElementById('base');
  $percentField   = document.getElementById('percent');

  var fields = [$contextField, $baseField, $percentField];

  for (var i = 0; i < fields.length; i++) {
    fields[i].addEventListener('input', calculate);
    fields[i].addEventListener('blur', calculate);
  }
}

document.addEventListener('DOMContentLoaded', init);
